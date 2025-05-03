import React, { useEffect, useState } from 'react';
import useShopStore from "../../store/shop-store.jsx";
import { readProduct, updateProduct } from "../../Api/Main-api-pro.jsx";
import Swal from "sweetalert2";
import Uploadfile from "./Uploadfile.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faSpinner, faBoxOpen, faTag, faAlignLeft, faDollarSign, faLayerGroup, faList } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from 'react-router-dom';

const initialState = { title: "", description: "", price: 0, quantity: 0, categoryId: "", images: [] };

const FormEditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = useShopStore((state) => state.token);
    const getCategory = useShopStore((state) => state.getCategory);
    const categories = useShopStore((state) => state.categories);
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);

    useEffect(() => { 
        getCategory(); 
        fetchProduct(token, id); 
    }, [token, id, getCategory]);

    const fetchProduct = async (token, id) => {
        try { 
            const res = await readProduct(token, id); 
            setForm(res.data); 
        }
        catch (err) { 
            console.error(err); 
            Swal.fire({
                icon: "error",
                title: "Error Loading Product",
                text: "Could not load product data",
                background: '#1a1a2e',
                color: 'white'
            });
        }
    };

    const handleOnChange = (e) => { 
        const { name, value } = e.target; 
        setForm({ ...form, [name]: value }); 
    };

    const validateForm = () => {
        if (!form.title || !form.description || !form.price || !form.quantity || !form.categoryId) {
            Swal.fire({ 
                icon: "error", 
                title: "Incomplete Information", 
                text: "Please fill in all required fields",
                background: '#1a1a2e',
                color: 'white'
            }); 
            return false;
        }
        if (form.price <= 0 || form.quantity < 0) {
            Swal.fire({ 
                icon: "error", 
                title: "Invalid Values", 
                text: "Price and quantity must be positive numbers",
                background: '#1a1a2e',
                color: 'white'
            });
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        
        Swal.fire({ 
            title: "Saving Product...", 
            allowOutsideClick: false, 
            didOpen: () => Swal.showLoading(),
            background: '#1a1a2e',
            color: 'white'
        });
        
        try {
            const res = await updateProduct(token, id, form);
            Swal.fire({ 
                icon: "success", 
                title: "Success!", 
                text: `Product "${res.data.title}" has been saved`,
                background: '#1a1a2e',
                color: 'white',
                confirmButtonColor: '#4f46e5'
            }).then(() => {
                navigate("/admin/product");
            });
        } catch (err) {
            Swal.fire({ 
                icon: "error", 
                title: "Error", 
                text: err.response?.data?.message || "Could not save product",
                background: '#1a1a2e',
                color: 'white',
                confirmButtonColor: '#4f46e5'
            });
        } finally { 
            setLoading(false); 
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-xl p-6 mb-8 shadow-lg border border-indigo-800">
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-indigo-700/30 rounded-lg backdrop-blur-sm">
                        <FontAwesomeIcon icon={faBoxOpen} className="text-white text-2xl" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Edit Product</h1>
                        <p className="text-indigo-200">Update product details and save changes</p>
                    </div>
                </div>
            </div>

            {/* Form Section */}
            <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800 p-6">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Information Section */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-800 pb-4">
                            <h2 className="text-lg font-semibold text-white flex items-center">
                                <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-sm mr-3">1</span>
                                Basic Information
                            </h2>
                        </div>

                        {/* Title Field */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300 flex items-center">
                                <FontAwesomeIcon icon={faTag} className="mr-2 text-indigo-400" />
                                Product Title
                            </label>
                            <input
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 transition-all duration-200"
                                value={form.title}
                                onChange={handleOnChange}
                                placeholder="Enter product title"
                                name="title"
                                type="text"
                                required
                            />
                        </div>

                        {/* Description Field */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300 flex items-center">
                                <FontAwesomeIcon icon={faAlignLeft} className="mr-2 text-indigo-400" />
                                Description
                            </label>
                            <textarea
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 min-h-[120px] transition-all duration-200"
                                value={form.description}
                                onChange={handleOnChange}
                                placeholder="Enter product description"
                                name="description"
                                required
                            />
                        </div>
                    </div>

                    {/* Pricing & Inventory Section */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-800 pb-4">
                            <h2 className="text-lg font-semibold text-white flex items-center">
                                <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-sm mr-3">2</span>
                                Pricing & Inventory
                            </h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price Field */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-300 flex items-center">
                                    <FontAwesomeIcon icon={faDollarSign} className="mr-2 text-indigo-400" />
                                    Price
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full pl-4 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 transition-all duration-200"
                                        value={form.price}
                                        onChange={handleOnChange}
                                        placeholder="0.00"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                    <span className="absolute right-3 top-3 text-gray-400">฿</span>
                                </div>
                            </div>

                            {/* Quantity Field */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-300 flex items-center">
                                    <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-indigo-400" />
                                    Quantity
                                </label>
                                <input
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-gray-500 transition-all duration-200"
                                    value={form.quantity}
                                    onChange={handleOnChange}
                                    placeholder="0"
                                    name="quantity"
                                    type="number"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Category & Images Section */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-800 pb-4">
                            <h2 className="text-lg font-semibold text-white flex items-center">
                                <span className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-sm mr-3">3</span>
                                Category & Images
                            </h2>
                        </div>

                        {/* Category Field */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300 flex items-center">
                                <FontAwesomeIcon icon={faList} className="mr-2 text-indigo-400" />
                                Category
                            </label>
                            <select
                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all duration-200"
                                name="categoryId"
                                onChange={handleOnChange}
                                value={form.categoryId}
                                required
                            >
                                <option value="" disabled className="text-gray-500">Select a category</option>
                                {categories.map((item) => (
                                    <option key={item.id} value={item.id} className="bg-gray-800">
                                        {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-gray-300">
                                Product Images
                            </label>
                            <Uploadfile form={form} setForm={setForm} />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button
                            type="submit"
                            className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 flex items-center justify-center space-x-3 ${
                                loading 
                                    ? "bg-indigo-700 cursor-not-allowed" 
                                    : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 hover:shadow-lg"
                            } text-white shadow-md`}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                    <span>Saving Changes...</span>
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faSave} />
                                    <span>Save Product</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormEditProduct;