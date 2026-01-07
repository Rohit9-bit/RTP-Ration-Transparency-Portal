import { prisma } from "../DB/db.config.js";

const beneficiaryDashboard = async (req, res) => {
  try {
    // My current Entitlement and This months status
    const beneficiary = req.beneficiary;


    const thisMonthsQuota = await prisma.quota.findMany({
        take: 4,
        where: {
            beneficiaryId: beneficiary.beneficiary_id,
            month_year: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            }
        },
        select: {
            month_year: true,
            quantity_entitled: true,
            quantity_remaining: true,
            commodity: {
                select: {
                    commodity_name: true,
                }
            }
        }
    });

    console.log(thisMonthsQuota);

    // Account information

    const beneficiaryAccountsDetails = await prisma.beneficiary.findFirst({
        where: {
            beneficiary_id: beneficiary.beneficiary_id,
        },
        select: {
            beneficiary_id: true,
            ration_card_no: true,
            family_size: true,
            district: true,
            distributionCenter: {
                select: {
                    center_name: true,
                    address: true,
                }
            }
        }
    })

    console.log(beneficiaryAccountsDetails)

    // Recent Transaction(this months)

    const thisMonthsTransaction = new Map();

    const recentTransactions = await prisma.transaction_log.findMany({
        where: {
            beneficiaryId: beneficiary.beneficiary_id,
            createdAt: {
                gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            }
        },
        select: {
            quantity_entitled: true,
            quantity_received: true,
            anomaly_type: true,
            is_verified_by_beneficiery: true,
            createdAt: true,
            distributionCenter: {
                select: {
                    center_name: true,
                    address: true
                }
            },
            commodity: {
                select: {
                    commodity_name: true,
                }
            }
        }
    })


    for(const entry of recentTransactions){
        const key = entry.createdAt.toISOString().slice(0, 7);
        if(!thisMonthsTransaction.has(key)){
            thisMonthsTransaction.set(key, {
                dateTime: entry.createdAt,
                shopDetails: {
                    name: entry.distributionCenter.center_name,
                    address: entry.distributionCenter.address
                },
                items: [{
                    name: entry.commodity.commodity_name,
                    quantity_entitled: entry.quantity_entitled,
                    quantity_received: entry.quantity_received,
                }],
                status: {
                    status: "completed",
                    anomaly_type: entry.anomaly_type === null ? "none" : entry.anomaly_type,
                }
            })
        }else{
            thisMonthsTransaction.get(key).items.push({
                name: entry.commodity.commodity_name,
                quantity_entitled: entry.quantity_entitled,
                quantity_received: entry.quantity_received,
            })
        }
    }

    

    console.log(...thisMonthsTransaction.values());


    res.status(200).json({message: "Everythings fine!"});
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Internal server error!" });
  }
};

export default beneficiaryDashboard;
