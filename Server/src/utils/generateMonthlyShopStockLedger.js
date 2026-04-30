import { prisma } from "../DB/db.config.js";
import { customAlphabet } from "nanoid";

const generateMonthlyShopStockLedger = async () => {
  try {
    const getCentersAndFamilyDetails = await prisma.beneficiary.groupBy({
      by: ["centerId"],
      _sum: {
        family_size: true,
      },
      _count: {
        beneficiary_id: true,
      },
    });

    const allCommodities = await prisma.commodity.findMany();

    const generateNumericId = customAlphabet("0123456789", 5); // 5-digit numeric suffix
    const date = new Date(
      Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1),
    );
    // const date = new Date();

    const options = { month: "long", year: "numeric" };
    const ledgerRecord = [];

    for (const center of getCentersAndFamilyDetails) {
      for (const commodity of allCommodities) {
        if (
          commodity.commodity_name === "Rice" ||
          commodity.commodity_name === "Wheat"
        ) {
          ledgerRecord.push({
            ledger_id: "LEDG" + generateNumericId(),
            stock_in_quantity: center._sum.family_size * 5,
            stock_out_quantity: 0,
            centerId: center.centerId,
            commodityId: commodity.commodity_id,
            month_year: date.toLocaleDateString("eng-US", options),
            createdAt: date.toISOString(),
          });
        }

        if (
          commodity.commodity_name === "Sugar" ||
          commodity.commodity_name === "Mustard oil"
        ) {
          ledgerRecord.push({
            ledger_id: "LEDG" + generateNumericId(),
            stock_in_quantity: center._count.beneficiary_id * 2,
            stock_out_quantity: 0,
            centerId: center.centerId,
            commodityId: commodity.commodity_id,
            month_year: date.toLocaleDateString("eng-US", options),
            createdAt: date.toISOString(),
          });
        }
      }
    }

    await prisma.shop_stock_ledger
      .createMany({
        data: ledgerRecord,
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    console.log(error);
  }
};

export { generateMonthlyShopStockLedger };
