import { prisma } from "../DB/db.config.js";

const transactionHistory = async (req, res) => {
  try {
    const beneficiary = req.beneficiary;
    // const page = Number(req.query.page) || 1;
    const lastMonths = Number(req.query.lastMonths) || 3;
    // const pageSize = 3;

    // testing new query
    const thisMonthsTestTransaction = new Map();
    const testTransaction = await prisma.transaction_log.groupBy({
      by: ["createdAt", "month_year"],
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
        createdAt: {
          gte: new Date(
            new Date().getFullYear(),
            new Date().getMonth() - (lastMonths - 1),
            1,
          ),
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    const month_year_array = [];
    for (const trans of testTransaction) {
      month_year_array.push(trans.month_year);
    }

    const transactions = await prisma.transaction_log.findMany({
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
        month_year: {
          in: month_year_array,
        },
      },
      select: {
        quantity_entitled: true,
        quantity_received: true,
        anomaly_type: true,
        createdAt: true,
        month_year: true,
        distributionCenter: {
          select: {
            center_name: true,
            address: true,
          },
        },
        commodity: {
          select: {
            commodity_name: true,
            unit: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    for (const entry of transactions) {
      const key = entry.month_year;
      if (!thisMonthsTestTransaction.has(key)) {
        thisMonthsTestTransaction.set(key, {
          month_year: entry.month_year,
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
              anomaly_type:
                entry.anomaly_type === null ? "none" : entry.anomaly_type,
              unit: entry.commodity.unit,
            },
          ],
        });
      } else {
        thisMonthsTestTransaction.get(key).items.push({
          name: entry.commodity.commodity_name,
          quantity_entitled: entry.quantity_entitled,
          quantity_received: entry.quantity_received,
          anomaly_type:
            entry.anomaly_type === null ? "none" : entry.anomaly_type,
          unit: entry.commodity.unit,
        });
      }
    }

    const thisMonthsTestTransactionArray = Array.from(
      thisMonthsTestTransaction.values(),
    );

    // end testing new query

    const totalTransaction = await prisma.transaction_log.count({
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
      },
    });

    const totalTransactionPages = totalTransaction / 4;

    // const totalPages = Math.ceil(lastMonths / pageSize);

    // Total Successfull Transaction
    const succesfullTransactions = await prisma.transaction_log.groupBy({
      by: ["commodityId", "anomaly_type"],
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
      },
      _count: {
        _all: true,
      },
    });

    let anomaly_in_transaction = 0;
    for (const transaction of succesfullTransactions) {
      if (transaction.anomaly_type === "Quantity Variance") {
        anomaly_in_transaction++;
      }
    }

    // Issues Reported!
    const issuesReported = await prisma.grievance.count({
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
      },
    });

    res.status(200).json({
      success: true,
      data1: thisMonthsTestTransactionArray,
      data2: {
        totalTransactions: totalTransactionPages,
        totalSuccessfulTransaction: {
          success: totalTransactionPages - anomaly_in_transaction / 4,
          rate: (
            ((totalTransactionPages - anomaly_in_transaction / 4) /
              totalTransactionPages) *
            100
          ).toFixed(2),
        },
        partialTransactions: anomaly_in_transaction / 4,
        issuesReported: issuesReported,
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

const recentTransactions = async (req, res) => {
  try {
    const beneficiary = req.beneficiary;
    const recentTransactions = await prisma.transaction_log.groupBy({
      by: ["createdAt"],
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
      },
    });

    res.status(200).json({
      message: "Recent transactions fetched successfully!",
      data: recentTransactions.sort((a, b) => a.createdAt - b.createdAt),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!", error });
  }
};

export { transactionHistory, approveTransaction, recentTransactions };
