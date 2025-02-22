import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import useShopStore from "../../store/shop-store.jsx";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2


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
            title: "คุณแน่ใจหรือไม่?",
            text: "สินค้านี้จะถูกลบออกจากตะกร้า!",
            icon: "warning",
            background: "#1e1e1e",
            color: "#fff",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "ใช่, ลบเลย!",
            cancelButtonText: "ยกเลิก"
        }).then((result) => {
            if (result.isConfirmed) {
                actionRemoveProduct(id);
                Swal.fire({
                    icon: "success",
                    title: "ลบสินค้าเรียบร้อย!",
                    background: "#1e1e1e",
                    color: "#fff",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
        });
    };
    if (carts.length === 0) return null;
    return (
        <div data-aos="fade-up">
            <h1 className="text-xl font-bold mb-4">ตะกร้าสินค้า</h1>
            <div className="bg-black/20 rounded-xl p-4">
                {carts.map((item, index) => (
                    <div
                        key={index}
                        className="bg-black/25 p-4 rounded-xl mb-4 relative transition-all duration-300"
                        onMouseEnter={() => setHoveredItemId(item.id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                    >
                        {/* Row 1 */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex gap-4 items-center">
                                {item.images && item.images.length > 0 ? (
                                    <img src={item.images[0].url} className="w-16 h-16 rounded-md" />
                                ) : (
                                    <div className="w-16 h-16 bg-gray-200/20 rounded-md flex justify-center items-center text-sm">
                                        No Image
                                    </div>
                                )}
                                <div>
                                    <p className="font-bold text-lg">{item.title}</p>
                                    <p className="text-sm text-gray-400">{item.description}</p>
                                </div>
                            </div>
                            {/* Trash Icon - Show on Hover */}
                            {hoveredItemId === item.id && (
                                <button
                                    onClick={() => handleRemoveProduct(item.id)} // ✅ ใช้ฟังก์ชันใหม่
                                    className="absolute top-3 right-3 text-white p-2"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                                </button>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <button onClick={() => actionUpdateQuantity(item.id, item.count - 1)} className="btn btn-sm">
                                    -
                                </button>
                                <span className="px-4">{item.count}</span>
                                <button onClick={() => actionUpdateQuantity(item.id, item.count + 1)} className="btn btn-sm">
                                    +
                                </button>
                            </div>
                            <div className="font-bold text-blue-500">฿{item.price.toLocaleString()}</div>
                        </div>
                    </div>
                ))}

                <div className="mt-6">
                    <div className="flex justify-between px-2">
                        <span className="text-md font-medium">รวม</span>
                        <span className="text-lg font-semibold text-green-500">฿{getTotalPrice().toLocaleString()}</span>
                    </div>
                    <Link to="/cart">
                        <button className="bg-white/40 text-white py-2 w-full px-5 rounded-xl mt-6">
                            ดำเนินรายการ
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CartCard;
