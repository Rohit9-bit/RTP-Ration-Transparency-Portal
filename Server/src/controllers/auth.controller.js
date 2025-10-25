import { prisma } from "../DB/db.config.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// const registerUser = async (req, res) => {
//   const { first_name, last_name, phone_no, email, password, address } =
//     req.body;

//   try {
//     if (
//       !first_name ||
//       !last_name ||
//       !phone_no ||
//       !email ||
//       !password ||
//       !address
//     ) {
//       return res.status(400).json({ message: "All Fields are Required!" });
//     }

//     if (phone_no.length < 10) {
//       return res
//         .status(400)
//         .json({ message: "Phone number must be of 10 digits!" });
//     }

//     const existingPhone = await prisma.users.findFirst({
//       where: {
//         phone_no: phone_no,
//       },
//     });

//     if (existingPhone) {
//       return res
//         .status(400)
//         .json({ message: `User already exist with this ${phone_no} number!` });
//     }

//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

//     if (!emailRegex.test(email)) {
//       res.status(400).json({ message: "Please enter a valid email address!" });
//     }

//     const existingUser = await prisma.users.findFirst({
//       where: {
//         email: email,
//       },
//     });

//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: `User already exist with this ${email} email!` });
//     }

//     if (password.length < 8) {
//       return res
//         .status(400)
//         .json({ message: "Password must atleast be of 8 Characters!" });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashed_password = await bcrypt.hash(password, salt);

//     const newUser = await prisma.users.create({
//       data: {
//         first_name: first_name,
//         last_name: last_name,
//         phone_no: phone_no,
//         email: email,
//         address: address,
//         password: hashed_password,
//       },
//     });

//     const token = jwt.sign(
//       { userid: newUser.user_id },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "7d" }
//     );

//     res.cookie("jwt", token, {
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       httpOnly: true,
//     });

//     res
//       .status(200)
//       .json({ message: "User created successfully!", new_user: newUser });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ message: error });
//   }
// };

// const loginUser = async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     if (!email || !password) {
//       return res.status(401).json({ message: "All fields are required!" });
//     }

//     const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     if (!emailRegex.test(email)) {
//       return res.status(401).json({ message: "Please Enter Valid Email!" });
//     }

//     const user = await prisma.users.findFirst({
//       where: {
//         email: email,
//       },
//     });

//     if (!user) {
//       return res.status(401).json({ message: "Invalid email of password!" });
//     }

//     const original_password = user.password;
//     const check_password = await bcrypt.compare(password, original_password);

//     if (!check_password) {
//       return res.status(401).json({ message: "Invalid email of password!" });
//     }

//     const token = jwt.sign(
//       { userid: user.user_id },
//       process.env.JWT_SECRET_KEY,
//       { expiresIn: "7d" }
//     );

//     res.cookie("jwt", token, {
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//       httpOnly: true,
//     });

//     res.status(200).json({ message: "User logged in Succesfully!", user });
//   } catch (error) {
//     console.log("Something went wrong in login controller", error);
//     res.status(500).json({ message: "Internal Server Error!", error: error });
//   }
// };

// const logOut = async (req, res) => {
//   res.clearCookies("jwt");
//   res.status(200).json({ message: "User logged out successfully!" });
// };



const registerBeneficiary = async (req, res) => {
  const {
    fullName,
    email,
    phone_no,
    password,
    family_size,
    state,
    district,
    address,
    rationCardNo,
  } = req.body;

  try {
    if (
      !fullName ||
      !email ||
      !phone_no ||
      !password ||
      !family_size ||
      !state ||
      !district ||
      !address ||
      !rationCardNo
    ) {
      return res.status(401).json({ message: "All fields are Required!" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res
        .status(401)
        .json({ message: "Please Enter valid email Address!" });
    }

    const beneficiary = await prisma.beneficiery.findFirst({
      where: {
        email: email,
      },
    });

    if (beneficiary) {
      return res
        .status(401)
        .json({ message: "Beneficiary already exist with this email!" });
    }

    if (phone_no.length > 10 || beneficiary?.phone_no) {
      return res.status(401).json({ message: "Invalid phone number!" });
    }

    if (family_size > 20) {
      return res.status(401).json({ message: "Family size is not valid!" });
    }

    if (password.length < 8) {
      return res
        .status(401)
        .json({ message: "Password must be of 8 characters!" });
    }

    if (rationCardNo.length > 15 || beneficiary?.ration_card_no) {
      return res.status(401).json({ message: "Invalid ration card Number!" });
    }

    const salt = await bcrypt.genSalt(13);
    const hashed_password = await bcrypt.hash(password, salt);
    const hashed_rationCardNo = await bcrypt.hash(rationCardNo, salt);

    const newBeneficiary = await prisma.beneficiery.create({
      data: {
        full_name: fullName,
        email,
        phone_no,
        password: hashed_password,
        family_size,
        state,
        district,
        address,
        ration_card_no: hashed_rationCardNo,
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
      .json({ message: "Beneficiary created successfully!", newBeneficiary });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export { registerBeneficiary };
