import React from "react";
import ContentCar from "../components/home/ContentCar.jsx";
import BestSeller from "../components/home/BestSeller.jsx";
import NewProduct from "../components/home/NewProduct.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faShoppingCart, faStar, faArrowRight } from "@fortawesome/free-solid-svg-icons";

const Home = () => {
    return (
        <div className="bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen">
            {/* 🔥 Banner / Carousel */}
            <div className="relative overflow-hidden">
                <ContentCar />
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>

            <div className="container mx-auto px-4 py-12">
                {/* 🔥 Best Seller Section */}
                <section className="mb-16">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-red-500 to-amber-500 rounded-full shadow-lg mb-4">
                            <FontAwesomeIcon icon={faFire} className="text-white mr-2" />
                            <span className="font-bold text-white tracking-wider">สินค้าขายดี</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2">สินค้ายอดนิยม</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            สินค้าที่ได้รับความนิยมสูงสุดจากลูกค้าของเรา
                        </p>
                    </div>
                    <BestSeller />
                </section>

                {/* 🆕 New Arrivals Section */}
                <section className="mb-16">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full shadow-lg mb-4">
                            <FontAwesomeIcon icon={faStar} className="text-white mr-2" />
                            <span className="font-bold text-white tracking-wider">สินค้าใหม่ล่าสุด</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-2">สินค้ามาใหม่</h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            อัปเดตสินค้าล่าสุดก่อนใคร พร้อมส่วนลดพิเศษ!
                        </p>
                    </div>
                    <NewProduct />
                </section>

                {/* 🛒 CTA Section */}
                <section className="text-center mt-20">
                    <div className="bg-gradient-to-r from-gray-800/50 to-gray-900/50 p-8 rounded-2xl border border-gray-700/50 shadow-xl">
                        <h3 className="text-3xl font-bold text-white mb-4">พร้อมเริ่มช้อปปิ้งแล้วหรือยัง?</h3>
                        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
                            ค้นพบสินค้าคุณภาพมากมายในร้านค้าของเรา พร้อมบริการจัดส่งรวดเร็วและปลอดภัย
                        </p>
                        <a 
                            href="/shop" 
                            className="inline-flex items-center justify-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300 hover:shadow-emerald-500/30"
                        >
                            <FontAwesomeIcon icon={faShoppingCart} className="mr-3" />
                            เริ่มช้อปปิ้งตอนนี้
                            <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
                        </a>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Home;