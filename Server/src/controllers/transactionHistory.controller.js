import { prisma } from "../DB/db.config.js";

const transactionHistory = async (req, res) => {
  try {
    const beneficiary = req.beneficiary;

    const getAllTransactions = await prisma.transaction_log.findMany({
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
      },
    });

    if (getAllTransactions == []) {
      return res.status(404).json({ message: "No transaction found!" });
    }

    res.status(200).json({ success: true, allTransaction: getAllTransactions });
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
