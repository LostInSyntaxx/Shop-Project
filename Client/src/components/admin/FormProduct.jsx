import React, { useEffect, useState } from 'react';
import useShopStore from "../../store/shop-store.jsx";
import { createProduct } from "../../Api/Main-api-pro.jsx";
import Swal from "sweetalert2";
import { motion } from "framer-motion";
import { FaEdit, FaTrash } from 'react-icons/fa';
import Uploadfile from "./Uploadfile.jsx";

const initialState = {
    title: "I5-14600K",
    description: "desc",
    price: 590,
    quantity: 10,
    categoryId: 3,
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
        setForm({ ...form, [e.target.name]: e.target.value });
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
        <div className="container mx-auto p-4 bg-base-300 rounded-lg shadow-lg bg-white/10">
            <motion.form
                onSubmit={handleSubmit}
                className="space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-2xl font-bold text-center mb-6">เพิ่มสินค้า</h1>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">ชื่อสินค้า</span>
                    </label>
                    <motion.input
                        whileFocus={{ scale: 1.05 }}
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
                        <span className="label-text">คำอธิบาย</span>
                    </label>
                    <motion.input
                        whileFocus={{ scale: 1.05 }}
                        className="input input-bordered w-full"
                        value={form.description}
                        onChange={handleOnChange}
                        placeholder="คำอธิบาย"
                        name="description"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">ราคา</span>
                    </label>
                    <motion.input
                        whileFocus={{ scale: 1.05 }}
                        className="input input-bordered w-full"
                        type="number"
                        value={form.price}
                        onChange={handleOnChange}
                        placeholder="ราคา"
                        name="price"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">จำนวน</span>
                    </label>
                    <motion.input
                        whileFocus={{ scale: 1.05 }}
                        className="input input-bordered w-full"
                        type="number"
                        value={form.quantity}
                        onChange={handleOnChange}
                        placeholder="จำนวน"
                        name="quantity"
                        required
                    />
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">หมวดหมู่</span>
                    </label>
                    <motion.select
                        whileFocus={{ scale: 1.05 }}
                        className="select select-bordered w-full"
                        name="categoryId"
                        onChange={handleOnChange}
                        required
                    >
                        <option value="">กรุณาเลือกหมวดหมู่</option>
                        {categories.map((item, index) => (
                            <option key={index} value={item.id}>
                                {item.name}
                            </option>
                        ))}
                    </motion.select>
                </div>

                <hr className="my-6 border-base-200" />

                <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                    <table className="table w-full">
                        <thead>
                        <tr>
                            <th>ลำดับ</th>
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
                            <tr key={index} className="hover:bg-base-200 transition-colors duration-200">
                                <th scope="row">{item.id}</th>
                                <td>{item.title}</td>
                                <td>{item.description}</td>
                                <td>฿{item.price.toLocaleString()}</td>
                                <td>{item.quantity}</td>
                                <td>{item.sold}</td>
                                <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                                <td>
                                    <div className="flex space-x-2">
                                        <button
                                            className="btn btn-ghost btn-xs text-info hover:scale-125 transition-transform"
                                            onClick={() => handleEdit(item.id)}
                                        >
                                            <FaEdit className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="btn btn-ghost btn-xs text-error hover:scale-125 transition-transform"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <tfoot className="bg-base-200 items-center justify-center">
                    <tr>
                        <th colSpan="6" className="text-right">รวมทั้งหมด</th>
                        <th>{products.length} รายการ</th>
                    </tr>
                    </tfoot>
                </div>

                <hr className="my-6 border-base-200" />

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={`btn btn-primary w-full ${loading ? "btn-disabled" : ""}`}
                    disabled={loading}
                >
                    {loading ? (
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                            <span className="ml-2">กำลังเพิ่ม...</span>
                        </div>
                    ) : (
                        "เพิ่มสินค้า"
                    )}
                </motion.button>
                <Uploadfile/>
            </motion.form>
        </div>
    );
};

export default FormProduct;