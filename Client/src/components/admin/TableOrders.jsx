import React, { useEffect, useState } from "react";
import { getOrdersAdmin, changeStatus } from "../../Api/api-admin.jsx";
import useShopStore from "../../store/shop-store.jsx";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle, faClock, faSpinner, faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

const TableOrders = () => {
    const token = useShopStore((state) => state.token);
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        handleGetOrder(token);
    }, []);

    const handleGetOrder = (token) => {
        getOrdersAdmin(token)
            .then((res) => {
                setOrders(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const hanOrderStatus = (token, orderId, orderStatus) => {
        Swal.fire({
            title: "ยืนยันการเปลี่ยนสถานะ?",
            text: `คุณต้องการเปลี่ยนสถานะเป็น "${orderStatus}" ใช่หรือไม่?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                changeStatus(token, orderId, orderStatus)
                    .then((res) => {
                        Swal.fire("เปลี่ยนสถานะสำเร็จ!", "", "success");
                        handleGetOrder(token);
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire("เกิดข้อผิดพลาด!", "ลองอีกครั้ง", "error");
                    });
            }
        });
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "Not Process":
                return { color: "gray", icon: faClock };
            case "Processing":
                return { color: "blue", icon: faSpinner };
            case "Completed":
                return { color: "green", icon: faCheckCircle };
            case "Cancelled":
                return { color: "red", icon: faTimesCircle };
            default:
                return { color: "gray", icon: faQuestionCircle };
        }
    };

    return (
        <div className="container mx-auto p-4 bg-black/30 shadow-md rounded-2xl">
            <div>
                <div className="overflow-x-auto rounded-2xl border border-base-content/5 bg-black/20">
                    <table className="w-full border table-orders table-md border-gray-700">
                        <thead>
                        <tr className="bg-gray-900 text-white text-center">
                            <th className="p-3 border border-gray-700 w-12">#</th>
                            <th className="p-3 border border-gray-700 w-40">อีเมลผู้ใช้</th>
                            <th className="p-3 border border-gray-700 w-64">สินค้า</th>
                            <th className="p-3 border border-gray-700 w-24">รวม</th>
                            <th className="p-3 border border-gray-700 w-32">สถานะ</th>
                            <th className="p-3 border border-gray-700 w-32">จัดการ</th>
                            <th className="p-3 border border-gray-700 w-40">วันที่</th>
                        </tr>
                        </thead>
                        <tbody>
                        {orders?.map((item, index) => {
                            const statusInfo = getStatusStyle(item.orderStatus);
                            return (
                                <tr key={index} className="border border-gray-700 hover:bg-gray-800 text-center">
                                    <th className="p-3">{item.id}</th>
                                    <td className="p-3 whitespace-nowrap">
                                        <div className="flex flex-col items-center">
                                            <span>{item.orderedBy.email}</span>
                                            <p className="text-sm text-gray-400">{item.orderedBy.address}</p>
                                        </div>
                                    </td>
                                    <td className="p-3 text-left">
                                        <div className="inline-flex flex-wrap gap-2">
                                            {item.products?.map((product, index) => (
                                                <span key={index} className="bg-gray-700 px-2 py-1 rounded text-white text-sm">
                                                        {product.product.title} ({product.count} x {product.product.price.toLocaleString("th-TH")})
                                                    </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-3 font-bold text-green-400">
                                        {item.cartTotal.toLocaleString("th-TH")}
                                    </td>
                                    <td className="p-3">
                                            <span className={`px-3 py-1 rounded-full shadow text-white flex items-center justify-center gap-2 bg-${statusInfo.color}-500`}>
                                                <FontAwesomeIcon icon={statusInfo.icon} /> {item.orderStatus}
                                            </span>
                                    </td>
                                    <td className="p-3">
                                        <select
                                            value={item.orderStatus}
                                            onChange={(e) => hanOrderStatus(token, item.id, e.target.value)}
                                            className="bg-gray-700 text-white p-2 rounded-lg"
                                        >
                                            <option>Not Process</option>
                                            <option>Processing</option>
                                            <option>Completed</option>
                                            <option>Cancelled</option>
                                        </select>
                                    </td>
                                    <td className="p-3">
                                        {new Date(item.createdAt).toLocaleString("th-TH", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableOrders;
