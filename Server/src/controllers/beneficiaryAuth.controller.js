import { prisma } from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { customAlphabet } from "nanoid";

const registerBeneficiary = async (req, res) => {
  const {
    fullName,
    email,
    phone_no,
    password,
    security_PIN,
    family_size,
    state,
    district,
    address,
    rationCardNo,
    centerId,
  } = req.body;

  try {
    const requiredFields = [
      fullName,
      email,
      phone_no,
      password,
      security_PIN,
      family_size,
      state,
      district,
      address,
      rationCardNo,
      centerId,
    ];

    if (
      requiredFields.some(
        (field) => field === null || field === undefined || field === ""
      )
    ) {
      return res.status(400).json({ message: "All fields are Required!" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ message: "Please Enter valid email Address!" });
    }

    const beneficiary_with_email = await prisma.beneficiery.findFirst({
      where: {
        email: email,
      },
    });

    if (beneficiary_with_email) {
      return res
        .status(409)
        .json({ message: "Beneficiary already exist with this email!" });
    }

    if (phone_no.length > 10 || phone_no.length < 10) {
      return res
        .status(400)
        .json({ message: "Phone number must be of 10 digits!" });
    }

    const beneficiary_with_phone = await prisma.beneficiery.findFirst({
      where: {
        phone_no: phone_no,
      },
    });

    if (beneficiary_with_phone) {
      return res.status(409).json({ message: "Phone Number already exists!" });
    }

    if (family_size > 20 || family_size < 2) {
      return res.status(400).json({ message: "Family size is not valid!" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be of 8 characters!" });
    }

    if (security_PIN.length > 4 || security_PIN.length < 4) {
      return res
        .status(400)
        .json({ message: "security pin must be of 4 digits!" });
    }

    if (rationCardNo.length > 15 || rationCardNo.length < 15) {
      return res.status(400).json({ message: "Invalid ration card Number!" });
    }

    const beneficiary_with_rationCard = await prisma.beneficiery.findFirst({
      where: {
        ration_card_no: rationCardNo,
      },
    });

    if (beneficiary_with_rationCard) {
      return res.status(409).json({
        message: "Beneficiary already exists with this ration card number!",
      });
    }

    const generateNumericId = customAlphabet("0123456789", 5); // 5-digit numeric suffix
    const id = "BENE" + generateNumericId();
    const salt = await bcrypt.genSalt(13);
    const hashed_password = await bcrypt.hash(password, salt);
    

    const newBeneficiary = await prisma.beneficiery.create({
      data: {
        beneficiery_id: id,
        full_name: fullName,
        email,
        phone_no,
        password: hashed_password,
        security_PIN: security_PIN,
        family_size,
        state,
        district,
        address,
        ration_card_no: rationCardNo,
        centerId: centerId,
      },
    });

    const token = jwt.sign(
      { beneficiery_id: newBeneficiary.beneficiery_id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res
      .status(201)
      .json({ message: "Beneficiary added successfully!", newBeneficiary });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

const loginBeneficiary = async (req, res) => {
  const { rationCardNo, password } = req.body;
  try {
    if (!rationCardNo || !password) {
      return res.status(400).json({
        message: "Please enter your Ration Card Number and Password!",
      });
    }

    if (rationCardNo.length > 15 || rationCardNo.length < 15) {
      return res
        .status(400)
        .json({ message: "Please Enter valid Ration Card Number!" });
    }

    const beneficiary = await prisma.beneficiery.findFirst({
      where: {
        ration_card_no: rationCardNo,
      },
    });

    if (!beneficiary) {
      return res
        .status(401)
        .json({ message: "Invalid Ration Card Number or Password!" });
    }

    const check_password = await bcrypt.compare(password, user.password);
    if (!check_password) {
      return res
        .status(409)
        .json({ message: "Invalid Ration Card Number or Password!" });
    }

    const token = jwt.sign(
      { beneficiery_id: beneficiary.beneficiery_id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res
      .status(200)
      .json({ message: "Beneficiary logged in successfully!", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

const logOutBeneficiary = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "logged out successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export { registerBeneficiary, loginBeneficiary, logOutBeneficiary };
