import React, { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { saveOrder } from "../Api/api-user";
import useShopStore from "../store/shop-store.jsx";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faCheckCircle, faTimesCircle, faSpinner, faBell } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const CheckoutForm = () => {
    const navigate = useNavigate();
    const clearCart = useShopStore((state)=> state.clearCart)
    const stripe = useStripe();
    const elements = useElements();
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isAlertEnabled, setIsAlertEnabled] = useState(true);

    const token = useShopStore((state) => state.token);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);

        const payload = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (payload.error) {
            setMessage(payload.error.message);

            if (isAlertEnabled) {
                Swal.fire({
                    icon: "error",
                    title: "การชำระเงินล้มเหลว",
                    text: payload.error.message,
                    background: "#1e1e1e",
                    color: "#fff",
                    confirmButtonColor: "#ff4d4d",
                });
            }
        } else {
            saveOrder(token, payload)
                .then((res) => {
                    if (isAlertEnabled) {
                        Swal.fire({
                            icon: "success",
                            title: "ชำระเงินสำเร็จ!",
                            text: "คำสั่งซื้อของคุณได้รับการยืนยันแล้ว",
                            background: "#1e1e1e",
                            color: "#fff",
                            confirmButtonColor: "#22c55e",
                        });
                        clearCart()
                        navigate('/user/history');
                    }
                })
                .catch(() => {
                    if (isAlertEnabled) {
                        Swal.fire({
                            icon: "error",
                            title: "เกิดข้อผิดพลาด",
                            text: "ไม่สามารถบันทึกคำสั่งซื้อได้ กรุณาลองใหม่",
                            background: "#1e1e1e",
                            color: "#fff",
                            confirmButtonColor: "#ff4d4d",
                        });
                    }
                });
        }

        setIsLoading(false);
    };

    return (
        <div className="max-w-md mx-auto bg-black/25 p-6 rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white/80 flex items-center gap-2">
                    <FontAwesomeIcon icon={faCreditCard} /> ชำระเงิน
                </h2>
                <label className="flex items-center space-x-2 text-white text-xs">
                    <span><FontAwesomeIcon icon={faBell} /> แจ้งเตือน</span>
                    <input
                        type="checkbox"
                        checked={isAlertEnabled}
                        onChange={() => setIsAlertEnabled(!isAlertEnabled)}
                        className="toggle toggle-sm toggle-primary"
                    />
                </label>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="p-4 bg-black/40 rounded-lg border border-gray-600">
                    <PaymentElement
                        options={{
                            style: {
                                base: {
                                    color: "#ffffff", // ✅ ตัวหนังสือสีขาว
                                    fontSize: "16px",
                                    "::placeholder": {
                                        color: "#aaaaaa" // ✅ Placeholder สีเทาอ่อน
                                    },
                                    iconColor: "#ffffff", // ✅ ไอคอนสีขาว
                                },
                                invalid: {
                                    color: "#ff4d4d", // ✅ สีแดงถ้าข้อมูลผิด
                                }
                            }
                        }}
                    />
                </div>
                <button
                    disabled={isLoading || !stripe || !elements}
                    className={`w-full py-3 rounded-lg text-white font-semibold transition-all duration-200
                    ${isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-green-500 hover:bg-green-600 active:scale-95"}
                `}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            กำลังชำระเงิน...
                        </div>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faCheckCircle} /> ชำระเงิน
                        </>
                    )}
                </button>
                {message && <div className="text-red-400 text-sm mt-3 flex items-center gap-2">
                    <FontAwesomeIcon icon={faTimesCircle} /> {message}
                </div>}
            </form>
        </div>
    );
};

export default CheckoutForm;
