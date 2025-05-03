import React, { useEffect, useState } from "react";
import { listUserApi, saveAddress } from "../../Api/api-user.jsx";
import useShopStore from "../../store/shop-store.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faBox,
    faCartArrowDown,
    faMoneyBillWave,
    faCreditCard,
    faTruck,
    faTag,
    faCheckCircle,
    faMapMarkerAlt,
    faEdit
} from "@fortawesome/free-solid-svg-icons";

const CheckoutUser = () => {
    const token = useShopStore((s) => s.token);
    const [products, setProducts] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [address, setAddress] = useState("");
    const [addressSaved, setAddressSaved] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        hdlGetUserCart(token);
    }, []);

    const hdlGetUserCart = (token) => {
        listUserApi(token)
            .then((res) => {
                setProducts(res.data.products);
                setCartTotal(res.data.cartTotal);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const showSwal = (icon, title, text) => {
        const iconConfig = {
            success: {
                iconColor: "#10b981",
                iconHtml: `<svg class="w-12 h-12 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>`,
                borderColor: "border-emerald-400/30"
            },
            error: {
                iconColor: "#ef4444",
                iconHtml: `<svg class="w-12 h-12 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>`,
                borderColor: "border-rose-500/30"
            },
            warning: {
                iconColor: "#f59e0b",
                iconHtml: `<svg class="w-12 h-12 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>`,
                borderColor: "border-amber-400/30"
            }
        };

        Swal.fire({
            html: `
                <div class="flex flex-col items-center py-2">
                    <div class="mb-3">${iconConfig[icon].iconHtml}</div>
                    <h3 class="text-xl font-medium text-slate-100 mb-2">${title}</h3>
                    <p class="text-slate-300 text-center">${text}</p>
                    <div class="w-full bg-slate-600 rounded-full h-1 mt-4">
                        <div class="bg-${icon === "success" ? "emerald" : icon === "error" ? "rose" : "amber"}-400 h-1 rounded-full animate-[progress_3s_linear_forwards]"></div>
                    </div>
                </div>
            `,
            background: "#1e293b",
            width: '400px',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: false,
            backdrop: 'rgba(0,0,0,0.7)',
            customClass: {
                popup: `border ${iconConfig[icon].borderColor} shadow-lg shadow-${icon === "success" ? "emerald" : icon === "error" ? "rose" : "amber"}-500/10 rounded-xl`
            },
            showClass: {
                popup: 'animate__animated animate__fadeInDown animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp animate__faster'
            }
        });
    };

    const hdSaveAddress = () => {
        if (!address) {
            showSwal("error", "กรุณากรอกที่อยู่", "กรุณากรอกที่อยู่ก่อนบันทึก");
            return;
        }

        saveAddress(token, address)
            .then((res) => {
                setAddressSaved(true);
                showSwal("success", "บันทึกที่อยู่สำเร็จ", "คุณสามารถดำเนินการชำระเงินได้");
                
                // Add a nice ripple effect to the saved address UI
                const addressBox = document.querySelector('.address-box');
                if (addressBox) {
                    addressBox.classList.add('animate-[ripple_1s_ease-in-out]');
                    setTimeout(() => {
                        addressBox.classList.remove('animate-[ripple_1s_ease-in-out]');
                    }, 1000);
                }
            })
            .catch((err) => {
                showSwal("error", "บันทึกที่อยู่ล้มเหลว", err.response?.data?.message || "โปรดลองอีกครั้ง");
                console.error(err);
            });
    };

    const GoToQrCode = () => {
        if (!addressSaved) {
            showSwal("warning", "กรุณาบันทึกที่อยู่", "คุณต้องบันทึกที่อยู่ก่อนชำระเงิน");
            
            // Add a gentle shake to the payment button for attention
            const paymentBtn = document.querySelector('.payment-btn');
            if (paymentBtn) {
                paymentBtn.classList.add('animate__animated', 'animate__headShake');
                setTimeout(() => {
                    paymentBtn.classList.remove('animate__animated', 'animate__headShake');
                }, 1000);
            }
            return;
        }
        
        // Show loading state before navigation
        showSwal("success", "กำลังไปหน้าชำระเงิน", "กรุณารอสักครู่...");
        setTimeout(() => {
            navigate("/user/payment");
        }, 1500);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Section - Shipping Address */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center">
                        <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm mr-4">
                            <FontAwesomeIcon icon={faHome} className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">ที่อยู่การจัดส่ง</h2>
                            <p className="text-blue-100 text-sm">กรุณากรอกที่อยู่จัดส่งที่ชัดเจน</p>
                        </div>
                    </div>
                    
                    {/* Address Form */}
                    <div className="p-6">
                        <div className="relative">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                                <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-blue-500" />
                                ที่อยู่เต็มรูปแบบ
                            </label>
                            <textarea
                                required
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="บ้านเลขที่, หมู่บ้าน, อาคาร, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์..."
                                className="w-full p-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all min-h-[150px]"
                            />
                        </div>
                        
                        <div className="flex justify-end mt-6">
                            <button
                                onClick={hdSaveAddress}
                                disabled={addressSaved}
                                className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center ${addressSaved ? 
                                    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700 cursor-not-allowed' : 
                                    'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-md hover:shadow-lg'}`}
                            >
                                {addressSaved ? (
                                    <>
                                        <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                        บันทึกแล้ว
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                        บันทึกที่อยู่
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Order Summary - Mobile View */}
                <div className="lg:hidden">
                    <OrderSummary 
                        products={products} 
                        cartTotal={cartTotal} 
                        addressSaved={addressSaved} 
                        GoToQrCode={GoToQrCode} 
                    />
                </div>
            </div>

            {/* Right Section - Order Summary (Desktop) */}
            <div className="hidden lg:block">
                <div className="sticky top-6">
                    <OrderSummary 
                        products={products} 
                        cartTotal={cartTotal} 
                        addressSaved={addressSaved} 
                        GoToQrCode={GoToQrCode} 
                    />
                </div>
            </div>
        </div>
    );
};

const OrderSummary = ({ products, cartTotal, addressSaved, GoToQrCode }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4 flex items-center">
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm mr-4">
                    <FontAwesomeIcon icon={faCartArrowDown} className="text-white text-xl" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">สรุปคำสั่งซื้อ</h2>
                    <p className="text-purple-100 text-sm">{products.length} รายการในตะกร้า</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Product List */}
                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {products.map((item, index) => (
                        <div key={index} className="flex justify-between items-start pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-start gap-3">
                                {item.product.images?.[0] ? (
                                    <img 
                                        src={item.product.images[0]} 
                                        alt={item.product.title}
                                        className="w-14 h-14 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-200 dark:border-gray-600">
                                        <FontAwesomeIcon icon={faBox} />
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white line-clamp-1">{item.product.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {item.count} × ฿{item.product.price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <p className="font-bold text-purple-600 dark:text-purple-400">
                                ฿{(item.count * item.product.price).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faTruck} className="text-gray-500 dark:text-gray-400" />
                            ค่าจัดส่ง
                        </span>
                        <span>฿0.00</span>
                    </div>
                    <div className="flex justify-between text-gray-600 dark:text-gray-300">
                        <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faTag} className="text-gray-500 dark:text-gray-400" />
                            ส่วนลด
                        </span>
                        <span>฿0.00</span>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-yellow-500 dark:text-yellow-400" />
                        ยอดรวมสุทธิ
                    </h3>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">฿{cartTotal.toLocaleString()}</p>
                </div>

                {/* Checkout Button */}
                <button
                    onClick={GoToQrCode}
                    disabled={!addressSaved}
                    className={`w-full py-3 px-6 rounded-lg font-bold transition-all flex items-center justify-center gap-2 payment-btn ${addressSaved ? 
                        'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg' : 
                        'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}
                >
                    <FontAwesomeIcon icon={faCreditCard} />
                    ดำเนินการชำระเงิน
                </button>
            </div>
        </div>
    );
};

export default CheckoutUser;