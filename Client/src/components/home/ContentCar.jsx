import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCircle } from "@fortawesome/free-solid-svg-icons";

const ContentCar = () => {
    const [data, setData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        hdlGetImage();
        const interval = setInterval(nextSlide, 3000); // ✅ Autoplay ทุก 3 วินาที
        return () => clearInterval(interval);
    }, [currentIndex]); // ✅ อัพเดททุกครั้งที่ Index เปลี่ยน

    const hdlGetImage = async () => {
        try {
            const res = await axios.get("https://picsum.photos/v2/list?page=1&limit=10");
            setData(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    // ✅ ฟังก์ชันเปลี่ยนภาพถัดไป
    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === data.length - 1 ? 0 : prev + 1));
    };

    // ✅ ฟังก์ชันเปลี่ยนภาพก่อนหน้า
    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? data.length - 1 : prev - 1));
    };

    return (
        <div className="max-w-screen-lg mx-auto relative">
            {/* 🔥 Carousel Container */}
            <div className="relative overflow-hidden rounded-xl shadow-lg">
                <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }} // ✅ เลื่อน Slide
                >
                    {data.map((item, index) => (
                        <img key={index} src={item.download_url} className="w-full h-96 object-cover flex-shrink-0" />
                    ))}
                </div>

                {/* ◀️ ปุ่ม Previous */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 p-3 rounded-full transition-all"
                >
                    <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                </button>

                {/* ▶️ ปุ่ม Next */}
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 p-3 rounded-full transition-all"
                >
                    <FontAwesomeIcon icon={faChevronRight} size="lg" />
                </button>
            </div>

            {/* 🔹 Thumbnail Slider (กดเปลี่ยนภาพได้) */}
            <div className="flex gap-2 mt-4 justify-center">
                {data.map((item, index) => (
                    <img
                        key={index}
                        src={item.download_url}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-16 h-16 rounded-md cursor-pointer object-cover border-2 transition-all ${
                            index === currentIndex ? "border-blue-500 scale-110" : "border-gray-300"
                        }`}
                    />
                ))}
            </div>

            {/* 🔘 Indicators (Dots) */}
            <div className="flex justify-center gap-2 mt-4">
                {data.map((_, index) => (
                    <FontAwesomeIcon
                        key={index}
                        icon={faCircle}
                        className={`cursor-pointer transition-all ${index === currentIndex ? "text-blue-500" : "text-gray-400"}`}
                        size={index === currentIndex ? "sm" : "xs"}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
        </div>
    );
};

export default ContentCar;
