import React, { useEffect, useState } from 'react';
import { getOrders } from "../../Api/api-user.jsx";
import useShopStore from "../../store/shop-store.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faCalendar, faCheckCircle, faTimesCircle, faTag } from '@fortawesome/free-solid-svg-icons';

const HistoryTime = () => {
    const token = useShopStore((state) => state.token);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        hdlGetOrders(token);
    }, []);

    const hdlGetOrders = (token) => {
        getOrders(token)
            .then((res) => {
                setOrders(res.data.orders);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <div className="space-y-6 px-6">
            {/* หัวข้อหลัก */}
            <h1 className="text-2xl font-bold flex items-center gap-2">
                <FontAwesomeIcon icon={faShoppingCart} size="lg" /> ประวัติการสั่งซื้อ
            </h1>

            {/* แสดงรายการออเดอร์ */}
            <div className="space-y-6">
                {orders?.map((item, index) => (
                    <div key={index} className="bg-black/40 p-6 rounded-2xl shadow-lg mb-6">
                        {/* หัวข้อคำสั่งซื้อ */}
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center gap-2 text-gray-300">
                                <FontAwesomeIcon icon={faCalendar} />
                                <p className="text-sm">Order Date:</p>
                                <p className="font-black">{new Date(item.createdAt).toLocaleString()}</p>
                            </div>
                            {/* สถานะคำสั่งซื้อ */}
                            <div className={`flex items-center gap-2 font-bold text-sm ${item.orderStatus === 'Completed' ? 'text-green-400' : 'text-red-400'}`}>
                                <FontAwesomeIcon icon={item.orderStatus === 'Completed' ? faCheckCircle : faTimesCircle} />
                                {item.orderStatus === 'Completed' ? "สำเร็จ" : "ยังไม่เสร็จ"}
                            </div>
                        </div>
                        <div className="p-4 bg-black/50 rounded-lg overflow-auto">
                            <table className="w-full text-left text-gray-300 border-collapse">
                                <thead className="bg-black/30 text-white uppercase text-md">
                                <tr>
                                    <th className="py-2 px-4">#</th>
                                    <th>PRODUCT</th>
                                    <th>QTY</th>
                                    <th className="text-right">TOTAL</th>
                                </tr>
                                </thead>
                                <tbody>
                                {item.products?.map((product, i) => (
                                    <tr key={i} className="border-b border-gray-600 last:border-none">
                                        <td className="py-2 px-4">{i + 1}</td>
                                        <td>{product.product.title}</td>
                                        <td>{product.count}</td>
                                        <td className="text-right">{product.count * product.product.price}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        {/* ราคารวมทั้งหมด */}
                        <div className="text-right mt-4 text-lg font-bold flex items-center justify-end gap-2 text-green-400">
                            <FontAwesomeIcon icon={faTag} />
                            <p>ราคาสุทธิ:</p>
                            <p>{item.cartTotal}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HistoryTime;
