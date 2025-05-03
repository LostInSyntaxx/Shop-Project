import React, { useEffect, useState } from 'react';
import useShopStore from "../../store/shop-store.jsx";
import { createProduct, deleteProduct } from "../../Api/Main-api-pro.jsx";
import Swal from "sweetalert2";
import Uploadfile from "./Uploadfile.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faPlus, faBox, faInfoCircle, faMoneyBillWave, faLayerGroup, faTags, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

const initialState = {
    title: "",
    description: "",
    price: 0,
    quantity: 0,
    categoryId: "",
    images: []
};

const FormProduct = () => {
    const token = useShopStore((state) => state.token);
    const getCategory = useShopStore((state) => state.getCategory);
    const categories = useShopStore((state) => state.categories);
    const getProduct = useShopStore((state) => state.getProduct);
    const products = useShopStore((state) => state.products);

    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        getCategory();
        getProduct(100);
    }, []);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        Swal.fire({
            title: "กำลังเพิ่มสินค้า...",
            html: 'โปรดรอสักครู่',
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const res = await createProduct(token, form);
            Swal.fire({
                icon: "success",
                title: "เพิ่มสินค้าสำเร็จ!",
                text: `สินค้า "${res.data.title}" ถูกเพิ่มเรียบร้อย`,
                confirmButtonColor: '#10B981',
                background: '#1F2937',
                color: 'white'
            });
            setForm(initialState);
            getProduct();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: err.response?.data?.message || "ไม่สามารถเพิ่มสินค้าได้",
                background: '#1F2937',
                color: 'white'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleSelectImage = (imageId) => {
        setSelectedImages((prevSelected) =>
            prevSelected.includes(imageId)
                ? prevSelected.filter((id) => id !== imageId)
                : [...prevSelected, imageId]
        );
    };

    const handleDeleteMultiple = async () => {
        if (selectedImages.length === 0) {
            Swal.fire({
                title: 'แจ้งเตือน',
                text: 'กรุณาเลือกรายการก่อนลบ',
                icon: 'warning',
                background: '#1F2937',
                color: 'white'
            });
            return;
        }

        const result = await Swal.fire({
            title: `คุณต้องการลบ ${selectedImages.length} รายการหรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
            background: '#1F2937',
            color: 'white',
            confirmButtonColor: '#EF4444'
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await Promise.all(selectedImages.map((id) => deleteProduct(token, id)));
                Swal.fire({
                    title: 'สำเร็จ!',
                    text: `ลบ ${selectedImages.length} รายการเรียบร้อย`,
                    icon: 'success',
                    background: '#1F2937',
                    color: 'white'
                });
                getProduct(token);
                setSelectedImages([]);
            } catch (err) {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถลบได้',
                    icon: 'error',
                    background: '#1F2937',
                    color: 'white'
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleDelete = async (id) => {
        const result = await Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "คุณไม่สามารถกู้คืนข้อมูลนี้ได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก',
            background: '#1F2937',
            color: 'white'
        });

        if (result.isConfirmed) {
            try {
                await deleteProduct(token, id);
                getProduct();
                Swal.fire({
                    title: 'ลบเรียบร้อย!',
                    text: 'ข้อมูลของคุณถูกลบแล้ว.',
                    icon: 'success',
                    background: '#1F2937',
                    color: 'white'
                });
            } catch (err) {
                Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: 'ไม่สามารถลบข้อมูลได้.',
                    icon: 'error',
                    background: '#1F2937',
                    color: 'white'
                });
            }
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Form Section */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 mb-10">
                {/* Form Header */}
                <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm mr-4">
                            <FontAwesomeIcon icon={faBox} className="text-white text-xl" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-white">เพิ่มสินค้าใหม่</h1>
                            <p className="text-indigo-100 text-sm">กรอกข้อมูลสินค้าของคุณด้านล่าง</p>
                        </div>
                    </div>
                    <div className="text-indigo-100 text-sm">
                        <span className="font-semibold">ขั้นตอนที่ 1</span> จาก 2
                    </div>
                </div>

                {/* Product Form */}
                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Basic Information Section */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-700 pb-5">
                                <h3 className="text-lg font-medium text-white flex items-center">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white text-sm mr-3">1</span>
                                    ข้อมูลพื้นฐาน
                                </h3>
                                <p className="mt-1 text-sm text-gray-400">กรอกข้อมูลพื้นฐานของสินค้า</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Product Name */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-300 flex items-center">
                                        <FontAwesomeIcon icon={faTags} className="mr-2 text-indigo-400" />
                                        ชื่อสินค้า
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 placeholder-gray-500"
                                            value={form.title}
                                            onChange={handleOnChange}
                                            placeholder="เช่น iPhone 13 Pro Max"
                                            name="title"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
                                            <span className="text-xs">*จำเป็น</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Category */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-300 flex items-center">
                                        <FontAwesomeIcon icon={faLayerGroup} className="mr-2 text-indigo-400" />
                                        หมวดหมู่
                                    </label>
                                    <select
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all duration-200"
                                        value={form.categoryId}
                                        onChange={handleOnChange}
                                        name="categoryId"
                                        required
                                    >
                                        <option value="" disabled className="text-gray-500">เลือกหมวดหมู่...</option>
                                        {categories.map((item, index) => (
                                            <option key={index} value={item.id} className="bg-gray-800">{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-3">
                                <label className="block text-sm font-medium text-gray-300 flex items-center">
                                    <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-indigo-400" />
                                    คำอธิบายสินค้า
                                </label>
                                <textarea
                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[120px] transition-all duration-200 placeholder-gray-500"
                                    value={form.description}
                                    onChange={handleOnChange}
                                    placeholder="อธิบายรายละเอียดสินค้า เช่น คุณสมบัติ, ขนาด, สี..."
                                    name="description"
                                    required
                                />
                            </div>
                        </div>

                        {/* Pricing & Inventory Section */}
                        <div className="space-y-6">
                            <div className="border-b border-gray-700 pb-5">
                                <h3 className="text-lg font-medium text-white flex items-center">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500 text-white text-sm mr-3">2</span>
                                    ราคาและสต็อก
                                </h3>
                                <p className="mt-1 text-sm text-gray-400">กำหนดราคาและจำนวนสินค้าในสต็อก</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {/* Price */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-300 flex items-center">
                                        <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-indigo-400" />
                                        ราคาสินค้า
                                    </label>
                                    <div className="relative">
                                        <input
                                            className="w-full pl-4 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                            type="number"
                                            value={form.price}
                                            onChange={handleOnChange}
                                            placeholder="0.00"
                                            name="price"
                                            min="0"
                                            step="0.01"
                                            required
                                        />
                                        <span className="absolute right-3 top-3 text-gray-400">บาท</span>
                                    </div>
                                </div>

                                {/* Quantity */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-300 flex items-center">
                                        <FontAwesomeIcon icon={faBox} className="mr-2 text-indigo-400" />
                                        ปริมาณสินค้า
                                    </label>
                                    <input
                                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                                        type="number"
                                        value={form.quantity}
                                        onChange={handleOnChange}
                                        placeholder="0"
                                        name="quantity"
                                        min="0"
                                        required
                                    />
                                </div>

                                {/* Image Upload */}
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-gray-300">
                                        รูปภาพสินค้า
                                    </label>
                                    <Uploadfile form={form} setForm={setForm} />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className={`inline-flex items-center px-8 py-3 rounded-lg font-bold transition-all duration-300 ${
                                        isSubmitting 
                                            ? "bg-indigo-700 cursor-not-allowed" 
                                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-lg hover:shadow-indigo-500/30"
                                    } text-white`}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>กำลังเพิ่มสินค้า...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faPlus} className="mr-2" />
                                            <span>เพิ่มสินค้า</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            {/* Product List Section */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
                <div className="px-8 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="p-3 rounded-lg bg-white/10 backdrop-blur-sm mr-4">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xl" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">รายการสินค้า</h2>
                            <p className="text-indigo-100 text-sm">จัดการสินค้าทั้งหมดของคุณ</p>
                        </div>
                    </div>
                    <button 
                        className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                            selectedImages.length === 0 
                                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                                : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white shadow-lg hover:shadow-red-500/30'
                        }`}
                        onClick={handleDeleteMultiple} 
                        disabled={selectedImages.length === 0}
                    >
                        <FontAwesomeIcon icon={faTrash} className="mr-2" />
                        ลบที่เลือก ({selectedImages.length})
                    </button>
                </div>

                <div className="p-6 overflow-x-auto">
                    <div className="rounded-xl overflow-hidden border border-gray-700">
                        <table className="min-w-full divide-y divide-gray-700">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                        <input
                                            type="checkbox"
                                            className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded focus:ring-indigo-500"
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedImages(products.map((item) => item.id));
                                                } else {
                                                    setSelectedImages([]);
                                                }
                                            }}
                                            checked={selectedImages.length === products.length && products.length > 0}
                                        />
                                    </th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">#</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">รูปภาพ</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ชื่อสินค้า</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ราคา</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">จำนวน</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ขายแล้ว</th>
                                    <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">อัปเดตล่าสุด</th>
                                    <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">จัดการ</th>
                                </tr>
                            </thead>
                            <tbody className="bg-gray-800 divide-y divide-gray-700">
                                {products.length > 0 ? (
                                    products.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-750 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <input
                                                    type="checkbox"
                                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded focus:ring-indigo-500"
                                                    checked={selectedImages.includes(item.id)}
                                                    onChange={() => toggleSelectImage(item.id)}
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-300">{item.id}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.images.length > 0 ? (
                                                    <img 
                                                        className="w-12 h-12 rounded-lg object-cover shadow-md border border-gray-700" 
                                                        src={item.images[0].url} 
                                                        alt="product"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-gray-750 rounded-lg flex items-center justify-center text-gray-500 border border-gray-700">
                                                        <FontAwesomeIcon icon={faBox} />
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm font-medium text-white">{item.title}</div>
                                                <div className="text-xs text-gray-400 line-clamp-1">{item.description}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-400">฿{item.price.toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.quantity}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.sold}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                                                {new Date(item.updatedAt).toLocaleDateString('th-TH')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <div className="flex justify-end space-x-2">
                                                    <Link 
                                                        to={'/admin/product/' + item.id}
                                                        className="text-indigo-400 hover:text-indigo-300 transition-colors p-2 rounded-lg hover:bg-indigo-900/30 flex items-center justify-center w-10 h-10"
                                                        title="แก้ไข"
                                                    >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </Link>
                                                    <button 
                                                        onClick={() => handleDelete(item.id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-900/30 flex items-center justify-center w-10 h-10"
                                                        title="ลบ"
                                                    >
                                                        <FontAwesomeIcon icon={faTrash} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="px-6 py-8 text-center text-gray-400">
                                            <div className="flex flex-col items-center justify-center">
                                                <FontAwesomeIcon icon={faBox} className="text-4xl mb-4 text-gray-600" />
                                                <p className="text-lg">ยังไม่มีสินค้า</p>
                                                <p className="text-sm mt-1">เริ่มต้นด้วยการเพิ่มสินค้าชิ้นแรกของคุณ</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormProduct;