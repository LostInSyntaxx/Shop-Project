import React from "react";
import ContentCar from "../components/home/ContentCar.jsx";
import BestSeller from "../components/home/BestSeller.jsx";
import NewProduct from "../components/home/NewProduct.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faShoppingCart, faStar } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
    return (
        <div className="container mx-auto px-4">
            {/* 🔥 Banner / Carousel */}
            <ContentCar />

            {/* 🔥 Best Seller Section */}
            <div className="text-center my-8">
                <h2 className="text-3xl font-bold flex items-center justify-center gap-2 text-red-500">
                    <FontAwesomeIcon icon={faFire} />
                    สินค้าขายดี
                </h2>
                <p className="text-gray-500 text-sm">สินค้ายอดนิยมที่ลูกค้าซื้อซ้ำมากที่สุด!</p>
                <hr className="my-4 border-red-400 w-1/3 mx-auto" />
            </div>
            <BestSeller />

            {/* 🆕 New Arrivals Section */}
            <div className="text-center my-8">
                <h2 className="text-3xl font-bold flex items-center justify-center gap-2 text-blue-500">
                    <FontAwesomeIcon icon={faStar} />
                    สินค้าใหม่ล่าสุด
                </h2>
                <p className="text-gray-500 text-sm">อัปเดตสินค้าล่าสุดก่อนใคร!</p>
                <hr className="my-4 border-blue-400 w-1/3 mx-auto" />
            </div>
            <NewProduct />

            {/* 🛒 CTA Button */}
            <div className="text-center mt-10">
                <a href="/shop" className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-green-600 transition">
                    <FontAwesomeIcon icon={faShoppingCart} className="mr-2" />
                    ช้อปเลย
                </a>
            </div>
        </div>
    );
};

export default Home;
