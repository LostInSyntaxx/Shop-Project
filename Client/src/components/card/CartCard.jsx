import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import useShopStore from "../../store/shop-store.jsx";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";

const CartCard = () => {
    useEffect(() => {
        AOS.init({ duration: 600 });
    }, []);

    const [hoveredItemId, setHoveredItemId] = useState(null);
    const carts = useShopStore((state) => state.carts);
    const actionUpdateQuantity = useShopStore((state) => state.actionUpdateQuantity);
    const actionRemoveProduct = useShopStore((state) => state.actionRemoveProduct);
    const getTotalPrice = useShopStore((state) => state.getTotalPrice);

   const handleRemoveProduct = (id) => {
    Swal.fire({
        title: "ยืนยันการลบสินค้า",
        text: "คุณต้องการลบสินค้านี้ออกจากตะกร้าหรือไม่?",
        icon: "question",
        iconColor: "#f43f5e",
        background: "#1e293b",
        color: "#f8fafc",
        showCancelButton: true,
        confirmButtonColor: "#f43f5e",
        cancelButtonColor: "#64748b",
        confirmButtonText: "<i class='fas fa-trash mr-2'></i>ลบสินค้า",
        cancelButtonText: "<i class='fas fa-times mr-2'></i>ยกเลิก",
        buttonsStyling: false,
        customClass: {
            confirmButton: "px-4 py-2 rounded-lg bg-rose-500 hover:bg-rose-600 transition-colors duration-200 flex items-center",
            cancelButton: "px-4 py-2 rounded-lg bg-slate-500 hover:bg-slate-600 transition-colors duration-200 flex items-center"
        },
        backdrop: `
            rgba(0,0,0,0.8)
            url("/images/trash-animation.gif")
            center top
            no-repeat
        `,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            actionRemoveProduct(id);
            Swal.fire({
                title: "ลบสินค้าเรียบร้อย!",
                text: "สินค้าถูกลบออกจากตะกร้าแล้ว",
                icon: "success",
                iconColor: "#10b981",
                background: "#1e293b",
                color: "#f8fafc",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                toast: true,
                position: 'top-end',
                showClass: {
                    popup: 'animate__animated animate__fadeInRight'
                }
            });
        }
    });
};

    if (carts.length === 0) return null;

    return (
        <div data-aos="fade-up" className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <FontAwesomeIcon icon={faShoppingBag} className="text-2xl text-purple-400" />
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                    ตะกร้าสินค้าของคุณ
                </h1>
            </div>

            {/* Cart Items */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl p-6 shadow-xl border border-gray-700/50">
                {carts.map((item, index) => (
                    <div
                        key={index}
                        className="bg-gray-900/30 p-5 rounded-xl mb-4 relative transition-all duration-300 hover:bg-gray-800/40 border border-gray-700/30 hover:border-purple-400/30 group"
                        onMouseEnter={() => setHoveredItemId(item.id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                    >
                        {/* Product Row */}
                        <div className="flex justify-between items-start gap-4">
                            {/* Product Image and Info */}
                            <div className="flex gap-4 items-start flex-1">
                                <div className="relative">
                                    {item.images && item.images.length > 0 ? (
                                        <img 
                                            src={item.images[0].url} 
                                            alt={item.title}
                                            className="w-20 h-20 rounded-lg object-cover border border-gray-700/50"
                                        />
                                    ) : (
                                        <div className="w-20 h-20 bg-gray-800/50 rounded-lg flex justify-center items-center text-gray-500 border border-gray-700/50">
                                            No Image
                                        </div>
                                    )}
                                </div>
                                
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg text-white line-clamp-1">{item.title}</h3>
                                    <p className="text-sm text-gray-400 line-clamp-2 mt-1">{item.description || "ไม่มีคำอธิบายสินค้า"}</p>
                                    
                                    {/* Quantity Controls */}
                                    <div className="flex items-center gap-3 mt-3">
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
                            </div>

                            {/* Price and Delete */}
                            <div className="flex flex-col items-end gap-4">
                                <span className="font-bold text-lg text-purple-400">
                                    ฿{(item.price * item.count).toLocaleString()}
                                </span>
                                
                                <button
                                    onClick={() => handleRemoveProduct(item.id)}
                                    className={`p-2 rounded-full transition-all ${hoveredItemId === item.id ? 
                                        'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30' : 
                                        'text-gray-500 hover:text-rose-400'}`}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Summary and Checkout */}
                <div className="mt-8 pt-6 border-t border-gray-700/50">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-lg font-medium text-gray-300">ยอดรวมทั้งหมด</span>
                        <span className="text-2xl font-bold text-emerald-400">
                            ฿{getTotalPrice().toLocaleString()}
                        </span>
                    </div>
                    
                    <Link to="/cart">
                        <button className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/20 flex items-center justify-center gap-2">
                            ดำเนินการชำระเงิน
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartCard;