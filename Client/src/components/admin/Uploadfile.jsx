import React, { useState } from 'react';
import Swal from "sweetalert2";
import Resize from 'react-image-file-resizer';
import { removeFiles, uploadFiles } from "../../Api/Main-api-pro.jsx";
import useShopStore from "../../store/shop-store.jsx";
import { faTrash, faCloudUploadAlt, faImages } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Uploadfile = ({ form, setForm }) => {
    const token = useShopStore((state) => state.token);
    const [isLoading, setIsLoading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const handleOnChange = async (e) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await processFiles(files);
        }
    };

    const processFiles = async (files) => {
        setIsLoading(true);
        let allFiles = [...form.images];
        let successCount = 0;
        
        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith('image/')) {
                    await Swal.fire({ 
                        title: `ไฟล์ไม่รองรับ`, 
                        text: `ไฟล์ ${file.name} ไม่ใช่รูปภาพ`, 
                        icon: "error", 
                        confirmButtonText: 'ตกลง',
                        background: '#1F2937',
                        color: 'white'
                    });
                    continue;
                }

                await new Promise((resolve) => {
                    Resize.imageFileResizer(
                        file, 720, 720, "JPEG", 100, 0,
                        async (data) => {
                            try {
                                const res = await uploadFiles(token, data);
                                allFiles.push(res.data);
                                setForm({ ...form, images: allFiles });
                                successCount++;
                                resolve();
                            } catch (err) {
                                await Swal.fire({ 
                                    title: 'อัปโหลดล้มเหลว', 
                                    text: `ไม่สามารถอัปโหลด ${file.name}`, 
                                    icon: 'error',
                                    background: '#1F2937',
                                    color: 'white'
                                });
                                resolve();
                            }
                        }, "base64"
                    );
                });
                await new Promise((r) => setTimeout(r, 300));
            }

            if (successCount > 0) {
                await Swal.fire({ 
                    title: 'สำเร็จ!', 
                    text: `อัปโหลด ${successCount} รูปภาพเรียบร้อย`, 
                    icon: 'success', 
                    timer: 2000, 
                    showConfirmButton: false,
                    background: '#1F2937',
                    color: 'white'
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (public_id) => {
        const result = await Swal.fire({
            title: 'ยืนยันการลบ',
            text: "คุณจะไม่สามารถกู้คืนไฟล์นี้ได้!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
            confirmButtonText: 'ลบ',
            cancelButtonText: 'ยกเลิก',
            background: '#1F2937',
            color: 'white'
        });

        if (result.isConfirmed) {
            try {
                await removeFiles(token, public_id);
                const filteredImages = form.images.filter((item) => item.public_id !== public_id);
                setForm({ ...form, images: filteredImages });
                await Swal.fire({
                    title: 'ลบเรียบร้อย!',
                    text: 'ไฟล์ถูกลบออกแล้ว',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    background: '#1F2937',
                    color: 'white'
                });
            } catch (err) {
                await Swal.fire({
                    title: 'เกิดข้อผิดพลาด!',
                    text: err.message,
                    icon: 'error',
                    background: '#1F2937',
                    color: 'white'
                });
            }
        }
    };

    const handleDragEvents = (e, isEntering) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(isEntering);
    };

    return (
        <div className="space-y-6 p-6 bg-gray-900 rounded-xl border border-gray-700 shadow-xl">
            {/* Uploaded Images Section */}
            {form.images.length > 0 && (
                <div className="animate-fade-in">
                    <div className="flex items-center mb-4 text-gray-300">
                        <FontAwesomeIcon icon={faImages} className="mr-3 text-blue-400 text-lg" />
                        <span className="font-semibold text-lg">รูปภาพที่อัปโหลด ({form.images.length})</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {form.images.map((item, index) => (
                            <div 
                                key={index} 
                                className="relative group aspect-square transition-all duration-300 hover:z-10"
                            >
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <img 
                                    className="w-full h-full rounded-lg object-cover shadow-lg transition-transform duration-300 group-hover:scale-105" 
                                    src={item.url} 
                                    alt={`uploaded-${index}`}
                                    loading="lazy"
                                />
                                <button
                                    onClick={() => handleDelete(item.public_id)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
                                    aria-label="Delete image"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Drop Zone */}
            <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    isDragging 
                        ? 'border-blue-400 bg-blue-900/30 shadow-lg' 
                        : 'border-gray-600 hover:border-blue-400 hover:bg-gray-800/50'
                } ${form.images.length > 0 ? 'mt-6' : ''}`}
                onDragEnter={(e) => handleDragEvents(e, true)}
                onDragOver={(e) => handleDragEvents(e, true)}
                onDragLeave={(e) => handleDragEvents(e, false)}
                onDrop={(e) => {
                    handleDragEvents(e, false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        processFiles(e.dataTransfer.files);
                    }
                }}
            >
                {isDragging && (
                    <div className="absolute inset-0 bg-blue-900/10 rounded-xl flex items-center justify-center z-10">
                        <div className="p-3 bg-blue-900/50 rounded-full animate-pulse">
                            <FontAwesomeIcon 
                                icon={faCloudUploadAlt} 
                                className="text-white text-2xl" 
                            />
                        </div>
                    </div>
                )}
                
                <input 
                    type="file" 
                    className="hidden" 
                    id="fileInput" 
                    name="images" 
                    multiple 
                    accept="image/*" 
                    onChange={handleOnChange} 
                />
                <label 
                    htmlFor="fileInput" 
                    className="cursor-pointer flex flex-col items-center justify-center space-y-4"
                >
                    <div className="p-4 bg-blue-900/20 rounded-full transition-all duration-300 group-hover:bg-blue-900/30">
                        <FontAwesomeIcon 
                            icon={faCloudUploadAlt} 
                            className="text-blue-400 text-4xl transition-transform duration-300 group-hover:scale-110" 
                        />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-xl font-semibold text-gray-200">
                            {isDragging ? 'วางไฟล์ที่นี่' : 'ลากและวางไฟล์ที่นี่'}
                        </h3>
                        <p className="text-gray-400">
                            หรือ <span className="text-blue-400 font-medium hover:text-blue-300 transition-colors">คลิกเพื่อเลือกไฟล์</span>
                        </p>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 10MB
                    </p>
                </label>
            </div>

            {/* Loading Indicator */}
            {isLoading && (
                <div className="flex flex-col items-center justify-center space-y-3 py-6 animate-fade-in">
                    <div className="relative w-14 h-14">
                        <div className="absolute inset-0 border-4 border-blue-500/30 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"></div>
                    </div>
                    <p className="text-gray-400 font-medium">กำลังอัปโหลด...</p>
                    <p className="text-xs text-gray-500">กรุณารอสักครู่</p>
                </div>
            )}
        </div>
    );
};

export default Uploadfile;