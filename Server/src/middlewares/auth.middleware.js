import jwt from "jsonwebtoken";
import { prisma } from "../DB/db.config.js";

const protectedRoute = async (req, res, next) => {
  try {
    const token =
      req.cookies?.jwt || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized Request!" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized!, Invalid token!" });
    }

    const beneficiary = await prisma.beneficiery.findFirst({
      where: {
        beneficiery_id: decodedToken.beneficiery_id,
      },
      select: {
        full_name: true,
        email: true,
        phone_no: true,
        family_size: true,
        state: true,
        district: true,
        address: true,
        is_active: true,
        centerId: true,
        ration_card_no: true,
      },
    });

    if (!beneficiary) {
      return res.status(409).json({ message: "Unauthorized!, No user found!" });
    }

    req.beneficiary = beneficiary;

    next();
  } catch (error) {
    console.log("Error in protectedRoute middleware!", error);
    res.status(500).json({ message: "Internal Server error!" });
  }
};

export { protectedRoute };
