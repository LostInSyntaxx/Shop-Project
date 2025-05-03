import React, { useEffect } from "react";
import useShopStore from "../../store/shop-store.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTrash,
    faShoppingCart,
    faEdit,
    faMoneyBillWave,
    faArrowRight,
    faBoxOpen,
    faMinus,
    faPlus
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import { userApi } from "../../Api/api-user.jsx";
import Swal from "sweetalert2";

const ListCart = () => {
    const cart = useShopStore((state) => state.carts);
    const user = useShopStore((s) => s.user);
    const token = useShopStore((s) => s.token);
    const getTotalPrice = useShopStore((state) => state.getTotalPrice);
    const actionRemoveProduct = useShopStore((state) => state.actionRemoveProduct);
    const actionUpdateQuantity = useShopStore((state) => state.actionUpdateQuantity);

    const navigate = useNavigate();

    const handleSaveCart = async () => {
    if (cart.length === 0) {
        Swal.fire({
            title: '<i class="fas fa-shopping-cart fa-lg mr-2"></i>ตะกร้าว่างเปล่า',
            html: `
                <div class="flex flex-col items-center py-4">
                    <svg class="w-16 h-16 text-amber-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25" />
                    </svg>
                    <p class="text-slate-200 text-center">กรุณาเพิ่มสินค้าก่อนทำการสั่งซื้อ</p>
                </div>
            `,
            background: "#1e293b",
            width: '400px',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            backdrop: 'rgba(0,0,0,0.7)',
            customClass: {
                popup: 'border border-amber-400/30 shadow-lg shadow-amber-500/10'
            },
            showClass: {
                popup: 'animate__animated animate__shakeX'
            }
        });
        return;
    }

    try {
        await userApi(token, { cart });
        Swal.fire({
            title: '<i class="fas fa-check-circle fa-lg mr-2 text-emerald-400"></i>สั่งซื้อสำเร็จ!',
            html: `
                <div class="flex flex-col items-center py-2">
                    <div class="relative mb-4">
                        <svg class="w-24 h-24 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div class="absolute -inset-4 bg-emerald-400/10 rounded-full animate-ping"></div>
                    </div>
                    <p class="text-slate-200 mb-1">กำลังนำทางไปหน้าชำระเงิน...</p>
                    <div class="w-full bg-slate-600 rounded-full h-1.5 mt-3">
                        <div class="bg-emerald-400 h-1.5 rounded-full animate-[progress_2.5s_linear_forwards]"></div>
                    </div>
                </div>
            `,
            background: "#1e293b",
            width: '420px',
            showConfirmButton: false,
            timer: 2500,
            backdrop: 'rgba(0,0,0,0.7)',
            customClass: {
                popup: 'border border-emerald-400/30 shadow-lg shadow-emerald-500/10'
            }
        });

        setTimeout(() => {
            navigate("/checkout");
        }, 2500);
    } catch (err) {
        console.error(err);
        Swal.fire({
            title: '<i class="fas fa-exclamation-triangle fa-lg mr-2 text-rose-500"></i>เกิดข้อผิดพลาด!',
            html: `
                <div class="flex flex-col items-center py-2">
                    <svg class="w-20 h-20 text-rose-500 mb-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    <p class="text-slate-200 text-center">${err.response?.data?.message || "ไม่สามารถสั่งซื้อได้ กรุณาลองใหม่อีกครั้ง"}</p>
                </div>
            `,
            background: "#1e293b",
            width: '400px',
            showConfirmButton: true,
            confirmButtonText: 'ลองอีกครั้ง',
            confirmButtonColor: '#3b82f6',
            backdrop: 'rgba(0,0,0,0.7)',
            customClass: {
                popup: 'border border-rose-500/30 shadow-lg shadow-rose-500/10',
                confirmButton: 'px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 transition-colors duration-200'
            }
        });
    }
};

    const handleRemoveItem = (id) => {
    Swal.fire({
        title: '<i class="fas fa-trash-alt fa-lg mr-2 text-rose-500"></i>ยืนยันการลบสินค้า',
        html: `
            <div class="flex flex-col items-center py-2">
                <svg class="w-20 h-20 text-rose-500/80 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                <p class="text-slate-200 text-center">คุณต้องการลบสินค้านี้ออกจากตะกร้าหรือไม่?</p>
            </div>
        `,
        background: "#1e293b",
        width: '420px',
        showCancelButton: true,
        confirmButtonText: '<i class="fas fa-trash mr-2"></i>ลบสินค้า',
        cancelButtonText: '<i class="fas fa-times mr-2"></i>ยกเลิก',
        confirmButtonColor: "#ef4444",
        cancelButtonColor: "#64748b",
        backdrop: 'rgba(0,0,0,0.7)',
        customClass: {
            popup: 'border border-rose-500/30 shadow-lg shadow-rose-500/10',
            confirmButton: 'px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 transition-colors duration-200 flex items-center',
            cancelButton: 'px-4 py-2 rounded-lg bg-slate-500 hover:bg-slate-600 transition-colors duration-200 flex items-center'
        },
        showClass: {
            popup: 'animate__animated animate__zoomIn'
        },
        hideClass: {
            popup: 'animate__animated animate__zoomOut'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            actionRemoveProduct(id);
            Swal.fire({
                title: '<i class="fas fa-check-circle fa-lg mr-2 text-emerald-400"></i>ลบสินค้าเรียบร้อย!',
                background: "#1e293b",
                width: '380px',
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                backdrop: 'rgba(0,0,0,0.7)',
                customClass: {
                    popup: 'border border-emerald-400/30 shadow-lg shadow-emerald-500/10'
                },
                showClass: {
                    popup: 'animate__animated animate__fadeInUp'
                },
                hideClass: {
                    popup: 'animate__animated animate__fadeOutDown'
                }
            });
        }
    });
};

    useEffect(() => {
        AOS.init({ duration: 800 });
    }, []);

    if (cart.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-8 rounded-2xl border border-gray-700/50 max-w-md w-full">
                    <FontAwesomeIcon 
                        icon={faShoppingCart} 
                        className="text-5xl text-purple-400/50 mb-4" 
                    />
                    <h3 className="text-xl font-bold text-gray-300 mb-2">ตะกร้าสินค้าว่างเปล่า</h3>
                    <p className="text-gray-400 mb-6">คุณยังไม่มีสินค้าในตะกร้า</p>
                    <Link 
                        to="/shop" 
                        className="btn bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all"
                    >
                        ไปช็อปปิ้งตอนนี้
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8" data-aos="fade-down">
                <FontAwesomeIcon 
                    icon={faShoppingCart} 
                    className="text-2xl text-purple-400" 
                />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    รายการสินค้าในตะกร้า ({cart.length})
                </h1>
            </div>

            {/* Cart Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" data-aos="fade-up">
                {/* Product List */}
                <div className="lg:col-span-2 space-y-4">
                    {cart.map((item, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-5 rounded-xl border border-gray-700/50 hover:border-purple-400/30 transition-all group"
                            data-aos="zoom-in"
                            data-aos-delay={index * 100}
                        >
                            <div className="flex flex-col sm:flex-row gap-4">
                                {/* Product Image */}
                                <div className="flex-shrink-0">
                                    {item.images && item.images.length > 0 ? (
                                        <img
                                            src={item.images[0].url}
                                            alt={item.title}
                                            className="w-24 h-24 rounded-lg object-cover border border-gray-700/50"
                                        />
                                    ) : (
                                        <div className="w-24 h-24 bg-gray-800/50 rounded-lg flex items-center justify-center text-gray-500 border border-gray-700/50">
                                            <FontAwesomeIcon icon={faBoxOpen} size="2x" />
                                        </div>
                                    )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg text-white line-clamp-1">{item.title}</h3>
                                            <p className="text-gray-400 text-sm mt-1">
                                                ฿{item.price.toLocaleString()} x {item.count}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            className="text-gray-500 hover:text-rose-400 transition-colors p-1"
                                        >
                                            <FontAwesomeIcon icon={faTrash} />
                                        </button>
                                    </div>

                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-4 mt-4">
                                        <button 
                                            onClick={() => actionUpdateQuantity(item.id, item.count - 1)}
                                            disabled={item.count <= 1}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center ${item.count <= 1 ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-700 hover:bg-purple-500 text-white'}`}
                                        >
                                            <FontAwesomeIcon icon={faMinus} size="xs" />
                                        </button>
                                        <span className="w-8 text-center font-medium">{item.count}</span>
                                        <button 
                                            onClick={() => actionUpdateQuantity(item.id, item.count + 1)}
                                            className="w-8 h-8 rounded-full bg-gray-700 hover:bg-purple-500 text-white flex items-center justify-center"
                                        >
                                            <FontAwesomeIcon icon={faPlus} size="xs" />
                                        </button>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="sm:text-right flex-shrink-0">
                                    <span className="font-bold text-xl text-purple-400">
                                        ฿{(item.price * item.count).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 rounded-xl border border-gray-700/50 h-fit sticky top-6" data-aos="zoom-in">
                    <div className="flex items-center gap-3 mb-6">
                        <FontAwesomeIcon icon={faMoneyBillWave} className="text-xl text-emerald-400" />
                        <h2 className="text-xl font-bold text-white">สรุปคำสั่งซื้อ</h2>
                    </div>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">จำนวนสินค้า</span>
                            <span className="font-medium">{cart.length} ชิ้น</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-400">ค่าจัดส่ง</span>
                            <span className="font-medium text-green-400">ฟรี</span>
                        </div>
                        <div className="border-t border-gray-700/50 my-3"></div>
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-bold">รวมสุทธิ</span>
                            <span className="text-2xl font-bold text-emerald-400">
                                ฿{getTotalPrice().toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {user ? (
                        <button
                            onClick={handleSaveCart}
                            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-2 mb-4"
                        >
                            ดำเนินการชำระเงิน
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    ) : (
                        <Link to="/login" className="block">
                            <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold hover:from-blue-600 hover:to-indigo-600 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2 mb-4">
                                เข้าสู่ระบบเพื่อสั่งซื้อ
                            </button>
                        </Link>
                    )}

                    <Link to="/shop">
                        <button className="w-full py-3 px-6 rounded-xl bg-gray-700/50 text-gray-300 font-medium hover:bg-gray-700/70 transition-all duration-300 border border-gray-700 flex items-center justify-center gap-2">
                            <FontAwesomeIcon icon={faEdit} />
                            เพิ่ม/แก้ไขสินค้า
                        </button>
                    </Link>

                    <p className="text-sm text-gray-400 text-center mt-4 flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        จัดส่งภายใน 2-3 วันทำการ
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ListCart;