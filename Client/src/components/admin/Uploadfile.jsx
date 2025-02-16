import React, { useState } from 'react';
import Swal from "sweetalert2";
import Resize from 'react-image-file-resizer';
import { removeFiles, uploadFiles } from "../../Api/Main-api-pro.jsx";
import useShopStore from "../../store/shop-store.jsx";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Uploadfile = ({ form, setForm }) => {
    const token = useShopStore((state) => state.token);
    const [isLoading, setIsLoading] = useState(false);

    const handleOnChange = async (e) => {
        const files = e.target.files;
        if (files) {
            setIsLoading(true);
            let allFiles = [...form.images];

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith('image/')) {
                    Swal.fire({
                        title: `ไฟล์ ${file.name} ไม่ถูกต้อง`,
                        icon: "error",
                        confirmButtonText: 'ตกลง',
                        confirmButtonColor: '#e53e3e'
                    });
                    continue;
                }
                await new Promise((resolve) => {
                    Resize.imageFileResizer(
                        file,
                        720,
                        720,
                        "JPEG",
                        100,
                        0,
                        (data) => {
                            uploadFiles(token, data)
                                .then((res) => {
                                    allFiles.push(res.data);
                                    setForm({ ...form, images: allFiles });
                                    // แจ้งเตือนหลังอัปโหลดสำเร็จ
                                    Swal.fire({
                                        title: 'อัปโหลดสำเร็จ!',
                                        text: `${file.name} ถูกอัปโหลดเรียบร้อยแล้ว`,
                                        icon: 'success',
                                        showConfirmButton: false,
                                        timer: 2000
                                    });
                                    resolve();
                                })
                                .catch((err) => {
                                    Swal.fire('เกิดข้อผิดพลาด!', err.message, 'error');
                                    resolve();
                                });
                        },
                        "base64"
                    );
                });
                await new Promise((r) => setTimeout(r, 300)); // Delay 300ms ให้โหลดทีละรูป
            }
            setIsLoading(false);
        }
    };

    const handleDelete = (public_id) => {
        Swal.fire({
            title: 'คุณแน่ใจหรือไม่?',
            text: "คุณจะไม่สามารถกู้คืนไฟล์นี้ได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'ใช่, ลบมัน!',
            cancelButtonText: 'ยกเลิก'
        }).then((result) => {
            if (result.isConfirmed) {
                const images = form.images;
                removeFiles(token, public_id)
                    .then((res) => {
                        const filteredImages = images.filter((item) => item.public_id !== public_id);
                        setForm({ ...form, images: filteredImages });
                        Swal.fire('ลบแล้ว!', 'ไฟล์ของคุณถูกลบแล้ว.', 'success');
                    })
                    .catch((err) => {
                        Swal.fire('เกิดข้อผิดพลาด!', err.message, 'error');
                    });
            }
        });
    };

    return (
        <div className="space-y-6 p-8 bg-base-100 rounded-2xl shadow-xl border border-base-300/20">
            {/* Uploaded Images */}
            <div className="flex flex-wrap gap-4">
                {form.images.map((item, index) => (
                    <div key={index} className="relative group overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fadeIn">
                        <img className="w-24 h-24 rounded-xl object-cover transform group-hover:scale-105 transition-transform duration-300" src={item.url} alt={`uploaded-${index}`} />
                        <button
                            onClick={() => handleDelete(item.public_id)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                        >
                            <FontAwesomeIcon icon={faTrash} className="w-8 h-8 flex items-center justify-center" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Upload Area */}
            <div
                className="border-2 border-dashed border-primary rounded-2xl p-8 text-center cursor-pointer hover:bg-base-200/50 transition-all duration-300"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                    e.preventDefault();
                    handleOnChange({ target: { files: e.dataTransfer.files } });
                }}
            >
                <input
                    type="file"
                    className="hidden"
                    id="fileInput"
                    name="images"
                    multiple
                    onChange={handleOnChange}
                />
                <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-16 h-16 mx-auto text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="mt-4 text-lg text-base-content/70">
                        ลากและวางไฟล์ที่นี่ หรือ <span className="text-primary font-semibold">เลือกไฟล์</span>
                    </p>
                </label>
            </div>

            {/* Loading Spinner */}
            {isLoading && (
                <div className="flex justify-center">
                    <span className="loading loading-spinner text-primary w-12 h-12"></span>
                </div>
            )}
        </div>
    );
};

export default Uploadfile;