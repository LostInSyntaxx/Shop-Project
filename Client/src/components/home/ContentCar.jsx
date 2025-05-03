import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faCircle } from "@fortawesome/free-solid-svg-icons";

const ContentCar = () => {

    const [data, setData] = useState([
        { id: 1, imageUrl: 'https://via.placeholder.com/800x500', title: 'Slide 1', subtitle: 'Subtitle 1' },
        { id: 2, imageUrl: 'https://via.placeholder.com/800x500', title: 'Slide 2', subtitle: 'Subtitle 2' },
        { id: 3, imageUrl: 'https://via.placeholder.com/800x500', title: 'Slide 3', subtitle: 'Subtitle 3' },
    ]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + data.length) % data.length);
    };

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="max-w-screen-xl mx-auto relative group">
            {/* Main Carousel */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl h-[500px]">
                {data.map((item, index) => (
                    <div
                        key={item.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentIndex ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    >
                        <img 
                            src={item.imageUrl} 
                            className="w-full h-full object-cover"
                            alt={`Slide ${index + 1}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                            <div className="text-white max-w-2xl">
                                <h2 className="text-4xl font-bold mb-2">{item.title}</h2>
                                <p className="text-lg">{item.subtitle}</p>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Navigation Arrows */}
                <button
                    onClick={prevSlide}
                    className="absolute top-1/2 left-6 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-4 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                >
                    <FontAwesomeIcon icon={faChevronLeft} size="lg" />
                </button>
                <button
                    onClick={nextSlide}
                    className="absolute top-1/2 right-6 transform -translate-y-1/2 text-white bg-black/30 hover:bg-black/50 p-4 rounded-full transition-all opacity-0 group-hover:opacity-100 backdrop-blur-sm"
                >
                    <FontAwesomeIcon icon={faChevronRight} size="lg" />
                </button>
            </div>

            {/* Thumbnail Navigation */}
            <div className="flex gap-3 mt-6 justify-center">
                {data.map((item, index) => (
                    <div 
                        key={item.id} 
                        onClick={() => goToSlide(index)}
                        className={`relative cursor-pointer transition-all duration-300 ${index === currentIndex ? 'ring-4 ring-blue-500 scale-110' : 'opacity-70 hover:opacity-100'}`}
                    >
                        <img
                            src={item.imageUrl}
                            className="w-20 h-16 rounded-lg object-cover"
                            alt={`Thumbnail ${index + 1}`}
                        />
                        {index === currentIndex && (
                            <div className="absolute inset-0 bg-black/30 rounded-lg"></div>
                        )}
                    </div>
                ))}
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-3 mt-4">
                {data.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentIndex ? 'bg-blue-500 scale-125' : 'bg-gray-300 hover:bg-gray-400'}`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ContentCar;