const prisma = require("../config/prisma")

exports.changeOrderStatus = async (req, res) => {
    try {
        const { orderId, orderStatus } = req.body
        // console.log(orderId, orderStatus)
        if (!orderId || !orderStatus) {
            return res.status(400).json({ error: "Order ID and status are required." });
        }

        const orderUpdate = await prisma.order.update({
            where: { id: orderId },
            data: { orderStatus: orderStatus }
        })

        res.json({ message: "Order status updated successfully", orderUpdate });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Server error" })
    }
}
exports.getOrderAdmin = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: {
                products: {
                    include: {
                        product: true
                    }
                },
                orderedBy: {
                    select: {
                        id: true,
                        email: true,
                        address: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc' 
            }
        });


        res.json(validOrders);
    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            message: "Server error",
            error: err.message 
        });
    }
}