import React, { useEffect, useState } from 'react';
import useShopStore from "../../store/shop-store.jsx";
import { readProduct, updateProduct } from "../../Api/Main-api-pro.jsx";
import Swal from "sweetalert2";
import Uploadfile from "./Uploadfile.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useParams, useNavigate } from 'react-router-dom';

const initialState = { title: "", description: "", price: 0, quantity: 0, categoryId: "", images: [] };

const FormEditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate(); // เรียกใช้ useNavigate
    const token = useShopStore((state) => state.token);
    const getCategory = useShopStore((state) => state.getCategory);
    const categories = useShopStore((state) => state.categories);
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);

    useEffect(() => { getCategory(token); fetchProduct(token, id); }, [token, id, getCategory]);

    const fetchProduct = async (token, id) => {
        try { const res = await readProduct(token, id); setForm(res.data); }
        catch (err) { console.error(err); }
    };

    const handleOnChange = (e) => { const { name, value } = e.target; setForm({ ...form, [name]: value }); };
    const validateForm = () => {
        if (!form.title || !form.description || !form.price || !form.quantity || !form.categoryId) {
            Swal.fire({ icon: "error", title: "ข้อมูลไม่ครบ", text: "กรุณากรอกข้อมูลให้ครบทุกช่อง" }); return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);
        Swal.fire({ title: "กำลังบันทึกข้อมูล...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
        try {
            const res = await updateProduct(token, id, form);
            Swal.fire({ icon: "success", title: "สำเร็จ!", text: `สินค้า "${res.data.title}" ถูกบันทึกแล้ว` })
                .then(() => {
                    navigate("/admin/product"); // Redirect ไปหน้า admin/product หลังจากบันทึกสำเร็จ
                });
        } catch (err) {
            Swal.fire({ icon: "error", title: "เกิดข้อผิดพลาด", text: err.response?.data?.message || "ไม่สามารถบันทึกได้" });
        } finally { setLoading(false); }
    };
    
    return (
        <div className="container mx-auto p-8 bg-black text-gray-100 rounded-2xl shadow-2xl">
            <h1 className="text-3xl font-extrabold text-center mb-8">แก้ไขสินค้า 🛒</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                {["title", "description", "price", "quantity"].map((field, idx) => (
                    <div key={idx} className="form-control">
                        <label className="label font-semibold text-lg capitalize">{field}</label>
                        <input
                            className="input input-bordered w-full bg-gray-800 text-gray-100 border-gray-700 shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                            value={form[field]}
                            onChange={handleOnChange}
                            placeholder={`กรอก${field}`}
                            name={field}
                            type={field === "price" || field === "quantity" ? "number" : "text"}
                            required
                        />
                    </div>
                ))}
                <div className="form-control">
                    <label className="label font-semibold text-lg">หมวดหมู่</label>
                    <select
                        className="select select-bordered w-full bg-gray-800 text-gray-100 border-gray-700 shadow-sm focus:ring-2 focus:ring-primary"
                        name="categoryId"
                        onChange={handleOnChange}
                        value={form.categoryId}
                        required
                    >
                        <option value="">เลือกหมวดหมู่</option>
                        {categories.map((item) => (<option key={item.id} value={item.id}>{item.name}</option>))}
                    </select>
                </div>
                <div className="form-control">
                    <label className="label font-semibold text-lg">อัปโหลดรูปภาพ</label>
                    <Uploadfile form={form} setForm={setForm} />
                </div>
                <button
                    type="submit"
                    className={`btn btn-primary w-full font-bold transition-all duration-300 bg-primary text-white ${loading ? "btn-disabled opacity-75" : "hover:bg-primary-focus hover:scale-105"}`}
                    disabled={loading}
                >
                    {loading ? (<><span className="loading loading-spinner"></span> <FontAwesomeIcon icon={faPlus} /> กำลังบันทึก...</>) : "บันทึกสินค้า"}
                </button>
            </form>
        </div>
    );
};

export default FormEditProduct;
