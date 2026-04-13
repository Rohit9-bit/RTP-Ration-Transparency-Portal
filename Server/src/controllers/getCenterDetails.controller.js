import { prisma } from "../DB/db.config.js";

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const getCenterDetails = async (req, res) => {
  try {
    const { state, district } = req.query;

    const centers = await prisma.distribution_center.groupBy({
      by: ["state", "district", "center_name", "center_id"],
      where: {
        state: capitalizeFirst(state),
        district: capitalizeFirst(district),
      },
    });
    res.status(200).json({ centers });
  } catch (error) {
    console.log("Error fetching center details:", error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export { getCenterDetails };
