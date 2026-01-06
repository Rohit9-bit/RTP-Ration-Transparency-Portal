import { prisma } from "../DB/db.config.js";
import { Prisma } from "@prisma/client";

const dashboard = async (req, res) => {
  try {
    // System Performance Matrix

    // Total Ration distributed
    const totalRationDistributed = await prisma.transaction_log.aggregate({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
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
          +((entry.quantity_received / entry.quantity_entitled) * 100).toFixed(
            2
          )
        );
      }
    }

    const distribution_efficiency_trend = [
      { months: months, efficiency: efficiency },
    ];

    // District Performance

    const districtWithCenters = await prisma.distribution_center.findMany({
      take: 5,
      select: {
        center_id: true,
        district: true,
        transaction_logs: {
          select: {
            quantity_entitled: true,
            quantity_received: true,
          },
        },
      },
    });

    const results = districtWithCenters.map((distrct) => {
      const total = distrct.transaction_logs.reduce(
        (acc, curr) => {
          acc.quantity_entitled += curr.quantity_entitled ?? 0;
          acc.quantity_received += curr.quantity_received ?? 0;
          return acc;
        },
        { quantity_entitled: 0, quantity_received: 0 }
      );
      return {
        distrct: distrct.district,
        entitled: total.quantity_entitled,
        received: total.quantity_received,
        efficiency:
          +((total.quantity_received / total.quantity_entitled) * 100).toFixed(
            2
          ) || 100,
      };
    });

    const districtEfficiency = new Map();
    for (const entry of results) {
      const key = entry.distrct;
      if (!districtEfficiency.has(key)) {
        districtEfficiency.set(key, {
          district: key,
          centers: 1,
          efficiency: entry.efficiency || 0,
        });
      } else {
        districtEfficiency.get(key).centers += 1;
        const eff = districtEfficiency.get(key).efficiency;
        districtEfficiency.get(key).efficiency = (eff + entry.efficiency) / 2;
      }
    }

    const final_district_efficiency_array = Array.from(
      districtEfficiency.values()
    );

    // Top Performing distribution centers

    const topDistributionCenters = await prisma.distribution_center.findMany({
      select: {
        center_id: true,
        address: true,
        transaction_logs: {
          select: {
            quantity_entitled: true,
            quantity_received: true,
            beneficiaryId: true,
          },
        },
      },
    });

    const resultsForTopDistributionCenters = topDistributionCenters.map(
      (entry) => {
        const total = entry.transaction_logs.reduce(
          (acc, curr) => {
            acc.quantity_entitled += curr.quantity_entitled ?? 0;
            acc.quantity_received += curr.quantity_received ?? 0;
            if (acc.beneficiaryId !== curr.beneficiaryId) {
              acc.numberOfFamiy += 1;
              acc.beneficiaryId = curr.beneficiaryId;
            }
            return acc;
          },
          {
            quantity_entitled: 0,
            quantity_received: 0,
            beneficiaryId: "",
            numberOfFamiy: 0,
          }
        );
        return {
          center_id: entry.center_id,
          address: entry.address,
          efficiency:
            +(
              (total.quantity_received / total.quantity_entitled) *
              100
            ).toFixed(2) || 0,
          numberOfFamilyServed: total.numberOfFamiy,
        };
      }
    );

    function getTop4(arr, n) {
      const top = [];
      for (const item of arr) {
        top.push(item);
        top.sort((a, b) => b.efficiency - a.efficiency);
        if (top.length > n) top.pop();
      }

      return top;
    }

    const top4 = getTop4(resultsForTopDistributionCenters, 4);


    // Quantity distribution trends

    const commodityDistribution = await prisma.transaction_log.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      select: {
        commodityId: true,
        quantity_received: true,
        createdAt: true,
        commodity: {
          select: {
            commodity_name: true,
          },
        },
      },
    });

    const quantityTotal = new Map();

    for (const entry of commodityDistribution) {
      const month = monthKey(entry.createdAt);

      // Skip if this month isn't in your monthsWithYear filter (optional)
      if (!monthsWithYear.includes(month)) continue;

      // 1. Ensure the Month exists in the Map
      if (!quantityTotal.has(month)) {
        quantityTotal.set(month, { month: month, commodityDetails: [] });
      }

      const monthData = quantityTotal.get(month);
      const commodityName = entry.commodity.commodity_name;

      // 2. Look for the commodity within this month
      const existingComm = monthData.commodityDetails.find(
        (c) => c.commodityName === commodityName
      );

      if (existingComm) {
        // 3. Update existing total
        existingComm.quantity_received += entry.quantity_received;
      } else {
        // 4. Or add it for the first time
        monthData.commodityDetails.push({
          commodityName: commodityName,
          quantity_received: entry.quantity_received,
        });
      }
    }

    const fianl_distribution_trends_array = Array.from(quantityTotal.values());

    // Total individiual commodity distribution for this month
    const commodity_names = await prisma.commodity.groupBy({
      by: ['commodity_id', 'commodity_name'],
    });

    const individual_commodity_data = [];

    for(const commodity_name of commodity_names){
      const total_individual_commodity_distributed = await prisma.transaction_log.aggregate({
        where: {
          commodityId: commodity_name.commodity_id,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          }
        },
        _sum: {
          quantity_received: true,
        }
        
      })
      individual_commodity_data.push({commodity_name: commodity_name.commodity_name, total_distribution: total_individual_commodity_distributed._sum.quantity_received})
    }
    

    res.status(200).json({
      success: true,
      data: [
        {
          total_ration_distributed: totalRationDistributed._sum.quantity_received,
          total_active_distribution_centers: totalActiveDistributionCenters,
          total_grievances_filled: totalGrievancesFiled,
          total_beneficiary_registered: totalBeneficiariesRegistered,
          distribution_efficiency_trend: distribution_efficiency_trend,
          district_efficiency: final_district_efficiency_array,
          top_performing_distribution_centers: top4,
          distribution_trends_array: fianl_distribution_trends_array,
          individual_commodity_data: individual_commodity_data,
        },
      ],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!", error });
  }
};

export { dashboard };
