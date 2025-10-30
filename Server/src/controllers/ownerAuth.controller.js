import { prisma } from "../DB/db.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const registerShopOwner = async (req, res) => {
  const {
    fullName,
    email,
    phone_no,
    state,
    district,
    address,
    ownerId,
    password,
  } = req.body;

  try {
    const requiredFields = [
      fullName,
      email,
      phone_no,
      state,
      district,
      address,
      ownerId,
      password,
    ];

    if (
      requiredFields.some(
        (field) => field === null || field === undefined || field === ""
      )
    ) {
      res.status(401).json({ message: "All fields are Required!" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(401)
        .json({ message: "Please Enter valid email Address!" });
    }

    const shopOwner = await prisma.shop_owner.findFirst({
      where: {
        email: email,
        owner_id: ownerId,
      },
    });

    console.log(shopOwner);

    if (shopOwner) {
      return res
        .status(401)
        .json({ message: "Owner with this email or ownerId already exists!" });
    }

    if (phone_no.length > 10 || phone_no.length < 10 || shopOwner?.phone_no) {
      return res.status(401).json({ message: "Invalid phone number!" });
    }

    if (password.length < 8) {
      return res.status(401).json({ message: "Password must be of 8 digits!" });
    }

    const salt = await bcrypt.genSalt(13);
    const hashed_password = await bcrypt.hash(password, salt);

    const newShopOwner = await prisma.shop_owner.create({
      data: {
        full_name: fullName,
        email,
        phone_no,
        state,
        district,
        address,
        owner_id: ownerId,
        password: hashed_password,
      },
    });

    const token = jwt.sign(
      { managerId: newShopOwner.manager_id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });

    res
      .status(201)
      .json({ message: "Owner created successfully!", newShopOwner });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

const loginManager = async (req, res) => {
  const { ownerId, password } = req.body;
  try {
    if (!ownerId || !password) {
      return res
        .status(400)
        .json({ message: "Please enter ownerId and password!" });
    }

    const owner = await prisma.shop_owner.findFirst({
      where: {
        owner_id: ownerId,
      },
    });

    if (!owner) {
      return res.status(409).json({ message: "Invalid ownerId or password!" });
    }

    const checkPassword = await bcrypt.compare(password, owner.password);

    if (!checkPassword) {
      return res.status(409).json({ message: "Invalid ownerId or password!" });
    }

    const token = jwt.sign(
      { ownerId: owner.owner_id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Logged in successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

const logOutManager = async (req, res) => {
  try {
    res.clearCookie("jwt");
    res.status(200).json({ message: "logged out successfully!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export { registerShopOwner, loginManager, logOutManager };
