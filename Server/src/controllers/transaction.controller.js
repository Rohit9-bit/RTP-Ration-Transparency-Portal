import { prisma } from "../DB/db.config.js";
import { customAlphabet } from "nanoid";

const transactionController = async (req, res) => {
  try {
    const { rationCardNo, security_PIN, commoditiesReceived } = req.body;
    const shopOwnereDetails = req.shopOwner;

    const beneficiary = await prisma.beneficiary.findFirst({
      where: {
        ration_card_no: rationCardNo,
      },
    });

    if (!beneficiary) {
      return res.status(409).json({ message: "Invalid Ration Card Number!" });
    }

    if (!security_PIN === beneficiary?.security_PIN) {
      return res.status(409).json({ message: "Invalid security pin!" });
    }

    if (!commoditiesReceived) {
      return res
        .status(400)
        .json({ message: "Please enter the commodities amount!" });
    }

    const generateNumericId = customAlphabet("0123456789", 5); // 5-digit numeric suffix

    commoditiesReceived.forEach(async (commodityRecieve) => {
      const quotaRecords = await prisma.quota.findFirst({
        where: {
          beneficiaryId: beneficiary.beneficiary_id,
          commodityId: commodityRecieve.commodityId,
        },
      });

      const quantity_entitled = quotaRecords.quantity_entitled;
      const quantity_remaining = quotaRecords.quantity_remaining;

      const shop_stock = await prisma.shop_stock_ledger.findFirst({
        where: {
          centerId: shopOwnereDetails.distribution_center.center_id,
          commodityId: commodityRecieve.commodityId,
        },
      });

      if (commodityRecieve.quantity_receive > shop_stock.stock_in_quantity) {
        return res.status(400).json({ message: "Insufficient Stock!" });
      }

      if (commodityRecieve.quantity_receive > quantity_remaining) {
        return res
          .status(400)
          .json({ message: "Exceeds Beneficiary Entitlement" });
      }

      const result = await prisma.$transaction(async (tx) => {
        const new_Transaction_log = await tx.transaction_log.create({
          data: {
            transaction_id: "TRANS" + generateNumericId(),
            quantity_entitled: quantity_entitled,
            quantity_received: commodityRecieve.quantity_receive,
            is_verified_by_beneficiery: true,
            beneficiaryId: beneficiary.beneficiary_id,
            centerId: shopOwnereDetails.distribution_center.center_id,
            commodityId: commodityRecieve.commodityId,
            anomaly_type: null,
          },
        });

        const updateQuota = await tx.quota.update({
          where: {
            beneficiaryId: beneficiary.beneficiary_id,
            commodityId: commodityRecieve.commodityId,
            quota_id: quotaRecords.quota_id,
          },
          data: {
            quantity_remaining:
              quantity_remaining - commodityRecieve.quantity_receive,
          },
        });

        const update_Shop_stock = await tx.shop_stock_ledger.update({
          where: {
            centerId: shopOwnereDetails.distribution_center.center_id,
            commodityId: commodityRecieve.commodityId,
            ledger_id: shop_stock.ledger_id,
          },
          data: {
            stock_in_quantity:
              shop_stock.stock_in_quantity - commodityRecieve.quantity_receive,
            stock_out_quantity:
              shop_stock.stock_out_quantity + commodityRecieve.quantity_receive,
          },
        });

        return { new_Transaction_log, updateQuota, update_Shop_stock };
      });

      console.log("result: ", result);

      const transaction_log = await prisma.transaction_log.findFirst({
        where: {
          beneficiaryId: beneficiary.beneficiary_id,
          commodityId: commodityRecieve.commodityId,
          centerId: shopOwnereDetails.distribution_center.center_id,
        },
        select: {
          quantity_received: true,
        },
      });

      if (transaction_log.quantity_received < quantity_entitled) {
        await prisma.transaction_log.update({
          where: {
            beneficiaryId: beneficiary.beneficiary_id,
            commodityId: commodityRecieve.commodityId,
            centerId: shopOwnereDetails.distribution_center.center_id,
          },
          data: {
            anomaly_type: "Quantity Varience",
          },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Transactions recorded successfully.",
        transactionIds: [result.new_Transaction_log.transaction_id],
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Verification failed / Insufficient stock / Unauthorized.",
    });
  }
};

export { transactionController };
