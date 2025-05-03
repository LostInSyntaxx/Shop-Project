import React, { useEffect } from 'react';
import ProductCard from '../components/card/ProductCard.jsx';
import useShopStore from '../store/shop-store.jsx';
import Search from "../components/card/Search.jsx";
import CartCard from "../components/card/CartCard.jsx";

const Shop = () => {
    const getProduct = useShopStore((state) => state.getProduct);
    const products = useShopStore((state) => state.products);

    useEffect(() => {
        getProduct();
    }, []);

    return (
        <div className="flex h-screen">
            <div className="w-1/4 p-4 rounded-2xl">
                <h2 className="text-white/80 text-xl font-semibold mb-4"></h2>
                <Search/>
            </div>

            {/* Product Section */}
            <div className="w-1/2 p-4 h-screen overflow-y-auto">
                 <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                            สินค้าทั้งหมด
                        </h1>
                <hr className="border-gray-700 mb-4" />
                <div className="flex flex-wrap gap-4">
                    {products.map((item, index) => (
                        <ProductCard key={index} item={item} />
                    ))}
                </div>
            </div>

            {/* Cart Section */}
            <div className="w-1/4 p-4 h-screen overflow-y-auto rounded-2xl gap-4">
                <CartCard/>
            </div>
        </div>
    );
};

export default Shop;
