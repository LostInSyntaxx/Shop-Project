import React, { useEffect, useState, useRef } from "react";
import { listProductBy } from "../../Api/Main-api-pro.jsx";
import ProductCard from "../card/ProductCard.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faChevronLeft, 
    faChevronRight, 
    faFire,
    faTrophy
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

const BestSeller = () => {
    const [data, setData] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);
    const sliderRef = useRef(null);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = () => {
        listProductBy("sold", "desc", 10)
            .then((res) => setData(res.data))
            .catch((err) => console.log(err));
    };

    const handleScroll = (direction) => {
        if (sliderRef.current) {
            const scrollAmount = 400;
            sliderRef.current.scrollBy({
                left: direction === "next" ? scrollAmount : -scrollAmount,
                behavior: "smooth",
            });
        }
    };

    // Touch and mouse drag support
    const startDrag = (e) => {
        setIsDragging(true);
        setStartX(e.pageX || e.touches[0].pageX);
        setScrollLeft(sliderRef.current.scrollLeft);
    };

    const duringDrag = (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX || e.touches[0].pageX;
        const walk = (x - startX) * 2;
        sliderRef.current.scrollLeft = scrollLeft - walk;
    };

    const endDrag = () => {
        setIsDragging(false);
    };

    return (
        <div className="relative max-w-screen-xl mx-auto px-4 py-12">
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-red-500/10 text-amber-400">
                        <FontAwesomeIcon icon={faTrophy} size="lg" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                        สินค้าขายดี
                    </h2>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400 hidden sm:block">
                        ยอดนิยมจากลูกค้า
                    </span>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleScroll("prev")}
                            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
                            aria-label="Previous products"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <button
                            onClick={() => handleScroll("next")}
                            className="p-3 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-all"
                            aria-label="Next products"
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Product Slider */}
            <div className="relative">
                <motion.div
                    ref={sliderRef}
                    className="flex gap-6 overflow-x-auto scrollbar-hide pb-6"
                    style={{ scrollSnapType: "x mandatory" }}
                    onMouseDown={startDrag}
                    onMouseLeave={endDrag}
                    onMouseUp={endDrag}
                    onMouseMove={duringDrag}
                    onTouchStart={startDrag}
                    onTouchEnd={endDrag}
                    onTouchMove={duringDrag}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {data.map((item, index) => (
                        <div 
                            key={index} 
                            className="flex-shrink-0 w-72 scroll-snap-align-start relative"
                        >
                            {/* Best Seller Badge */}
                            {index < 3 && (
                                <div className="absolute top-2 left-2 z-10">
                                    <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                                        index === 0 ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-black' :
                                        index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600 text-white' :
                                        'bg-gradient-to-r from-amber-700 to-amber-900 text-white'
                                    }`}>
                                        <FontAwesomeIcon icon={faTrophy} />
                                        <span>{index === 0 ? 'TOP 1' : index === 1 ? 'TOP 2' : 'TOP 3'}</span>
                                    </div>
                                </div>
                            )}
                            <ProductCard item={item} />
                        </div>
                    ))}
                </motion.div>

                {/* Gradient Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none"></div>
            </div>
        </div>
    );
};

export default BestSeller;