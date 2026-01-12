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

    const transactionData = await prisma.transaction_log.findFirst({
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
        createdAt: {
          gt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
      select: {
        createdAt: true,
      },
    });

    if (transactionData) {
      const createdAt = new Date(transactionData.createdAt);
      const now = new Date();
      if (
        createdAt.getMonth() === now.getMonth() &&
        createdAt.getFullYear() === now.getFullYear()
      ) {
        return res
          .status(400)
          .json({ message: "Beneficiary has already received ration!" });
      }
    }

    // const beneficiary_quota = await prisma.quota.findMany({
    //   where: {
    //     beneficiaryId: beneficiary.beneficiary_id,
    //     createdAt: {
    //       gt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    //     },
    //   },
    //   select: {
    //     quantity_entitled: true,
    //     commodityId: true,
    //   },
    // });

    // console.log(beneficiary_quota);

    // for (const quota of beneficiary_quota) {
    //   for (const commoditiesReceive of commoditiesReceived) {
    //     console.log(commoditiesReceive.quantity_receive, quota.quantity_entitled)
    //     if (
    //       commoditiesReceive.commodityId === quota.commodityId &&
    //       !(commoditiesReceive.quantity_receive > quota.quantity_entitled)
    //     ) {
    //       return res
    //         .status(400)
    //         .json({ message: "Exceeds Beneficiary Entitlement!" });
    //     }
    //   }
    // }

    const generateNumericId = customAlphabet("0123456789", 5); // 5-digit numeric suffix

    const transactionIds = [];

    for (const commoditiesReceive of commoditiesReceived) {
      const quotaRecords = await prisma.quota.findFirst({
        where: {
          beneficiaryId: beneficiary.beneficiary_id,
          commodityId: commoditiesReceive.commodityId,
          createdAt: {
            gt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      });

      if (!quotaRecords) {
        return res.status(404).json({ message: "Record for quota not found!" });
      }

      const quantity_entitled = quotaRecords.quantity_entitled;
      const quantity_remaining = quotaRecords.quantity_remaining;

      const shop_stock = await prisma.shop_stock_ledger.findFirst({
        where: {
          centerId: shopOwnereDetails.distribution_center.center_id,
          commodityId: commoditiesReceive.commodityId,
        },
      });

      if (!shop_stock) {
        return res
          .status(404)
          .json({ message: "shop_stock not found for this commodity!" });
      }

      if (commoditiesReceive.quantity_receive > shop_stock.stock_in_quantity) {
        return res.status(400).json({
          message: `Insufficient Stock for commodity ${commoditiesReceive.commodityId}`,
        });
      }

      if (commoditiesReceive.quantity_receive > quantity_remaining) {
        return res.status(400).json({
          message: `Exceeds Beneficiary Entitlement for commodity ${commoditiesReceive.commodityId}`,
        });
      }

      const result = await prisma.$transaction(async (tx) => {
        const new_Transaction_log = await tx.transaction_log.create({
          data: {
            transaction_id: "TRANS" + generateNumericId(),
            quantity_entitled: quantity_entitled,
            quantity_received: commoditiesReceive.quantity_receive,
            is_verified_by_beneficiery: false,
            beneficiaryId: beneficiary.beneficiary_id,
            centerId: shopOwnereDetails.distribution_center.center_id,
            commodityId: commoditiesReceive.commodityId,
            anomaly_type: null,
          },
        });

        const updateQuota = await tx.quota.update({
          where: {
            quota_id: quotaRecords.quota_id,
          },
          data: {
            quantity_remaining:
              quantity_remaining - commoditiesReceive.quantity_receive,
          },
        });

        const update_Shop_stock = await tx.shop_stock_ledger.update({
          where: {
            ledger_id: shop_stock.ledger_id,
          },
          data: {
            stock_in_quantity:
              shop_stock.stock_in_quantity -
              commoditiesReceive.quantity_receive,
            stock_out_quantity:
              shop_stock.stock_out_quantity +
              commoditiesReceive.quantity_receive,
          },
        });

        return { new_Transaction_log, updateQuota, update_Shop_stock };
      });

      transactionIds.push(result.new_Transaction_log.transaction_id);

      const anomalyCheck = await prisma.transaction_log.findFirst({
        where: {
          transaction_id: result.new_Transaction_log.transaction_id,
        },
        select: {
          quantity_received: true,
        },
      });

      if (anomalyCheck.quantity_received < quantity_entitled) {
        await prisma.transaction_log.update({
          where: {
            transaction_id: result.new_Transaction_log.transaction_id,
          },
          data: {
            anomaly_type: "Quantity Variance!",
          },
        });
      }
    }

    console.log("Records of Transaction: ", transactionIds);

    return res.status(200).json({
      success: true,
      message: "Transactions recorded successfully.",
      transactionIds,
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
