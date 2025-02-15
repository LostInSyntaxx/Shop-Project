import React, { useEffect, useState } from 'react';
import { createCategory, listCategory, removeCategory } from "../../Api/Main-Api.jsx";
import useShopStore from "../../store/shop-store.jsx";
import Swal from "sweetalert2";
import { motion } from "framer-motion";

const FormCategory = () => {
    const token = useShopStore((state) => state.token);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    useEffect(() => {
        getCategory(token);
    }, []);

    const getCategory = async (token) => {
        setLoading(true);
        try {
            const res = await listCategory(token);
            setCategories(res.data);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด",
                text: "ไม่สามารถโหลดข้อมูลหมวดหมู่ได้",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) {
            return Swal.fire({
                icon: "error",
                title: "กรุณากรอกชื่อหมวดหมู่!",
            });
        }

        setLoading(true);

        let timerInterval;
        Swal.fire({
            title: "กำลังตรวจสอบข้อมูล...",
            html: `กำลังเพิ่มหมวดหมู่ <b>15</b> วินาที...`,
            timer: 15000,
            timerProgressBar: true,
            allowOutsideClick: false,
            didOpen: () => {
                const timer = Swal.getPopup().querySelector("b");
                let count = 15;
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
                const res = await createCategory(token, { name });
                Swal.fire({
                    icon: "success",
                    title: `หมวดหมู่ "${res.data.name}" ถูกเพิ่มเรียบร้อย!`,
                });
                setName("");
                getCategory(token);
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    text: err.response?.data?.message || "ไม่สามารถเพิ่มหมวดหมู่ได้",
                });
            }
            setLoading(false);
        }, 15000);
    };

    const handleRemove = async (id) => {
        const confirmDelete = await Swal.fire({
            title: "ยืนยันการลบ?",
            text: "คุณแน่ใจหรือไม่ว่าต้องการลบหมวดหมู่นี้?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ลบเลย!",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        if (confirmDelete.isConfirmed) {
            let timerInterval;
            Swal.fire({
                title: "กำลังลบ...",
                html: `กำลังลบภายใน <b>10</b> วินาที...`,
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
                    await removeCategory(token, id);
                    Swal.fire({
                        icon: "success",
                        title: "ลบสำเร็จ!",
                        text: "หมวดหมู่ถูกลบเรียบร้อยแล้ว",
                    });
                    getCategory(token);
                } catch (err) {
                    Swal.fire({
                        icon: "error",
                        title: "เกิดข้อผิดพลาด",
                        text: "ไม่สามารถลบหมวดหมู่ได้",
                    });
                }
            }, 10000);
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : ' text-gray-900'} transition-all duration-500`}>
            {/* Dark Mode Toggle */}
            <button
                onClick={toggleDarkMode}
                className="fixed top-4 right-4 p-2 bg-white/10  rounded-full hover:scale-110 transition-transform duration-300"
            >
                {darkMode ? '🌙' : '☀️'}
            </button>

            <div className="container mx-auto p-8">
                <motion.h1
                    initial={{ opacity: 0, y: -50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-center mb-8"
                >
                    จัดการหมวดหมู่
                </motion.h1>
                <form className="my-4 space-y-4" onSubmit={handleSubmit}>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-lg">ชื่อหมวดหมู่</span>
                        </label>
                        <motion.input
                            whileFocus={{ scale: 1.05 }}
                            className="input input-bordered w-full bg-white/10  focus:bg-white/20 transition-all duration-300"
                            type="text"
                            placeholder="กรอกชื่อหมวดหมู่..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className={`btn btn-primary w-full mt-6 transition-transform duration-300 ${
                            loading ? "btn-disabled" : ""
                        }`}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading loading-spinner"></span> กำลังเพิ่ม
                            </>
                        ) : (
                            "เพิ่มหมวดหมู่"
                        )}
                    </motion.button>
                </form>
                <hr className="my-6 border-white/10" />
                <ul className="list-none space-y-2 mt-4 bg-white/10  p-6 rounded-lg">
                    {categories.map((item, index) => (
                        <motion.li
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="flex justify-between items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
                        >
                            <span className="text-lg">{item.name}</span>
                            <motion.button
                                whileHover={{ rotate: 12 }}
                                className="btn btn-error btn-sm hover:bg-red-600 transition-all duration-300"
                                onClick={() => handleRemove(item.id)}
                            >
                                ลบ
                            </motion.button>
                        </motion.li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FormCategory;