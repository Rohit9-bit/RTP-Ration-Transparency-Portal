import { customAlphabet } from "nanoid";
import { prisma } from "../DB/db.config.js";

const newGrievance = async (req, res) => {
  try {
    const {
      issue_type,
      description,
      quantity_discrepancy_details,
      relatedTransaction,
    } = req?.body;
    const { priority } = req?.query;
    const beneficiary = req?.beneficiary;

    if (!beneficiary) {
      return res.status(401).json({ message: "Unauthorized Request!" });
    }

    if (!issue_type) {
      return res
        .status(400)
        .json({ message: "Please select your issue type!" });
    }

    // if (quantity_discrepancy_details.length === 0) {
    //   return res
    //     .status(400)
    //     .json({ message: "Please provide quantity discrepancy details!" });
    // }

    // if (
    //   quantity_discrepancy_details.some(
    //     (item) =>
    //       !item.commodityId || !item.expected_quantity || !item.actual_quantity,
    //   )
    // ) {
    //   return res
    //     .status(400)
    //     .json({
    //       message:
    //         "Please provide complete quantity discrepancy details for all items!",
    //     });
    // }

    const generateNumericId = customAlphabet("0123456789", 5); // 5-digit numeric suffix

    const grievance = await prisma.grievance.create({
      data: {
        grievance_id: "GRIE" + generateNumericId(),
        issue_type,
        description,
        centerId: beneficiary.centerId,
        beneficiaryId: beneficiary.beneficiary_id,
        commodityId: quantity_discrepancy_details?.commodityId || null,
        expected_quantity:
          parseFloat(quantity_discrepancy_details?.expected_quantity) || null,
        actual_quantity:
          parseFloat(quantity_discrepancy_details?.actual_quantity) || null,
        priority_level: priority,
        relatedTransacton: relatedTransaction || null,
      },
    });

    res
      .status(201)
      .json({ message: "Grievance submitted successfully!", grievance });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!", error });
  }
};

const allGrievances = async (req, res) => {
  try {
    const beneficiary = req.beneficiary;
    const page = Number(req.query.page) || 1;
    const pageSize = 5;

    const grievances = await prisma.grievance.findMany({
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
      },
      select: {
        grievance_id: true,
        issue_type: true,
        description: true,
        centerId: true,
        expected_quantity: true,
        actual_quantity: true,
        status: true,
        createdAt: true,
        commodity: {
          select: {
            commodity_name: true,
          },
        },
      },
      orderBy: {
        grievance_id: "asc",
      },
      skip: (Number(page) - 1) * pageSize,
      take: pageSize,
    });

    res.status(200).json({
      message: "Recent grievances fetched successfully!",
      data: grievances,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!", error });
  }
};

export { newGrievance, allGrievances };
