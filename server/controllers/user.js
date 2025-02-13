const prisma = require('../config/prisma')

exports.listUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                enabled: true,
                address: true,
            }
        })
        res.send(users)
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error"})
    }
}

exports.changeStatus = async (req, res) => {
    try {
        const {id , enabled} = req.body
        console.log(id , enabled)
        const user = await prisma.user.update({
            where: {id:Number(id) },
            data: {enabled: enabled}
        })
        res.send('Update Status Success')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error"})
    }
}

exports.changeRole = async (req, res) => {
    try {
        const { id, role } = req.body;
        console.log(id, role);
        const user = await prisma.user.update({
            where: { id:Number(id)},
            data: {role: role}
        })
        res.send('Update Role Success')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error"})
    }
}

exports.userCart = async (req, res) => {
    try {
        const { cart } = req.body
        const user = await prisma.user.findFirst({
            where: {id :Number(req.user.id)}
        })
        //console.log(user)

        await prisma.productOnCart.deleteMany({
            where: {
                cart: {
                    orderedById: user.id
                }
            }
        })

        await prisma.cart.deleteMany({
            where: { orderedById: user.id }
        })

        let products = cart.map((item)=> ({
            productId: item.id,
            count: item.count,
            price: item.price
        }))

        let cartTotal = products.reduce((sum, item)=> sum+item.price *  item.count, 0)

        const newCart = await prisma.cart.create({
            data: {
                products: {
                    create: products
                },
                cartTotal: cartTotal,
                orderedById: user.id
            }
        })
        console.log(newCart)

        res.send('Add Cart Ok')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error"})
    }
}

exports.getUserCart = async (req, res) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: {
                orderedById: Number(req.user.id)
            },
            include: {
                products: {
                    include: {
                        product: true
                    }
                }
            }
        })
        //console.log(cart)
        res.json({
            products: cart.products,
            cartTotal: cart.cartTotal
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error"})
    }
}

exports.emptyCart = async (req, res) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: { orderedById: Number(req.user.id) }
        })
        if(!cart){
            return res.status(400).json({ message: 'Cart not found' })
        }
        await prisma.productOnCart.deleteMany({
            where: { cartId: cart.id }
        })
        const result = await prisma.cart.deleteMany({
            where: {orderedById:Number(req.user.id)}
        })
        console.log(result)
        res.json({
            message: 'Cart Empty Success',
            deletedCount: result.count
        })
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error"})
    }
}

exports.saveAddress = async (req, res) => {
    try {
        const { address } = req.body
        console.log(address)
        const addressUser = await prisma.user.update({
            where: {
                id: Number(req.user.id)
            },
            data: {
                address: address
            }
        })
        res.json({ ok: true, message: 'Address update Success'})
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error"})
    }
}

exports.saveOrder = async (req, res) => {
    try {
        // ตรวจสอบว่า req.user.id มีค่าหรือไม่
        if (!req.user || !req.user.id) {
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        }

        const userId = Number(req.user.id);

        // ดึงข้อมูลตะกร้าสินค้า
        const userCart = await prisma.cart.findFirst({
            where: { orderedById: userId },
            include: { products: true }
        });

        if (!userCart || userCart.products.length === 0) {
            return res.status(400).json({ ok: false, message: "Cart is Empty" });
        }

        // ดึงข้อมูลสินค้าทั้งหมดใน cart ทีเดียว
        const productIds = userCart.products.map(item => item.productId);
        const products = await prisma.product.findMany({
            where: { id: { in: productIds } },
            select: { id: true, quantity: true, title: true }
        });

        // สร้าง map ของสินค้าเพื่อง่ายต่อการตรวจสอบ
        const productMap = new Map(products.map(p => [p.id, p]));

        // ตรวจสอบว่าสินค้าใน stock เพียงพอหรือไม่
        for (const item of userCart.products) {
            const product = productMap.get(item.productId);
            if (!product || item.count > product.quantity) {
                return res.status(400).json({
                    ok: false,
                    message: `ขออภัย. สินค้า ${product?.title || 'ไม่ทราบชื่อ'} หมด`
                });
            }
        }

        // สร้างคำสั่งซื้อ
        const order = await prisma.order.create({
            data: {
                products: {
                    create: userCart.products.map(item => ({
                        productId: item.productId,
                        count: item.count,
                        price: item.price
                    }))
                },
                orderedBy: { connect: { id: userId } },
                cartTotal: userCart.cartTotal
            }
        });

        // อัปเดต stock ของสินค้าโดยใช้ batch update
        const updateStockOperations = userCart.products.map(item => ({
            where: { id: item.productId },
            data: {
                quantity: { decrement: item.count },
                sold: { increment: item.count }
            }
        }));

        await Promise.all(updateStockOperations.map(update => prisma.product.update(update)));

        // ลบตะกร้าสินค้าหลังจากสร้างคำสั่งซื้อสำเร็จ
        await prisma.cart.deleteMany({ where: { orderedById: userId } });

        return res.json({ ok: true, order });

    } catch (err) {
        console.error("Error saving order:", err);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

exports.getOrder = async (req,res)=> {
    try {
        const orders = await prisma.order.findMany({
            where: { orderedById: Number(req.user.id) },
            include: {
                products:{
                    include: true
                }
            }
        })
        if(orders.length ===0) {
            return res.status(400).json({ ok: false, message: 'No orders' })
        }
        res.json({ ok: true, orders })
        console.log(orders)
        res.send('Hello getOrder')
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server Error' })
    }
}