import React, { useEffect, useState } from 'react';
import { getOrders } from "../../Api/api-user.jsx";
import useShopStore from "../../store/shop-store.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingCart, faCalendar, faCheckCircle, faTimesCircle,
    faTag, faSpinner, faQuestionCircle, faReceipt,
    faBoxOpen, faCreditCard, faTruck
} from '@fortawesome/free-solid-svg-icons';

const HistoryTime = () => {
    const token = useShopStore((state) => state.token);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        hdlGetOrders(token);
    }, []);

    const hdlGetOrders = (token) => {
        setIsLoading(true);
        setError(null);
        getOrders(token)
            .then((res) => {
                setOrders(res.data?.orders || []);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load orders. Please try again later.");
                setIsLoading(false);
            });
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case "Completed":
                return { 
                    color: "text-emerald-500", 
                    bg: "bg-emerald-500/10",
                    border: "border-emerald-500",
                    icon: faCheckCircle, 
                    label: "Completed",
                    gradient: "from-emerald-500/20 to-emerald-600/10"
                };
            case "Cancelled":
                return { 
                    color: "text-rose-500", 
                    bg: "bg-rose-500/10",
                    border: "border-rose-500",
                    icon: faTimesCircle, 
                    label: "Cancelled",
                    gradient: "from-rose-500/20 to-rose-600/10"
                };
            case "Processing":
                return { 
                    color: "text-blue-500", 
                    bg: "bg-blue-500/10",
                    border: "border-blue-500",
                    icon: faSpinner, 
                    label: "Processing",
                    gradient: "from-blue-500/20 to-blue-600/10",
                    spin: true
                };
            case "Shipped":
                return {
                    color: "text-purple-500",
                    bg: "bg-purple-500/10",
                    border: "border-purple-500",
                    icon: faTruck,
                    label: "Shipped",
                    gradient: "from-purple-500/20 to-purple-600/10"
                };
            default:
                return { 
                    color: "text-amber-500", 
                    bg: "bg-amber-500/10",
                    border: "border-amber-500",
                    icon: faQuestionCircle, 
                    label: "Pending",
                    gradient: "from-amber-500/20 to-amber-600/10"
                };
        }
    };

    const getPaymentIcon = (method) => {
        switch(method?.toLowerCase()) {
            case 'credit card':
                return faCreditCard;
            case 'paypal':
                return faCreditCard;
            default:
                return faTag;
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-t-purple-500 border-r-purple-500 border-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
                </div>
                <p className="text-purple-400 text-lg font-medium">Loading your orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-4">
                <div className="relative">
                    <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faTimesCircle} className="text-rose-500 text-3xl" />
                    </div>
                </div>
                <p className="text-rose-400 text-lg font-medium">{error}</p>
                <button 
                    onClick={() => hdlGetOrders(token)}
                    className="mt-4 px-6 py-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-rose-500/20 transition-all flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                    Retry
                </button>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-96 gap-6 text-center">
                <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full flex items-center justify-center">
                        <FontAwesomeIcon icon={faBoxOpen} className="text-gray-400 text-4xl" />
                    </div>
                </div>
                <div>
                    <h3 className="text-xl font-bold text-white mb-2">No orders found</h3>
                    <p className="text-gray-400 max-w-md">Your order history will appear here once you make purchases</p>
                </div>
                <Link 
                    to="/shop" 
                    className="mt-4 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2"
                >
                    <FontAwesomeIcon icon={faShoppingCart} />
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="px-4 py-8 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-10">
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                        <FontAwesomeIcon icon={faReceipt} className="text-purple-400 text-xl" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-white">Order History</h1>
                        <p className="text-gray-400 mt-1">Your past purchases and order details</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <FontAwesomeIcon icon={faTag} className="text-purple-400" />
                    <span>{orders.length} {orders.length === 1 ? 'order' : 'orders'} found</span>
                </div>
            </div>

            {/* Orders List */}
            <div className="space-y-6">
                {orders.map((item, index) => {
                    const statusInfo = getStatusInfo(item.orderStatus);
                    const orderId = item._id ? `#${item._id.slice(-6).toUpperCase()}` : `#ORDER${index + 1}`;
                    const paymentIcon = getPaymentIcon(item.paymentMethod);
                    
                    return (
                        <div 
                            key={item._id || index} 
                            className={`bg-gradient-to-br ${statusInfo.gradient} p-6 rounded-2xl shadow-lg border ${statusInfo.border}/30 hover:shadow-xl transition-all duration-300 group`}
                        >
                            {/* Order Header */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-700/50">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        <span className="bg-gray-900/50 px-3 py-1 rounded-lg group-hover:text-purple-300 transition-colors">
                                            {orderId}
                                        </span>
                                    </h3>
                                    <div className="flex items-center gap-3 text-gray-400 text-sm mt-2">
                                        <div className="flex items-center gap-1.5">
                                            <FontAwesomeIcon icon={faCalendar} className="text-purple-400/70" />
                                            <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : 'Date not available'}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Status Badge */}
                                <div className={`mt-3 sm:mt-0 px-4 py-1.5 rounded-full text-sm font-medium ${statusInfo.bg} ${statusInfo.color} border ${statusInfo.border} flex items-center gap-2`}>
                                    <FontAwesomeIcon 
                                        icon={statusInfo.icon} 
                                        className={statusInfo.spin ? 'animate-spin' : ''} 
                                    />
                                    {statusInfo.label}
                                </div>
                            </div>

                            {/* Products Table */}
                            <div className="overflow-x-auto rounded-xl border border-gray-700/50 mb-6">
                                <table className="w-full text-left text-gray-300">
                                    <thead className="text-xs uppercase bg-gray-900/50 text-gray-400">
                                        <tr>
                                            <th className="py-3 px-6 rounded-tl-xl">Item</th>
                                            <th className="py-3 px-6">Product</th>
                                            <th className="py-3 px-6 text-center">Quantity</th>
                                            <th className="py-3 px-6 text-right rounded-tr-xl">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700/50">
                                        {item.products?.map((product, i) => (
                                            <tr key={i} className="hover:bg-gray-800/30 transition-colors">
                                                <td className="py-4 px-6 font-medium">{i + 1}</td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                                                            {product?.product?.image ? (
                                                                <img 
                                                                    src={product.product.image} 
                                                                    alt={product.product.title}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            ) : (
                                                                <FontAwesomeIcon icon={faBoxOpen} className="text-gray-500" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-white">{product?.product?.title || 'Unknown Product'}</p>
                                                            <p className="text-sm text-gray-400 mt-1">SKU: {product?.product?.sku || 'N/A'}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <span className="bg-gray-800/50 px-3 py-1 rounded-full">
                                                        {product?.count || 0}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-right font-medium">
                                                    ฿{((product?.count || 0) * (product?.product?.price || 0)).toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Order Footer */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-900/50 px-4 py-2 rounded-lg">
                                        <FontAwesomeIcon icon={paymentIcon} className="text-purple-400" />
                                        <span>Payment: <span className="text-white ml-1">{item.currentcy  || 'N/A'}</span></span>
                                    </div>
                                </div>
                                <div className="text-xl font-bold text-white flex items-center gap-4">
                                    <span className="text-gray-400 text-sm font-normal">Total Amount:</span>
                                    <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                                        ฿{item.cartTotal?.toFixed(2) || '0.00'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HistoryTime;