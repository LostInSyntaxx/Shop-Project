import React, { useEffect, useState } from "react";
import useShopStore from "../../store/shop-store.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUndo } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
    const getProduct = useShopStore((state) => state.getProduct);
    const actionSearchFilters = useShopStore((state) => state.actionSearchFilters);
    const getCategory = useShopStore((state) => state.getCategory);
    const categories = useShopStore((state) => state.categories);

    const [text, setText] = useState("");
    const [categorySelected, setCategorySelected] = useState([]);
    const [price, setPrice] = useState([100, 30000]);
    const [ok, setOk] = useState(false);

    useEffect(() => {
        getCategory();
    }, []);

    useEffect(() => {
        const delay = setTimeout(() => {
            if (text) {
                actionSearchFilters({ query: text });
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
    };

    useEffect(() => {
        actionSearchFilters({ price });
    }, [ok]);

    // ✅ อัปเดต Min
    const handleMinPrice = (e) => {
        const newMin = Number(e.target.value);
        if (newMin < price[1]) {
            setPrice([newMin, price[1]]);
            setOk(!ok);
        }
    };

    // ✅ อัปเดต Max
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
    };

    return (
        <div className="p-5 rounded-lg">
            <h2 className="text-xl text-white/80 font-semibold mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faSearch} /> ค้นหาสินค้า
            </h2>
            <div className="relative mb-4">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    type="text"
                    placeholder="ค้นหาสินค้า..."
                    className="input input-bordered w-full bg-white/10 text-white focus:bg-white/20 transition-colors pl-10"
                />
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-3 text-gray-400" />
            </div>

            <hr className="border-gray-700 mb-4" />

            <div>
                <h1 className="text-lg text-white/80 font-semibold mb-2">หมวดหมู่สินค้า</h1>
                <div className="flex flex-col gap-2">
                    {categories.map((item) => (
                        <label key={item.id} className="flex items-center gap-2 text-white/80">
                            <input
                                type="checkbox"
                                value={item.id}
                                checked={categorySelected.includes(String(item.id))}
                                onChange={handleCheck}
                                className="checkbox checkbox-primary"
                            />
                            {item.name}
                        </label>
                    ))}
                </div>
            </div>

            <hr className="border-gray-700 my-4" />

            <div>
                <h1 className="text-lg text-white/80 font-semibold mb-2">ค้นหาราคา</h1>
                <div className="flex justify-between text-md font-bold text-primary mb-2">
                    <span>Min: {price[0]}</span>
                    <span>Max: {price[1]}</span>
                </div>
                <div className="flex gap-4">
                    {/* ✅ Min Price Slider */}
                    <input
                        type="range"
                        min="100"
                        max="30000"
                        value={price[0]}
                        onChange={handleMinPrice}
                        className="range range-primary"
                    />
                    {/* ✅ Max Price Slider */}
                    <input
                        type="range"
                        min="100"
                        max="30000"
                        value={price[1]}
                        onChange={handleMaxPrice}
                        className="range range-primary"
                    />
                </div>
            </div>

            <hr className="border-gray-700 my-4" />

            <div className="flex justify-center">
                <button onClick={handleReset} className="btn btn-outline btn-warning">
                    <FontAwesomeIcon icon={faUndo} className="mr-2" /> รีเซ็ตการค้นหา
                </button>
            </div>
        </div>
    );
};

export default Search;
