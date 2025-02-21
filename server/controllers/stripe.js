const prisma = require('../config/prisma')
const stripe = require("stripe")('sk_test_51QuQroAuqvVDRcjt7YK1ZdWuiYmJ6q18itd4JiaMn52JOiJnfhFTYqXeA8rAHZGXouJhmDbKWyb69wvDXIQt2iQl00ZhQHf3i0');

exports.payment = async (req, res) => {
    try {

        const cart = await prisma.cart.findFirst({
            where: {
                orderedById: req.user.id
            }
        })
        const amountTHB = cart.cartTotal *100

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountTHB,
            currency: "thb",
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Internal Server Error"})
    }
}