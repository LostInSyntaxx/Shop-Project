import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { payment } from "../../Api/stripe.jsx";
import useShopStore from "../../store/shop-store.jsx";
import CheckoutForm from "../../components/CheckoutForm.jsx";
const stripePromise = loadStripe("pk_test_51QuQroAuqvVDRcjtNNQqRqJ0eQhI3UmkEj7p0N1CcDc9piq5tOxgqvOyBfmBihsdIYrZExxn6el3TFB7yBTvluWF00bU16Qz1Y");

const Payment = () => {
    const token = useShopStore((state)=>state.token)
    const [clientSecret, setClientSecret] = useState("");

    useEffect(() => {
        payment(token)
            .then((res)=> {
                setClientSecret(res.data.clientSecret)
            })
            .catch((err)=> {
                console.log(err)
            })
    }, []);
    const appearance = {
        theme: 'stripe',
    };
    const loader = 'auto';

    return <div>
        {
            clientSecret && (
                <Elements options={{clientSecret, appearance, loader}} stripe={stripePromise}>
                    <CheckoutForm/>
                </Elements>
            )
        }
        </div>

}
export default Payment
