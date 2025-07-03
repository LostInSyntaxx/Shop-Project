const prisma = require('../config/prisma');
const { debug, success, error } = require('../utils/logger');

exports.listUsers = async (req, res) => {
    try {
        debug('Fetching user list...');
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                role: true,
                enabled: true,
                address: true,
                discordId: true,
                avatar: true,
                googleId: true,
                name: true
            }
        });
        success('Users fetched successfully', users);
        res.send(users);
    } catch (err) {
        error('Error fetching user list', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.changeStatus = async (req, res) => {
    try {
        const { id, enabled } = req.body;
        debug('Changing user status', { id, enabled });

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { enabled }
        });
        success('User status updated', user);
        res.send('Update Status Success');
    } catch (err) {
        error('Error changing user status', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.changeRole = async (req, res) => {
    try {
        const { id, role } = req.body;
        debug('Changing user role', { id, role });

        const user = await prisma.user.update({
            where: { id: Number(id) },
            data: { role }
        });
        success('User role updated', user);
        res.send('Update Role Success');
    } catch (err) {
        error('Error changing user role', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.userCart = async (req, res) => {
    try {
        const { cart } = req.body;
        debug('Saving user cart', cart);

        const user = await prisma.user.findFirst({
            where: { id: Number(req.user.id) }
        });

        for (const item of cart) {
            const product = await prisma.product.findUnique({
                where: { id: item.id },
                select: { quantity: true, title: true },
            });
            if (!product || item.count > product.quantity) {
                return res.status(400).json({
                    ok: false,
                    message: `ขออภัย. สินค้า ${product?.title || "product"} หมด`,
                });
            }
        }

        await prisma.productOnCart.deleteMany({
            where: {
                cart: {
                    orderedById: user.id
                }
            }
        });

        await prisma.cart.deleteMany({
            where: { orderedById: user.id }
        });

        let products = cart.map((item) => ({
            productId: item.id,
            count: item.count,
            price: item.price
        }));

        let cartTotal = products.reduce((sum, item) => sum + item.price * item.count, 0);

        const newCart = await prisma.cart.create({
            data: {
                products: {
                    create: products
                },
                cartTotal: cartTotal,
                orderedById: user.id
            }
        });

        success('Cart saved successfully', newCart);
        res.send('Add Cart Ok');
    } catch (err) {
        error('Error saving user cart', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

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
        });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        success('Fetched user cart');
        res.json({
            products: cart.products,
            cartTotal: cart.cartTotal
        });
    } catch (err) {
        error('Error fetching user cart', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.emptyCart = async (req, res) => {
    try {
        const cart = await prisma.cart.findFirst({
            where: { orderedById: Number(req.user.id) }
        });

        if (!cart) {
            return res.status(400).json({ message: 'Cart not found' });
        }

        await prisma.productOnCart.deleteMany({
            where: { cartId: cart.id }
        });

        const result = await prisma.cart.deleteMany({
            where: { orderedById: Number(req.user.id) }
        });

        success('Emptied cart', result);
        res.json({
            message: 'Cart Empty Success',
            deletedCount: result.count
        });
    } catch (err) {
        error('Error emptying cart', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.saveAddress = async (req, res) => {
    try {
        const { address } = req.body;
        debug('Saving address', address);

        const addressUser = await prisma.user.update({
            where: { id: Number(req.user.id) },
            data: { address }
        });

        success('Address updated', addressUser);
        res.json({ ok: true, message: 'Address update Success' });
    } catch (err) {
        error('Error updating address', err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.saveOrder = async (req, res) => {
    try {
        const { id, amount, status, currency } = req.body.paymentIntent;
        debug('Saving order', req.body.paymentIntent);

        const userCart = await prisma.cart.findFirst({
            where: { orderedById: Number(req.user.id) },
            include: { products: true }
        });

        if (!userCart || userCart.products.length === 0) {
            return res.status(400).json({ ok: false, message: "Cart is Empty" });
        }

        const amountTHB = Number(amount) / 100;

        const order = await prisma.order.create({
            data: {
                products: {
                    create: userCart.products.map(item => ({
                        productId: item.productId,
                        count: item.count,
                        price: item.price
                    }))
                },
                orderedBy: {
                    connect: { id: req.user.id }
                },
                cartTotal: userCart.cartTotal,
                strpePaymentId: id,
                amount: amountTHB,
                status,
                currentcy: currency
            }
        });

        const update = userCart.products.map((item) => ({
            where: { id: item.productId },
            data: {
                quantity: { decrement: item.count },
                sold: { increment: item.count }
            }
        }));

        await Promise.all(update.map((updated) => prisma.product.update(updated)));

        await prisma.cart.deleteMany({ where: { orderedById: Number(req.user.id) } });

        success('Order saved successfully', order);
        return res.json({ ok: true, order });

    } catch (err) {
        error('Error saving order', err);
        return res.status(500).json({ ok: false, message: "Internal Server Error" });
    }
};

exports.getOrder = async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            where: { orderedById: Number(req.user.id) },
            include: {
                products: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (orders.length === 0) {
            return res.status(400).json({ ok: false, message: "No orders" });
        }

        success('Orders fetched', orders);
        res.json({ ok: true, orders });
    } catch (err) {
        error('Error fetching orders', err);
        res.status(500).json({ message: "Server Error" });
    }
};
