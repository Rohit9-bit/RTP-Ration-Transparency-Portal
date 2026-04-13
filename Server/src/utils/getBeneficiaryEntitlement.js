import { customAlphabet } from "nanoid";
import { prisma } from "../DB/db.config.js";

// Ration-Policy

// Commodity ID,       Base Amount,      Unit,       Rule Type
// 1 (Rice),           5.0,              kg,         Per Capita (Multiplied by family_size)
// 2 (Wheat),          5.0,              kg,         Per Capita (Multiplied by family_size)
// 3 (Sugar),          2.0,              kg,         Fixed (For all families)
// 4 (Mustard Oil)     2.0,              litre,      Fixed (For all families)

const getBeneficiaryEntitlements = async () => {
  try {
    const getBeneficiaryDetails = await prisma.beneficiary.findMany({
      where: {
        is_active: true,
      },
      select: {
        beneficiary_id: true,
        centerId: true,
      },
    });

    const generateNumericId = customAlphabet("0123456789", 5);
    const date = new Date();
    const options = { month: "long", year: "numeric" };

    const EnetitlementRecord = [];

    for (const beneficiaries of getBeneficiaryDetails) {
      const getBeneficiaryQuota = await prisma.quota.findMany({
        where: {
          beneficiaryId: beneficiaries.beneficiary_id,
          month_year: date.toLocaleDateString("eng-US", options),
        },
        select: {
          quota_id: true,
          commodityId: true,
          quantity_entitled: true,
          quantity_remaining: true,
          month_year: true,
        },
      });

      for (const quota of getBeneficiaryQuota) {
        const getShopStockLedger = await prisma.shop_stock_ledger.findFirst({
          where: {
            centerId: beneficiaries.centerId,
            commodityId: quota.commodityId,
            month_year: quota.month_year,
          },
          select: {
            stock_in_quantity: true,
            stock_out_quantity: true,
            ledger_id: true,
          },
        });

        console.log("getShopStock: ", getShopStockLedger);
        console.log("Quota: ", quota);

        EnetitlementRecord.push({
          transaction_id: "TRANS" + generateNumericId(),
          quantity_entitled: quota.quantity_entitled,
          quantity_received: quota.quantity_entitled,
          is_verified_by_beneficiery: false,
          beneficiaryId: beneficiaries.beneficiary_id,
          centerId: beneficiaries.centerId,
          commodityId: quota.commodityId,
        });

        await prisma.shop_stock_ledger
          .update({
            where: {
              ledger_id: getShopStockLedger.ledger_id,
            },
            data: {
              stock_out_quantity:
                getShopStockLedger.stock_out_quantity + quota.quantity_entitled,
            },
          })
          .catch((error) => {
            throw new Error(error);
          });

        await prisma.quota
          .update({
            where: {
              quota_id: quota.quota_id,
            },
            data: {
              quantity_remaining:
                quota.quantity_remaining - quota.quantity_entitled,
            },
          })
          .catch((error) => {
            throw new Error(error);
          });
      }
    }

    await prisma.transaction_log
      .createMany({
        data: EnetitlementRecord,
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    console.log(error);
  }
};

export {getBeneficiaryEntitlements};
