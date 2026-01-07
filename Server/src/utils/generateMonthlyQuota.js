import { prisma } from "../DB/db.config.js";
import { customAlphabet } from "nanoid";

// Ration-Policy

// Commodity ID,       Base Amount,      Unit,       Rule Type
// 1 (Rice),           5.0,              kg,         Per Capita (Multiplied by family_size)
// 2 (Wheat),          5.0,              kg,         Per Capita (Multiplied by family_size)
// 3 (Sugar),          2.0,              kg,         Fixed (For all families)
// 4 (Mustard Oil)     2.0,              litre,      Fixed (For all families)

const generateMonthlyQuota = async () => {
  try {
    const activeBeneficiaries = await prisma.beneficiary.findMany({
      where: {
        is_active: true,
      },
      select: {
        family_size: true,
        beneficiary_id: true,
      },
    });

    const allCommodities = await prisma.commodity.findMany({
      select: {
        commodity_id: true,
        commodity_name: true,
        unit: true,
      },
    });

    const generateNumericId = customAlphabet("0123456789", 5); // 5-digit numeric suffix

    const quotaRecords = [];

    for (let i = 0; i < activeBeneficiaries.length; i++) {
      for (let j = 0; j < allCommodities.length; j++) {
        if (
          allCommodities[j].commodity_name === "Rice" ||
          allCommodities[j].commodity_name === "Wheat"
        ) {
          quotaRecords.push({
            quota_id: "QUOT" + generateNumericId(),
            beneficiaryId: activeBeneficiaries[i].beneficiary_id,
            commodityId: allCommodities[j].commodity_id,
            quantity_entitled: 5 * activeBeneficiaries[i].family_size,
            quantity_remaining: 5 * activeBeneficiaries[i].family_size,
          });
        }

        if (
          allCommodities[j].commodity_name === "Sugar" ||
          allCommodities[j].commodity_name === "Mustard oil"
        ) {
          quotaRecords.push({
            quota_id: "QUOT" + generateNumericId(),
            beneficiaryId: activeBeneficiaries[i].beneficiary_id,
            commodityId: allCommodities[j].commodity_id,
            quantity_entitled: 2,
            quantity_remaining: 2,
            month_year: new Date().toISOString().slice(0,7),
          });
        }
      }
    }

    const newQouta = await prisma.quota.createMany({
      data: quotaRecords,
    });

    console.log("Quotas", newQouta);
  } catch (error) {
    console.log(error);
  }
};

export { generateMonthlyQuota };
