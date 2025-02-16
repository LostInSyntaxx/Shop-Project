import React, { useEffect, useState } from 'react';
import useShopStore from "../../store/shop-store.jsx";
import { createProduct } from "../../Api/Main-api-pro.jsx";
import Swal from "sweetalert2";
import Uploadfile from "./Uploadfile.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";


const initialState = {
    title: "I5-14600K",
    description: "desc",
    price: 590,
    quantity: 10,
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

    useEffect(() => {
        getCategory(token);
        getProduct(token, 100);
    }, []);

    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        let timerInterval;
        Swal.fire({
            title: "กำลังเพิ่มสินค้า...",
            html: `โปรดรอสักครู่ <b>10</b> วินาที...`,
            timer: 10000,
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                const timer = Swal.getPopup().querySelector("b");
                let count = 10;
                timerInterval = setInterval(() => {
                    count--;
                    timer.textContent = count;
                }, 1000);
            },
            willClose: () => {
                clearInterval(timerInterval);
            },
        });

        setTimeout(async () => {
            try {
                const res = await createProduct(token, form);
                Swal.fire({
                    icon: "success",
                    title: "เพิ่มสินค้าสำเร็จ!",
                    text: `สินค้า "${res.data.title}" ถูกเพิ่มเรียบร้อย`,
                });
                setForm(initialState); // Reset form
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    text: err.response?.data?.message || "ไม่สามารถเพิ่มสินค้าได้",
                });
            } finally {
                setLoading(false);
            }
        }, 10000);
    };

    const handleEdit = (id) => {
        Swal.fire({
            icon: "info",
            title: "แก้ไขสินค้า",
            text: `คุณต้องการแก้ไขสินค้า ID: ${id}`,
        });
    };

    const handleDelete = (id) => {
        Swal.fire({
            icon: "warning",
            title: "ยืนยันการลบ?",
            text: "คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?",
            showCancelButton: true,
            confirmButtonText: "ลบเลย!",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: "success",
                    title: "ลบสำเร็จ!",
                    text: "สินค้าถูกลบเรียบร้อยแล้ว",
                });
            }
        });
    };

    return (
        <div className="container mx-auto p-4 bg-base-300 rounded-lg shadow-lg">
            <h1 className="text-2xl font-bold text-center mb-6">เพิ่มสินค้า</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">ชื่อสินค้า</span>
                    </label>
                    <input
                        className="input input-bordered w-full"
                        value={form.title}
                        onChange={handleOnChange}
                        placeholder="ชื่อสินค้า"
                        name="title"
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">คำอธิบายสินค้า</span>
                    </label>
                    <input
                        className="input input-bordered w-full"
                        value={form.description}
                        onChange={handleOnChange}
                        placeholder="คำอธิบายสินค้า"
                        name="description"
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">ราคาสินค้า</span>
                    </label>
                    <input
                        className="input input-bordered w-full"
                        type="number"
                        value={form.price}
                        onChange={handleOnChange}
                        placeholder="ราคาสินค้า"
                        name="price"
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">ปริมาณสินค้า</span>
                    </label>
                    <input
                        className="input input-bordered w-full"
                        type="number"
                        value={form.quantity}
                        onChange={handleOnChange}
                        placeholder="ปริมาณสินค้า"
                        name="quantity"
                        required
                    />
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">หมวดหมู่</span>
                    </label>
                    <select
                        className="select select-bordered w-full"
                        value={form.categoryId}
                        onChange={handleOnChange}
                        name="categoryId"
                        required
                    >
                        <option value="" disabled>กรุณาเลือกหมวดหมู่</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.id}>{item.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-control">
                    <label className="label">
                        <span className="label-text">อัปโหลดรูปภาพ</span>
                    </label>
                    <Uploadfile form={form} setForm={setForm} />
                </div>
                <hr className="my-6 border-base-200" />
                <button
                    type="submit"
                    className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="loading loading-spinner"></span> <FontAwesomeIcon icon={faPlus} /> กำลังเพิ่ม
                        </>
                    ) : (
                        "เพิ่มสินค้า"
                    )}
                </button>
            </form>
            <hr className="my-6 border-base-200" />
            <div className="overflow-x-auto">
                <table className="table table-zebra table-compact table-hover w-full bg-base-100 shadow-lg rounded-lg">
                    <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                    <tr>
                        <th>#</th>
                        <th>ชื่อสินค้า</th>
                        <th>คำอธิบาย</th>
                        <th>ราคา</th>
                        <th>จำนวน</th>
                        <th>ขายแล้ว</th>
                        <th>อัปเดตล่าสุด</th>
                        <th>การดำเนินการ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((item, index) => (
                        <tr key={index} className="hover:bg-base-200 transition duration-300">
                            <th>{item.id}</th>
                            <td className="font-semibold  text-white">{item.title}</td>
                            <td className="text-gray-600 text-white line-clamp-1">{item.description}</td>
                            <td className="text-green-500 font-bold">฿{item.price.toLocaleString()}</td>
                            <td className="text-blue-500">{item.quantity}</td>
                            <td className="text-purple-500">{item.sold}</td>
                            <td className="text-gray-500 text-white">{new Date(item.updatedAt).toLocaleDateString()}</td>
                            <td>
                                <div className="flex gap-2">
                                    <button className="btn btn-xs btn-outline btn-info hover:scale-105 transition-all">
                                        <FontAwesomeIcon icon={faEdit} /> แก้ไข
                                    </button>
                                    <button className="btn btn-xs btn-outline btn-error hover:scale-105 transition-all">
                                        <FontAwesomeIcon icon={faTrash} /> ลบ
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FormProduct;