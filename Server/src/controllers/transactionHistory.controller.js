import { prisma } from "../DB/db.config.js";

const transactionHistory = async (req, res) => {
  try {
    const beneficiary = req.beneficiary;
    const page = Number(req.query.page) || 1;
    const pageSize = 3;

    const thisMonthsTransaction = new Map();

    const recentTransactions = await prisma.transaction_log.findMany({
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1),
        },
      },
      select: {
        quantity_entitled: true,
        quantity_received: true,
        anomaly_type: true,
        is_verified_by_beneficiery: true,
        createdAt: true,
        distributionCenter: {
          select: {
            center_name: true,
            address: true,
          },
        },
        commodity: {
          select: {
            commodity_name: true,
          },
        },
      },
      skip: (page - 1) * (pageSize * 4),
      take: pageSize * 4,
    });

    for (const entry of recentTransactions) {
      const key = entry.createdAt.toISOString().slice(0, 7);
      if (!thisMonthsTransaction.has(key)) {
        thisMonthsTransaction.set(key, {
          dateTime: entry.createdAt,
          shopDetails: {
            name: entry.distributionCenter.center_name,
            address: entry.distributionCenter.address,
          },
          items: [
            {
              name: entry.commodity.commodity_name,
              quantity_entitled: entry.quantity_entitled,
              quantity_received: entry.quantity_received,
            },
          ],
          status: [{
            name: entry.commodity.commodity_name,
            anomaly_type:
              entry.anomaly_type === null ? "none" : entry.anomaly_type,
          }],
        });
      } else {
        thisMonthsTransaction.get(key).items.push({
          name: entry.commodity.commodity_name,
          quantity_entitled: entry.quantity_entitled,
          quantity_received: entry.quantity_received,
        });
        thisMonthsTransaction.get(key).status.push({
          name: entry.commodity.commodity_name,
          anomaly_type: entry.anomaly_type === null ? "none" : entry.anomaly_type,
        });
      }
    }

    const thisMonthsTransactionArray = Array.from(
      thisMonthsTransaction.values()
    );

    const totalTransaction = await prisma.transaction_log.count({
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
      }
    });

    const totalTransactionPages = totalTransaction/4;


    const totalPages = Math.ceil(totalTransactionPages / pageSize);

    // Total Successfull Transaction
    const succesfullTransactions = await prisma.transaction_log.groupBy({
      by: ["commodityId", "anomaly_type"],
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
      },
      _count: {
        _all: true,
      }
    });

    let anomaly_in_transaction = 0;
    for(const transaction of succesfullTransactions){
      if(transaction.anomaly_type === "Quantity Variance!"){
        anomaly_in_transaction++;
      }
    }

    // Issues Reported!
    const issuesReported = await prisma.grievance.count({
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
      }
    });
    

    res
      .status(200)
      .json({
        success: true,
        data1: thisMonthsTransactionArray,
        data2: {
          totalTransactions: totalTransactionPages,
          totalSuccessfulTransaction: {
            success: totalTransactionPages - anomaly_in_transaction,
            rate: (((totalTransactionPages - anomaly_in_transaction) / totalTransactionPages) * 100).toFixed(2),
          },
          partialTransactions: anomaly_in_transaction,
          issuesReported: issuesReported,
        },
        metaDataForPagination: {
          page,
          pageSize,
          total: totalTransactionPages,
          totalPages,
          start: (page - 1) * pageSize + 1,
          end: Math.min(page * pageSize, totalTransactionPages),
        },
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!", error });
  }
};

const approveTransaction = async (req, res) => {
  try {
    const beneficiary = req.beneficiary;

    const allTransactions = await prisma.transaction_log.findMany({
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
      },
      select: {
        transaction_id: true,
      },
    });

    if (allTransactions == []) {
      return res.status(404).json({ message: "No transaction found!" });
    }

    for (const transaction of allTransactions) {
      await prisma.transaction_log.update({
        where: {
          transaction_id: transaction.transaction_id,
        },
        data: {
          is_verified_by_beneficiery: true,
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!", error });
  }
};

export { transactionHistory, approveTransaction };
