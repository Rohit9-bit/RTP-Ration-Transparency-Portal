import { prisma } from "../DB/db.config.js";
import { Prisma } from "@prisma/client";

const dashboard = async (req, res) => {
  try {
    // System Performance Matrix

    // Total Ration distributed
    const totalRationDistributed = await prisma.transaction_log.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      _sum: {
        quantity_received: true,
      },
    });

    // Total Active distribution centers
    const totalActiveDistributionCenters =
      await prisma.distribution_center.count();

    // Total grievances filed
    const totalGrievancesFiled = await prisma.grievance.count({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        },
      },
    });

    // Total Beneficiary Registered
    const totalBeneficiariesRegistered = await prisma.beneficiary.count();

    // Distribution Efficiency trend
    function formatMonthLabel(d) {
      return d.toLocaleString("en-US", { month: "short" }); // Jan, Feb, ...
    }

    function monthKey(d) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    }

    const months = [];
    const monthsWithYear = [];
    const now = new Date();
    const last_Months = 3;
    for (let i = 1; i <= last_Months; i++) {
      const newMonth = new Date(
        now.getFullYear(),
        now.getMonth() - (last_Months - i),
        1
      );
      months.push(formatMonthLabel(newMonth));
      monthsWithYear.push(monthKey(newMonth));
    }

    const startDate = new Date(
      now.getFullYear(),
      now.getMonth() - last_Months,
      1
    );
    const endDate = new Date();

    const efficiencyData = await prisma.transaction_log.groupBy({
      by: ["createdAt"],
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        quantity_entitled: true,
        quantity_received: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const DataMap = new Map();
    for (const row of efficiencyData) {
      const key = monthKey(row.createdAt);
      if (!DataMap.has(key)) {
        DataMap.set(key, {
          createdAt: key,
          quantity_entitled: row._sum.quantity_entitled,
          quantity_received: row._sum.quantity_received,
        });
      }
      DataMap.get(key).quantity_entitled += row._sum.quantity_entitled;
      DataMap.get(key).quantity_received += row._sum.quantity_received;
    }

    const efficiency = [];
    for (const eff of monthsWithYear) {
      const entry = DataMap.get(eff);
      if (!entry) {
        efficiency.push(null);
      } else {
        efficiency.push(
          ((entry.quantity_received / entry.quantity_entitled) * 100).toFixed(2)
        );
      }
    }

    console.log(months, efficiency);

    // District Performance
  
    const districtWithCenters = await prisma.distribution_center.findMany({
      take: 5,
      select: {
        center_id: true,
        district: true,
        transaction_logs: {
          select: {
            quantity_entitled: true,
            quantity_received: true
          }
        }
      },
    });

    const results = districtWithCenters.map(distrct=>{
      const total = distrct.transaction_logs.reduce((acc, curr)=>{
        acc.quantity_entitled += curr.quantity_entitled ?? 0;
        acc.quantity_received += curr.quantity_received ?? 0;
        return acc;
      }, {quantity_entitled: 0, quantity_received: 0})
      return {
        distrct: distrct.district,
        entitled: total.quantity_entitled,
        received: total.quantity_received,
        efficiency: +((total.quantity_received / total.quantity_entitled) * 100).toFixed(2) || 100,
      }
    })

    const districtEfficiency = new Map();
    for(const entry of results){
      const key = entry.distrct;
      if(!districtEfficiency.has(key)){
        districtEfficiency.set(key, {district: key, centers: 1, efficiency: (entry.efficiency || 0)})
      }else{
        districtEfficiency.get(key).centers += 1;
        const eff = districtEfficiency.get(key).efficiency;
        districtEfficiency.get(key).efficiency = (eff + entry.efficiency)/2;
      }
    }

    console.log(...districtEfficiency.values());


    // Top Performing Distribution Centers

    // const centerEfficiency = await prisma.transaction_log.groupBy({
    //   by: ["centerId"],
    //   _sum: {
    //     quantity_entitled: true,
    //     quantity_received: true,
    //   },
    // });

    // console.log("centerEfficiency: ", centerEfficiency);

    // const rankedCenters = await Promise.all(
    //   centerEfficiency.map(async (entry) => {
    //     const efficiency =
    //       (entry._sum.quantity_received / entry._sum.quantity_entitled) * 100;

    //     const centerDetails = await prisma.distribution_center.findUnique({
    //       where: {
    //         center_id: entry.centerId,
    //       },
    //       select: {
    //         center_id: true,
    //         center_name: true,
    //         state: true,
    //         district: true,
    //       },
    //     });

    //     const familiesServed = await prisma.transaction_log.groupBy({
    //       by: ["beneficiaryId"],
    //       where: {
    //         centerId: entry.centerId,
    //       },
    //       _count: {
    //         beneficiaryId: true,
    //       },
    //     });

    //     return {
    //       centerId: entry.centerId,
    //       efficiency: parseFloat(efficiency.toFixed(2)),
    //       familiesServed: familiesServed._count?.beneficiaryId,
    //       state: centerDetails.state,
    //       district: centerDetails.district,
    //     };
    //   })
    // );

    // const top4Centers = rankedCenters
    //   .sort((a, b) => {
    //     b.efficiency - a.efficiency;
    //   })
    //   .slice(0, 5);

    // console.log("top4centers: ", top4Centers);

    // const enriched = rankedCenters.map(async (entry) => {
    //   console.log("entry: ", entry[0].center);
    //   const centersDetails = await prisma.distribution_center.findUnique({
    //     where: {
    //       center_id: entry[0].center,
    //     },
    //     select: {
    //       center_id: true,
    //       center_name: true,
    //       state: true,
    //       district: true,
    //     },
    //   });
    //   return [...entry, centersDetails];
    // });

    // console.log("enriched: ", enriched)

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!", error });
  }
};

export { dashboard };
