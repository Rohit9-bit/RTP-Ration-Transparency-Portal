import { prisma } from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userController = async (req, res) => {
  const { first_name, last_name, phone_no, email, password, address } =
    req.body;

  try {
    if (
      !first_name ||
      !last_name ||
      !phone_no ||
      !email ||
      !password ||
      !address
    ) {
      return res.status(400).json({ message: "All Fields are Required!" });
    }

    if (phone_no.length < 10) {
      return res
        .status(400)
        .json({ message: "Phone number must be of 10 digits!" });
    }

    const existingPhone = await prisma.users.findFirst({
      where: {
        phone_no: phone_no,
      },
    });

    if (existingPhone) {
      return res
        .status(400)
        .json({ message: `User already exist with this ${phone_no} number!` });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Please enter a valid email address!" });
    }

    const existingUser = await prisma.users.findFirst({
      where: {
        email: email,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: `User already exist with this ${email} email!` });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must atleast be of 8 Characters!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);

    const newUser = await prisma.users.create({
      data: {
        first_name: first_name,
        last_name: last_name,
        phone_no: phone_no,
        email: email,
        address: address,
        password: hashed_password,
      },
    });

    res
      .status(200)
      .json({ message: "User created successfully!", new_user: newUser });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

export default userController;
