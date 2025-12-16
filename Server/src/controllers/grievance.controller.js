import { customAlphabet } from "nanoid";
import { prisma } from "../DB/db.config.js";

const newGrievance = async (req, res) => {
  try {
    const { issue_type, description, quantity_discrepancy_details } = req?.body;
    const beneficiary = req.beneficiary;

    if (!issue_type) {
      return res
        .status(400)
        .json({ message: "Please select your issue type!" });
    }

    if (quantity_discrepancy_details.length === 0) {
      return res
        .status(400)
        .json({ message: "Please provide quantity discrepancy details!" });
    }

    const generateNumericId = customAlphabet("0123456789", 5); // 5-digit numeric suffix

    const grievance = await prisma.grievance.create({
      data: {
        grievance_id: "GRIE" + generateNumericId(),
        issue_type,
        description,
        centerId: beneficiary.centerId,
        beneficiaryId: beneficiary.beneficiary_id,
        commodityId: quantity_discrepancy_details.commodityId,
        expected_quantity: quantity_discrepancy_details.expected_quantity,
        actual_quantity: quantity_discrepancy_details.actual_quantity,
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

const recentGrievances = async (req, res) => {
  try {
    const beneficiary = req.beneficiary;

    const grievances = await prisma.grievance.findMany({
      where: {
        beneficiaryId: beneficiary.beneficiary_id,
      },
      orderBy: {
        created_at: "desc",
      },
      take: 5,
    });

    if (grievances.length === 0) {
      return res.status(404).json({ message: "No grievances found!" });
    }

    res
      .status(200)
      .json({ message: "Recent grievances fetched successfully!", grievances });


  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!", error });
  }
};

export { newGrievance, recentGrievances };
