import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faShoppingCart,
    faTag,
    faBox,
    faCheckCircle,
    faExclamationTriangle,
    faFire,
    faBell
} from "@fortawesome/free-solid-svg-icons";
import useShopStore from "../../store/shop-store.jsx";
import Swal from "sweetalert2";

const ProductCard = ({ item }) => {
    const actionAddtoCart = useShopStore((state) => state.actionAddtoCart);
    const [isAlertEnabled, setIsAlertEnabled] = useState(true);
const handleAddToCart = () => {
    actionAddtoCart(item);

    if (isAlertEnabled) {
        Swal.fire({
            title: `<strong>${item.title}</strong>`,
            html: `
                <div class="flex flex-col items-center">
                    <svg class="w-16 h-16 text-emerald-500 mb-3 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <p class="text-slate-200">เพิ่มลงตะกร้าเรียบร้อย!</p>
                    <div class="mt-2 flex items-center text-amber-300">
                        <svg class="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                        </svg>
                        ${cartItems.length + 1} รายการ
                    </div>
                </div>
            `,
            background: "#1e293b",
            color: "#f8fafc",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            position: 'bottom-end',
            width: '350px',
            padding: '1.5rem',
            backdrop: false,
            customClass: {
                popup: 'border border-slate-600/50 shadow-lg shadow-emerald-500/10',
                title: 'text-lg font-medium text-slate-100 mb-0'
            },
            showClass: {
                popup: 'animate__animated animate__fadeInUp animate__faster'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutDown animate__faster'
            }
        });
    }
};

    return (
        <div className="card w-72 bg-gradient-to-b from-gray-900/50 to-gray-800/30 rounded-2xl p-4 relative group hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-700/50 hover:border-primary/30">
            {/* Notification Toggle */}
            <div className="absolute top-3 right-3 z-10">
                <label className="flex items-center space-x-1 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={isAlertEnabled}
                        onChange={() => setIsAlertEnabled(!isAlertEnabled)}
                        className="hidden"
                    />
                    <div className={`w-8 h-5 rounded-full flex items-center transition-all duration-200 ${isAlertEnabled ? 'bg-emerald-500/90' : 'bg-gray-600'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${isAlertEnabled ? 'translate-x-4' : 'translate-x-0'}`}></div>
                    </div>
                    <FontAwesomeIcon 
                        icon={faBell} 
                        className={`text-xs ${isAlertEnabled ? 'text-emerald-400' : 'text-gray-400'}`}
                    />
                </label>
            </div>

            {/* Sale Badge */}
            {item.salePrice && (
                <div className="absolute top-3 left-3 z-10">
                    <span className="bg-gradient-to-r from-red-500 to-amber-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <FontAwesomeIcon icon={faFire} className="text-xs" />
                        <span className="font-bold">SALE!</span>
                    </span>
                </div>
            )}

            {/* Product Image */}
            <figure className="relative overflow-hidden rounded-xl mb-4 group">
                {item.images && item.images.length > 0 ? (
                    <img
                        src={item.images[0].url}
                        alt={item.title}
                        className="w-full h-48 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-48 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl text-gray-500">
                        <span className="text-sm">No Image Available</span>
                    </div>
                )}
                
                {/* Add to Cart Button */}
                <button
                    onClick={handleAddToCart}
                    disabled={item.quantity === 0}
                    className={`absolute bottom-3 right-3 p-3 rounded-full shadow-lg transition-all duration-300 ${item.quantity === 0 ? 
                        'bg-gray-600 cursor-not-allowed' : 
                        'bg-emerald-500 hover:bg-emerald-600 group-hover:opacity-100 opacity-0'} transform hover:scale-110`}
                    data-tip={item.quantity === 0 ? "สินค้าหมด" : "เพิ่มลงตะกร้า"}
                >
                    <FontAwesomeIcon 
                        icon={faShoppingCart} 
                        className={`${item.quantity === 0 ? 'text-gray-400' : 'text-white'}`}
                    />
                </button>
            </figure>

            {/* Product Info */}
            <div className="card-body p-2">
                <h2 className="card-title text-lg font-bold text-white line-clamp-1 mb-1">
                    {item.title}
                </h2>
                <p className="text-sm text-gray-400 line-clamp-2 min-h-[40px] mb-3">
                    {item.description || "ไม่มีคำอธิบายสินค้า"}
                </p>

                {/* Price Section */}
                <div className="flex justify-between items-center mb-3">
                    {item.salePrice ? (
                        <div className="flex items-end gap-2">
                            <span className="text-xl font-bold text-amber-400">
                                ฿{item.salePrice.toLocaleString()}
                            </span>
                            <span className="line-through text-gray-500 text-sm mb-0.5">
                                ฿{item.price.toLocaleString()}
                            </span>
                        </div>
                    ) : (
                        <span className="text-xl font-bold text-primary">
                            ฿{item.price.toLocaleString()}
                        </span>
                    )}
                </div>

                {/* Stock Status */}
                <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-700/50">
                    <span className="text-sm text-gray-400 flex items-center gap-2">
                        <FontAwesomeIcon icon={faBox} />
                        <span>คงเหลือ: {item.quantity} ชิ้น</span>
                    </span>
                    
                    {item.quantity === 0 ? (
                        <span className="badge bg-red-900/50 text-red-400 border-red-700/50 px-2 py-1 text-xs flex items-center gap-1">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                            สินค้าหมด
                        </span>
                    ) : item.quantity < 5 ? (
                        <span className="badge bg-amber-900/50 text-amber-400 border-amber-700/50 px-2 py-1 text-xs flex items-center gap-1">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                            เหลือน้อย
                        </span>
                    ) : (
                        <span className="badge bg-emerald-900/50 text-emerald-400 border-emerald-700/50 px-2 py-1 text-xs flex items-center gap-1">
                            <FontAwesomeIcon icon={faCheckCircle} />
                            พร้อมส่ง
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;