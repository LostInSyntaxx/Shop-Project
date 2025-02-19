import React, { useEffect } from 'react';
import useShopStore from "../../store/shop-store.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faShoppingCart, faEdit, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const ListCart = () => {
    const carts = useShopStore((state) => state.carts);
    const getTotalPrice = useShopStore((state) => state.getTotalPrice);

    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);
    return (
        <div className="bg-black/20 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-2 text-xl font-bold mb-4" data-aos="fade-down">
                <FontAwesomeIcon icon={faShoppingCart} className="text-purple-500" />
                <p>รายการสินค้า ({carts.length})</p>
            </div>
            {carts.length === 0 ? (
                <p className="text-center text-gray-400" data-aos="fade-up">ตะกร้าของคุณว่างเปล่า</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-2">
                        {carts.map((item, index) => (
                            <div key={index} className="bg-black/25 p-4 rounded-xl mb-4 flex justify-between items-center shadow-md hover:shadow-lg transition" data-aos="fade-up">
                                <div className="flex gap-4 items-center">
                                    {item.images && item.images.length > 0 ? (
                                        <img src={item.images[0].url} className="w-16 h-16 rounded-md object-cover" />
                                    ) : (
                                        <div className="w-16 h-16 bg-gray-200/20 rounded-md flex items-center justify-center text-gray-400">
                                            No Image
                                        </div>
                                    )}
                                    <div>
                                        <p className="font-bold text-lg">{item.title}</p>
                                        <p className="text-sm text-gray-400">฿{item.price.toLocaleString()} x {item.count}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-blue-400 text-xl">฿{(item.price * item.count).toLocaleString()}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-black/40 p-6 rounded-xl shadow-lg space-y-6" data-aos="zoom-in">
                        <div className="flex items-center gap-2 text-lg font-bold">
                            <FontAwesomeIcon icon={faMoneyBillWave} className="text-green-400" />
                            <p>ยอดรวม</p>
                        </div>
                        <div className="flex justify-between text-2xl font-bold">
                            <span>รวมสุทธิ</span>
                            <span className="text-green-400">฿{getTotalPrice().toLocaleString()}</span>
                        </div>
                        <button className="btn btn-primary w-full rounded-md text-white py-3 shadow-md hover:scale-105 transition-transform duration-200">สั่งซื้อ
                        </button>
                        <Link to={"/shop"}>
                            <button className="btn btn-outline w-full flex items-center justify-center py-2 hover:bg-white/20 transition-all">
                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                แก้ไขรายการสินค้า
                            </button>
                        </Link>
                        <p className="text-sm text-gray-400 text-center mt-2">🚚 จัดส่งภายใน 2-3 วันทำการ</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListCart;
