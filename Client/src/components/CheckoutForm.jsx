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
                    title: "Payment Failed",
                    text: payload.error.message,
                    background: "#1a1a2e",
                    color: "#fff",
                    confirmButtonColor: "#e94560",
                    confirmButtonText: "Try Again",
                    iconColor: "#e94560"
                });
            }
        } else {
            saveOrder(token, payload)
                .then((res) => {
                    if (isAlertEnabled) {
                        Swal.fire({
                            icon: "success",
                            title: "Payment Successful!",
                            text: "Your order has been confirmed",
                            background: "#1a1a2e",
                            color: "#fff",
                            confirmButtonColor: "#0f3460",
                            confirmButtonText: "View Orders",
                            iconColor: "#4ade80"
                        }).then(() => {
                            clearCart();
                            navigate('/user/history');
                        });
                    } else {
                        clearCart();
                        navigate('/user/history');
                    }
                })
                .catch(() => {
                    if (isAlertEnabled) {
                        Swal.fire({
                            icon: "error",
                            title: "Error Occurred",
                            text: "Failed to save your order. Please try again.",
                            background: "#1a1a2e",
                            color: "#fff",
                            confirmButtonColor: "#e94560",
                            confirmButtonText: "OK"
                        });
                    }
                });
        }

        setIsLoading(false);
    };

    return (
        <div className="max-w-md mx-auto bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-600 rounded-lg shadow-md">
                        <FontAwesomeIcon icon={faCreditCard} className="text-white text-xl" />
                    </div>
                   <h2 className="text-gradient">Payment Details</h2>
                </div>
                <label className="flex items-center space-x-2 cursor-pointer group">
                    <div className="relative">
                        <input
                            type="checkbox"
                            checked={isAlertEnabled}
                            onChange={() => setIsAlertEnabled(!isAlertEnabled)}
                            className="sr-only"
                        />
                        <div className={`block w-12 h-6 rounded-full transition-colors ${isAlertEnabled ? 'bg-indigo-600' : 'bg-gray-600'}`}></div>
                        <div className={`absolute left-1 top-1 w-4 h-4 rounded-full transition-all duration-300 ${isAlertEnabled ? 'translate-x-6 bg-white' : 'bg-gray-300'}`}></div>
                    </div>
                    <span className="text-gray-300 text-sm font-medium flex items-center gap-1 group-hover:text-gray-200 transition-colors">
                        <FontAwesomeIcon icon={faBell} size="sm" /> Alerts
                    </span>
                </label>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="p-5 bg-gray-800/60 rounded-xl border border-gray-700 backdrop-blur-sm shadow-inner">
                    <PaymentElement
                        options={{
                            style: {
                                base: {
                                    color: "#ffffff",
                                    fontSize: "16px",
                                    fontFamily: 'Inter, sans-serif',
                                    "::placeholder": {
                                        color: "#a0aec0"
                                    },
                                    iconColor: "#a0aec0",
                                },
                                invalid: {
                                    color: "#ef4444",
                                    iconColor: "#ef4444"
                                }
                            },
                            layout: {
                                type: "tabs",
                                defaultCollapsed: false
                            }
                        }}
                    />
                </div>
                
                <button
                    disabled={isLoading || !stripe || !elements}
                    className={`w-full py-3.5 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg
                        ${isLoading ? "bg-gray-600 cursor-not-allowed" : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 active:scale-[0.98]"}
                        flex items-center justify-center gap-2 relative overflow-hidden
                    `}
                >
                    {isLoading && (
                        <span className="absolute inset-0 bg-white/10 backdrop-blur-[1px]"></span>
                    )}
                    {isLoading ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                            Processing Payment...
                            
                        </>

                    ) : (
                        <>
                            <FontAwesomeIcon icon={faCheckCircle} />
                            Pay Now
                        </>
                    )}
                </button>
                
                {message && (
                    <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm flex items-center gap-3 animate-fade-in">
                        <FontAwesomeIcon icon={faTimesCircle} className="text-red-400" />
                        <span>{message}</span>
                    </div>
                )}
            </form>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
                <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span>Payments are secure and encrypted</span>
                </div>
            </div>
        </div>
    );
};

export default CheckoutForm;