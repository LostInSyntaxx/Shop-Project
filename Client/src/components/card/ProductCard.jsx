import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faShoppingCart,
    faTag,
    faBox,
    faCheckCircle,
    faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

const ProductCard = ({ item }) => {
    return (
        <div className="card w-60 bg-black/25 shadow-xl rounded-xl p-4 relative group hover:scale-105 transition-transform">
            {/* ป้ายลดราคา */}
            {item.salePrice && (
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                    <FontAwesomeIcon icon={faTag} />
                    ลดราคา!
                </span>
            )}

            {/* รูปสินค้า */}
            <figure className="relative tooltip tooltip-bottom" data-tip={item.title}>
                {item.images && item.images.length > 0 ? (
                    <img
                        src={item.images[0].url}
                        alt={item.title}
                        className="rounded-xl w-full h-32 object-cover hover:scale-105 transition-transform"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-32 bg-gray-200 rounded-xl text-gray-500">
                        No Image
                    </div>
                )}
                {/* ปุ่มเพิ่มลงตะกร้า */}
                <button className="btn btn-success btn-sm absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity tooltip tooltip-left" data-tip="เพิ่มลงตะกร้า">
                    <FontAwesomeIcon icon={faShoppingCart} />
                </button>
            </figure>

            {/* รายละเอียดสินค้า */}
            <div className="card-body p-2">
                <h2 className="card-title text-lg font-semibold">{item.title}</h2>
                <p className="text-sm text-gray-500">{item.description}</p>

                {/* ราคาสินค้า */}
                <div className="flex justify-between items-center mt-2">
                    {item.salePrice ? (
                        <span className="text-md font-bold text-red-500 flex items-center gap-1">
                            ฿{item.salePrice}
                            <span className="line-through text-gray-400 text-sm">฿{item.price}</span>
                        </span>
                    ) : (
                        <span className="text-md font-bold text-primary">฿{item.price}</span>
                    )}
                </div>

                {/* สถานะสินค้า */}
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faBox} />
                        Qty: {item.quantity}
                    </span>
                    {item.quantity === 0 ? (
                        <span className="text-red-500 text-xs font-semibold flex items-center gap-1">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                            สินค้าหมด
                        </span>
                    ) : item.quantity < 5 ? (
                        <span className="text-yellow-500 text-xs font-semibold flex items-center gap-1">
                            <FontAwesomeIcon icon={faExclamationTriangle} />
                            เหลือ {item.quantity} ชิ้น
                        </span>
                    ) : (
                        <span className="text-green-500 text-xs font-semibold flex items-center gap-1">
                            <FontAwesomeIcon icon={faCheckCircle} />
                            มีสินค้าในสต็อก
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
