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
        (field) => field === null || field === undefined || field === "",
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

    const beneficiary_with_email = await prisma.beneficiary.findFirst({
      where: {
        email: email,
      },
    });

    const shop_Owner_with_this_email = await prisma.shop_owner.findFirst({
      where: {
        email: email,
      },
    });

    if (beneficiary_with_email || shop_Owner_with_this_email) {
      return res.status(409).json({ message: "Please use different email address!" });
    }

    // const mobile_number_regex = /^\d{10}$/;
    // if (mobile_number_regex.test(phone_no)) {
    //   return res.status(400).json({ message: "Invalid phone number!" });
    // }

    const beneficiary_with_phone = await prisma.beneficiary.findFirst({
      where: {
        phone_no: phone_no,
      },
    });

    const shop_owner_with_this_number = await prisma.shop_owner.findFirst({
      where: {
        phone_no: phone_no,
      },
    });

    if (beneficiary_with_phone || shop_owner_with_this_number) {
      return res.status(409).json({ message: "Inalid mobile number!" });
    }

    if (family_size > 20 || family_size < 1) {
      return res
        .status(400)
        .json({ message: "Please enter correct family size!" });
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

    if (rationCardNo.length > 12 || rationCardNo.length < 12) {
      return res.status(400).json({ message: "Invalid ration card Number!" });
    }

    const beneficiary_with_rationCard = await prisma.beneficiary.findFirst({
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
    const full_Ration_card_number = "RCN" + rationCardNo;
    const salt = await bcrypt.genSalt(13);
    const hashed_password = await bcrypt.hash(password, salt);

    const newBeneficiary = await prisma.beneficiary.create({
      data: {
        beneficiary_id: id,
        full_name: fullName,
        email,
        phone_no,
        password: hashed_password,
        security_PIN: parseInt(security_PIN),
        family_size: parseInt(family_size),
        state,
        district,
        address,
        ration_card_no: full_Ration_card_number,
        centerId,
      },
    });

    const token = jwt.sign(
      { beneficiary_id: newBeneficiary.beneficiary_id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
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

    const beneficiary = await prisma.beneficiary.findFirst({
      where: {
        ration_card_no: rationCardNo,
      },
      select: {
        password: true,
        beneficiary_id: true,
      },
    });

    if (!beneficiary) {
      return res
        .status(401)
        .json({ message: "Invalid Ration Card Number or Password!" });
    }

    const check_password = await bcrypt.compare(password, beneficiary.password);
    if (!check_password) {
      return res
        .status(409)
        .json({ message: "Invalid Ration Card Number or Password!" });
    }

    const token = jwt.sign(
      { beneficiary_id: beneficiary.beneficiary_id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res.status(200).json({ message: "Beneficiary logged in successfully!" });
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
