import { prisma } from "../DB/db.config.js";

const transactionController = async (req, res) => {
  try {
    const shopOwnereDetails = req.shopOwner;

    const shopOwnersDitributionCenter = await prisma.shop_owner.findFirst({
      where: {
        manager_id: shopOwnereDetails.manager_id,
      },
      select: {
        full_name: true,
        email: true,
        phone_no: true,
        state: true,
        district: true,
        address: true,
        owner_id: true,
        createdAt: true,
        distribution_center: {
          select: {
            center_id: true,
          },
        },
      },
    });

    console.log(shopOwnersDitributionCenter);
    res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
};

export { transactionController };
