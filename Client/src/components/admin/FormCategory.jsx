import React, { useEffect, useState } from 'react';
import { createCategory, listCategory, removeCategory } from "../../Api/Main-Api.jsx";
import useShopStore from "../../store/shop-store.jsx";
import Swal from "sweetalert2";

// SVG Icons
const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
    </svg>
);

const TrashIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
);

const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
    </svg>
);

const FormCategory = () => {
    const token = useShopStore((state) => state.token);
    const [name, setName] = useState('');
    const categories = useShopStore((state) => state.categories);
    const getCategory = useShopStore((state) => state.getCategory);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        getCategory(token);
    }, []);

    const handleSelectCategory = (id) => {
        if (selectedCategories.includes(id)) {
            setSelectedCategories(selectedCategories.filter((item) => item !== id));
        } else {
            setSelectedCategories([...selectedCategories, id]);
        }
    };

    const handleBulkDelete = async () => {
        if (selectedCategories.length === 0) {
            return Swal.fire({
                icon: "warning",
                title: "กรุณาเลือกหมวดหมู่ที่ต้องการลบ",
            });
        }

        const confirmDelete = await Swal.fire({
            title: "ยืนยันการลบ?",
            text: `คุณแน่ใจหรือไม่ว่าต้องการลบ ${selectedCategories.length} หมวดหมู่?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "ลบเลย!",
            cancelButtonText: "ยกเลิก",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
        });

        if (confirmDelete.isConfirmed) {
            setLoading(true);

            try {
                await Promise.all(selectedCategories.map((id) => removeCategory(token, id)));
                Swal.fire({
                    icon: "success",
                    title: "ลบสำเร็จ!",
                    text: `ลบหมวดหมู่ทั้งหมด ${selectedCategories.length} รายการเรียบร้อย`,
                });
                setSelectedCategories([]);
                getCategory(token);
            } catch (err) {
                Swal.fire({
                    icon: "error",
                    title: "เกิดข้อผิดพลาด",
                    text: "ไม่สามารถลบหมวดหมู่ได้",
                });
            } finally {
                setLoading(false);
            }
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

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'} transition-all duration-500`}>
            {/* Dark Mode Toggle */}
            <button
                onClick={toggleDarkMode}
                className="fixed top-4 right-4 p-2 bg-white/10  rounded-full hover:scale-110 transition-transform duration-300"
            >
                {darkMode ? <MoonIcon /> : <SunIcon />}
            </button>

            <div className="container mx-auto p-8">
                <h1
                    data-aos="fade-down"
                    className="text-4xl font-bold text-center mb-8"
                >
                    จัดการหมวดหมู่
                </h1>
                <form
                    data-aos="fade-up"
                    className="my-4 space-y-4"
                    onSubmit={handleSubmit}
                >
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text text-lg">ชื่อหมวดหมู่</span>
                        </label>
                        <input
                            data-aos="fade-right"
                            className="input input-bordered w-full bg-white/10  focus:bg-white/20 transition-all duration-300"
                            type="text"
                            placeholder="กรอกชื่อหมวดหมู่..."
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <button
                        data-aos="fade-up"
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
                            <>
                                <PlusIcon />
                                <span className="ml-2">เพิ่มหมวดหมู่</span>
                            </>
                        )}
                    </button>
                </form>
                <hr className="my-6 border-white/10" />

                {/* ปุ่มลบทีเดียวหลายรายการ */}
                {selectedCategories.length > 0 && (
                    <div
                        data-aos="fade-up"
                        className="flex justify-end mb-4"
                    >
                        <button
                            onClick={handleBulkDelete}
                            className="btn btn-error"
                            disabled={loading}
                        >
                            <TrashIcon />
                            <span className="ml-2">ลบที่เลือก ({selectedCategories.length})</span>
                        </button>
                    </div>
                )}

                {/* ตารางหมวดหมู่ */}
                <ul className="list-none space-y-2 mt-4 bg-white/10  p-6 rounded-lg">
                    {categories.map((item, index) => (
                        <li
                            key={index}
                            data-aos="fade-up"
                            data-aos-delay={index * 100} // เพิ่ม delay สำหรับแต่ละรายการ
                            className="flex justify-between items-center p-4 bg-white/5  rounded-lg hover:bg-white/10 transition-all duration-300 hover:scale-105"
                        >
                            <div className="flex items-center space-x-4">
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={selectedCategories.includes(item.id)}
                                    onChange={() => handleSelectCategory(item.id)}
                                />
                                <span className="text-lg">{item.name}</span>
                            </div>
                            <button
                                className="btn btn-error btn-sm hover:bg-red-600 transition-all duration-300"
                                onClick={() => handleRemove(item.id)}
                            >
                                <TrashIcon />
                                <span className="ml-2">ลบ</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FormCategory;