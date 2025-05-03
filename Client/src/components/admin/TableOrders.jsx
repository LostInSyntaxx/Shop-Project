import React, { useEffect, useState } from "react";
import { getOrdersAdmin, changeStatus } from "../../Api/api-admin.jsx";
import useShopStore from "../../store/shop-store.jsx";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheckCircle, 
  faTimesCircle, 
  faClock, 
  faSpinner, 
  faQuestionCircle, 
  faBoxOpen, 
  faUser, 
  faShoppingCart, 
  faReceipt, 
  faCalendarAlt,
  faSearch,
  faFilter,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";

const TableOrders = () => {
    const token = useShopStore((state) => state.token);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("all");

    useEffect(() => {
        handleGetOrder(token);
    }, []);

    const handleGetOrder = (token) => {
        setIsLoading(true);
        getOrdersAdmin(token)
            .then((res) => {
                setOrders(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setIsLoading(false);
            });
    };

    const hanOrderStatus = (token, orderId, orderStatus) => {
        Swal.fire({
            title: "ยืนยันการเปลี่ยนสถานะ?",
            html: `คุณต้องการเปลี่ยนสถานะเป็น <strong>"${orderStatus}"</strong> ใช่หรือไม่?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3b82f6",
            cancelButtonColor: "#64748b",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
            customClass: {
                popup: "dark:bg-gray-800",
                title: "dark:text-white",
                htmlContainer: "dark:text-gray-300"
            },
        }).then((result) => {
            if (result.isConfirmed) {
                changeStatus(token, orderId, orderStatus)
                    .then((res) => {
                        Swal.fire({
                            title: "เปลี่ยนสถานะสำเร็จ!",
                            icon: "success",
                            timer: 1500,
                            showConfirmButton: false,
                            customClass: {
                                popup: "dark:bg-gray-800",
                                title: "dark:text-white"
                            }
                        });
                        handleGetOrder(token);
                    })
                    .catch((err) => {
                        console.log(err);
                        Swal.fire({
                            title: "เกิดข้อผิดพลาด!",
                            text: "กรุณาลองอีกครั้ง",
                            icon: "error",
                            customClass: {
                                popup: "dark:bg-gray-800",
                                title: "dark:text-white"
                            }
                        });
                    });
            }
        });
    };

    const getStatusStyle = (status) => {
        const styles = {
            "Not Process": { 
                bgColor: "bg-gray-100 dark:bg-gray-700",
                textColor: "text-gray-800 dark:text-gray-200",
                icon: faClock,
                iconColor: "text-gray-500 dark:text-gray-400"
            },
            "Processing": { 
                bgColor: "bg-blue-100 dark:bg-blue-900/30",
                textColor: "text-blue-800 dark:text-blue-200",
                icon: faSpinner,
                iconColor: "text-blue-500 dark:text-blue-400",
                spin: "animate-spin"
            },
            "Completed": { 
                bgColor: "bg-green-100 dark:bg-green-900/30",
                textColor: "text-green-800 dark:text-green-200",
                icon: faCheckCircle,
                iconColor: "text-green-500 dark:text-green-400"
            },
            "Cancelled": { 
                bgColor: "bg-red-100 dark:bg-red-900/30",
                textColor: "text-red-800 dark:text-red-200",
                icon: faTimesCircle,
                iconColor: "text-red-500 dark:text-red-400"
            }
        };
        
        return styles[status] || { 
            bgColor: "bg-gray-100 dark:bg-gray-700",
            textColor: "text-gray-800 dark:text-gray-200",
            icon: faQuestionCircle,
            iconColor: "text-gray-500 dark:text-gray-400"
        };
    };

    const filteredOrders = orders.filter(order => {
        const matchesSearch = order.orderedBy.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "all" || order.orderStatus === selectedStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {/* Header Section */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 to-indigo-600">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm mr-4">
                                <FontAwesomeIcon icon={faBoxOpen} className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Order Management</h2>
                                <p className="text-blue-100 text-sm">Manage and track customer orders</p>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <div className="relative flex-1 min-w-[200px]">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search orders..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                                />
                            </div>
                            
                            <div className="relative min-w-[150px]">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <FontAwesomeIcon icon={faFilter} className="text-gray-400" />
                                </div>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="block appearance-none w-full pl-10 pr-8 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer shadow-sm"
                                >
                                    <option value="all">All Statuses</option>
                                    <option value="Not Process">Not Process</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Completed">Completed</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                    <FontAwesomeIcon icon={faChevronDown} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Orders Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Order ID
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                                    Customer
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                                    Products
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    <FontAwesomeIcon icon={faReceipt} className="mr-2" />
                                    Total
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                                    Date
                                </th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                                            <p className="text-gray-500 dark:text-gray-400">Loading orders...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center">
                                            <FontAwesomeIcon icon={faBoxOpen} className="text-gray-400 text-4xl mb-4" />
                                            <p className="text-gray-500 dark:text-gray-400 text-lg">No orders found</p>
                                            {(searchTerm || selectedStatus !== "all") && (
                                                <button 
                                                    onClick={() => {
                                                        setSearchTerm("");
                                                        setSelectedStatus("all");
                                                    }}
                                                    className="mt-4 px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors shadow-sm"
                                                >
                                                    Clear filters
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((item) => {
                                    const statusInfo = getStatusStyle(item.orderStatus);
                                    return (
                                        <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                #{item.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                                        <FontAwesomeIcon icon={faUser} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.orderedBy.email}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-xs">{item.orderedBy.address}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {item.products?.map((product, idx) => (
                                                        <span 
                                                            key={idx} 
                                                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                                                        >
                                                            {product.product.title} ({product.count})
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600 dark:text-green-400">
                                                {item.cartTotal.toLocaleString("th-TH")}฿
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`${statusInfo.bgColor} ${statusInfo.textColor} px-3 py-1 rounded-full text-xs font-medium flex items-center w-fit`}>
                                                    <FontAwesomeIcon 
                                                        icon={statusInfo.icon} 
                                                        className={`mr-2 ${statusInfo.iconColor} ${statusInfo.spin || ''}`} 
                                                    />
                                                    {item.orderStatus}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(item.createdAt).toLocaleString("th-TH", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                })}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <select
                                                    value={item.orderStatus}
                                                    onChange={(e) => hanOrderStatus(token, item.id, e.target.value)}
                                                    className="block w-full pl-3 pr-10 py-2 text-sm border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 shadow-sm"
                                                >
                                                    <option value="Not Process">Not Process</option>
                                                    <option value="Processing">Processing</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TableOrders;