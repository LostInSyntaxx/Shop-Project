import React, { useEffect, useState } from 'react';
import useShopStore from "../../store/shop-store.jsx";
import { createProduct, deleteProduct } from "../../Api/Main-api-pro.jsx";
import Swal from "sweetalert2";
import Uploadfile from "./Uploadfile.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash } from 'react-icons/fa';



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
    const [selectedImages, setSelectedImages] = useState([]);  // State สำหรับลบหลายรูป
    const [isOpen, setIsOpen] = useState(false);
    const [photoIndex, setPhotoIndex] = useState(0);



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
                setForm(initialState);
                getProduct()
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

    const toggleSelectImage = (imageId) => {
        setSelectedImages((prevSelected) =>
            prevSelected.includes(imageId)
                ? prevSelected.filter((id) => id !== imageId)
                : [...prevSelected, imageId]
        );
    };

    const handleDeleteMultiple = async () => {
        if (selectedImages.length === 0) {
            Swal.fire('แจ้งเตือน', 'กรุณาเลือกรายการก่อนลบ', 'warning');
            return;
        }

        const result = await Swal.fire({
            title: `คุณต้องการลบ ${selectedImages.length} รายการหรือไม่?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await Promise.all(selectedImages.map((id) => deleteProduct(token, id)));
                Swal.fire('สำเร็จ!', `ลบ ${selectedImages.length} รายการเรียบร้อย`, 'success');
                getProduct(token);
                setSelectedImages([]);
            } catch (err) {
                Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบได้', 'error');
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
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'ใช่, ลบเลย!',
            cancelButtonText: 'ยกเลิก'
        });

        if (result.isConfirmed) {
            try {
                await deleteProduct(token, id);
                getProduct();
                Swal.fire('ลบเรียบร้อย!', 'ข้อมูลของคุณถูกลบแล้ว.', 'success');
            } catch (err) {
                Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบข้อมูลได้.', 'error');
            }
        }
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

            {/* ปุ่มลบหลายรูป */}
            <button className="btn btn-error btn-outline mb-4" onClick={handleDeleteMultiple} disabled={selectedImages.length === 0}>
                ลบที่เลือก ({selectedImages.length})
            </button>

            {/* Products Table */}
            <div className="mt-10 overflow-x-auto rounded-lg shadow-md bg-white/20">
                <table className="table w-full">
                    <thead className="bg-gray-800 text-white">
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                className="checkbox checkbox-primary"
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
                        <th>#</th>
                        <th>Image</th>
                        <th>ชื่อสินค้า</th>
                        <th>คำอธิบาย</th>
                        <th>ราคา</th>
                        <th>จำนวน</th>
                        <th>ขายแล้ว</th>
                        <th>อัปเดตล่าสุด</th>
                        <th>จัดการ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((item, idx) => (
                        <tr key={idx} className="transition-all duration-300">
                            <td>
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={selectedImages.includes(item.id)}
                                    onChange={() => toggleSelectImage(item.id)}
                                />
                            </td>
                            <td>{item.id}</td>
                            <td>
                                {item.images.length > 0
                                    ? <img className={'w-20 h-20 rounded-lg shadow-md'} src={item.images[0].url} alt="product"/>
                                    : <div className={'w-20 h-20 bg-base-200 rounded-md flex items-center justify-center text-b'}>No Image</div>
                                }
                            </td>
                            <td>{item.title}</td>
                            <td>{item.description}</td>
                            <td>฿{item.price.toLocaleString()}</td>
                            <td>{item.quantity}</td>
                            <td>{item.sold}</td>
                            <td>{new Date(item.updatedAt).toLocaleDateString()}</td>
                            <td>
                                <Link className={'btn btn-sm ml-2'} to={'/admin/product/' + item.id}><FontAwesomeIcon icon={faEdit} /></Link>
                                <button className="btn btn-sm btn-error ml-2" onClick={() => handleDelete(item.id)}><FaTrash /></button>
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
