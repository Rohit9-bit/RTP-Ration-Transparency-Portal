// import jwt from "jsonwebtoken";
// import { prisma } from "../DB/db.config";

// const protectRoute = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;

//     if (!token) {
//       return res
//         .status(400)
//         .json({ message: "Unauthorized!, No token provided!" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//     if (!decoded) {
//       return res.status(400).json({ message: "Unauthorized!, Invalid token!" });
//     }

//     const user = await prisma.users.findFirst({
//       where: {
//         user_id: decoded.userid,
//       },
//       select: {
//         first_name: true,
//         last_name: true,
//         phone_no: true,
//         email: true,
//         address: true,
//       },
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Unauthorized!, No user found!" });
//     }

//     req.user = user;

//     next();
//   } catch (error) {
//     console.log("Error in protect Route middleware!", error);
//     res.status(500).json({ message: "Internal Server error!" });
//   }
// };

// export { protectRoute };
