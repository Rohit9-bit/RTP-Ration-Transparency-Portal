import { prisma } from "../DB/db.config.js";
import { customAlphabet } from "nanoid";

const generateMonthlyShopStockLedger = async () => {
  try {
    const totalBeneficiariesWithFamily = await prisma.beneficiary.aggregate({
      _sum: {
        family_size: true,
      },
    });

    const allCommodities = await prisma.commodity.findMany({
      select: {
        commodity_id: true,
        commodity_name: true,
        unit: true,
      },
    });

    const centers = await prisma.distribution_center.findMany({
      select: {
        center_id: true,
      },
    });

    const generateNumericId = customAlphabet("0123456789", 5); // 5-digit numeric suffix

    const ledgerRecord = [];

    for (const center of centers) {
      for (const commodity of allCommodities) {
        if (
          commodity.commodity_name === "Rice" ||
          commodity.commodity_name === "Wheat"
        ) {
          ledgerRecord.push({
            ledger_id: "LEDG" + generateNumericId(),
            stock_in_quantity:
              totalBeneficiariesWithFamily._sum.family_size * 5,
            stock_out_quantity: 0,
            centerId: center.center_id,
            commodityId: commodity.commodity_id,
          });
        }

        if (
          commodity.commodity_name === "Sugar" ||
          commodity.commodity_name === "Mustard oil"
        ) {
          ledgerRecord.push({
            ledger_id: "LEDG" + generateNumericId(),
            stock_in_quantity:
              totalBeneficiariesWithFamily._sum.family_size * 2,
            stock_out_quantity: 0,
            centerId: center.center_id,
            commodityId: commodity.commodity_id,
          });
        }
      }
    }

    const newStockLedgers = await prisma.shop_stock_ledger.createMany({
      data: ledgerRecord,
    });

    if (!newStockLedgers) {
      throw new Error("Something went wrong!");
    }
  } catch (error) {
    console.log(error);
  }
};

export { generateMonthlyShopStockLedger };
