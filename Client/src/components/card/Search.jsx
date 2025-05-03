import React, { useEffect, useState } from "react";
import useShopStore from "../../store/shop-store.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUndo, faBell, faFilter } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const Search = () => {
    const getProduct = useShopStore((state) => state.getProduct);
    const actionSearchFilters = useShopStore((state) => state.actionSearchFilters);
    const getCategory = useShopStore((state) => state.getCategory);
    const categories = useShopStore((state) => state.categories);

    const [text, setText] = useState("");
    const [categorySelected, setCategorySelected] = useState([]);
    const [price, setPrice] = useState([1000, 30000]);
    const [ok, setOk] = useState(false);
    const [isAlertEnabled, setIsAlertEnabled] = useState(true);

    useEffect(() => {
        getCategory();
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (text) {
                actionSearchFilters({ query: text });
                if (isAlertEnabled) {
                    showAlert("info", `กำลังค้นหา: "${text}"`);
                }
            } else {
                getProduct();
            }
        }, 300);

        return () => clearTimeout(delay);
    }, [text]);

    const handleCheck = (e) => {
        const inCheck = e.target.value;
        const inState = [...categorySelected];
        const findCheck = inState.indexOf(inCheck);

        if (findCheck === -1) {
            inState.push(inCheck);
        } else {
            inState.splice(findCheck, 1);
        }
        setCategorySelected(inState);

        if (inState.length > 0) {
            actionSearchFilters({ category: inState });
        } else {
            getProduct();
        }

        if (isAlertEnabled) {
            showAlert("success", inState.length > 0 ? `เลือกหมวดหมู่ใหม่แล้ว` : "โหลดสินค้าทั้งหมด");
        }
    };

    useEffect(() => {
        actionSearchFilters({ price });
        if (isAlertEnabled) {
            showAlert("info", `ช่วงราคา: ฿${price[0].toLocaleString()} - ฿${price[1].toLocaleString()}`);
        }
    }, [ok]);

    const showAlert = (icon, text) => {
        Swal.fire({
            icon,
            text,
            timer: 1500,
            showConfirmButton: false,
            background: "#1a1a1a",
            color: "#fff",
            iconColor: icon === "info" ? "#3b82f6" : 
                      icon === "success" ? "#10b981" : "#f59e0b",
            backdrop: "rgba(0,0,0,0.5)"
        });
    };

    const handleMinPrice = (e) => {
        const newMin = Number(e.target.value);
        if (newMin < price[1]) {
            setPrice([newMin, price[1]]);
            setOk(!ok);
        }
    };

    const handleMaxPrice = (e) => {
        const newMax = Number(e.target.value);
        if (newMax > price[0]) {
            setPrice([price[0], newMax]);
            setOk(!ok);
        }
    };

    const handleReset = () => {
        setText("");
        setCategorySelected([]);
        setPrice([1000, 30000]);
        getProduct();

        if (isAlertEnabled) {
            showAlert("warning", "รีเซ็ตตัวกรองเรียบร้อย");
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-900/50 to-gray-800/30 p-6 rounded-2xl border border-gray-700/50 shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                        <FontAwesomeIcon icon={faFilter} size="lg" />
                    </div>
                    <h2 className="text-xl font-bold text-white">ตัวกรองการค้นหา</h2>
                </div>
                
                {/* Notification Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <div className={`w-10 h-5 rounded-full flex items-center transition-all duration-200 ${isAlertEnabled ? 'bg-emerald-500/90' : 'bg-gray-600'}`}>
                        <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-200 ${isAlertEnabled ? 'translate-x-6' : 'translate-x-1'}`}></div>
                    </div>
                    <FontAwesomeIcon 
                        icon={faBell} 
                        className={`text-sm ${isAlertEnabled ? 'text-emerald-400' : 'text-gray-400'}`}
                    />
                </label>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    type="text"
                    placeholder="ค้นหาสินค้า..."
                    className="input input-bordered w-full bg-gray-800/50 text-white placeholder-gray-400 border-gray-700 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 pl-10"
                />
                <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-3 top-3 text-gray-400" 
                />
            </div>

            {/* Categories Section */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">หมวดหมู่สินค้า</h3>
                <div className="grid grid-cols-2 gap-3">
                    {categories.map((item) => (
                        <label 
                            key={item.id} 
                            className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${categorySelected.includes(String(item.id)) ? 
                                'bg-purple-500/20 border border-purple-500/50' : 
                                'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700'}`}
                        >
                            <input
                                type="checkbox"
                                value={item.id}
                                checked={categorySelected.includes(String(item.id))}
                                onChange={handleCheck}
                                className="checkbox checkbox-primary checkbox-sm"
                            />
                            <span className="text-white">{item.name}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Section */}
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-white mb-3">ช่วงราคา</h3>
                <div className="flex justify-between text-md font-bold text-purple-400 mb-4">
                    <span>฿{price[0].toLocaleString()}</span>
                    <span>฿{price[1].toLocaleString()}</span>
                </div>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm w-12">Min:</span>
                        <input 
                            type="range" 
                            min="100" 
                            max="30000" 
                            value={price[0]} 
                            onChange={handleMinPrice} 
                            className="range range-primary range-sm flex-1" 
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-400 text-sm w-12">Max:</span>
                        <input 
                            type="range" 
                            min="100" 
                            max="30000" 
                            value={price[1]} 
                            onChange={handleMaxPrice} 
                            className="range range-primary range-sm flex-1" 
                        />
                    </div>
                </div>
            </div>

            {/* Reset Button */}
            <button 
                onClick={handleReset} 
                className="btn btn-outline w-full border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white hover:bg-gray-700/50"
            >
                <FontAwesomeIcon icon={faUndo} className="mr-2" />
                รีเซ็ตการค้นหา
            </button>
        </div>
    );
};

export default Search;