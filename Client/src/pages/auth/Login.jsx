import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import useShopStore from "../../store/shop-store.jsx";

const Login = () => {
    const navigate = useNavigate();
    const actionLogin = useShopStore((state) => state.actionLogin);
    const user = useShopStore((state) => state.user);
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await actionLogin(form);
            const role = res.data.payload.role;
            roleRedirect(role);
            Swal.fire({
                icon: "success",
                title: "เข้าสู่ระบบสำเร็จ!",
                text: "ยินดีต้อนรับเข้าสู่ระบบ",
                confirmButtonText: "OK",
            });
        } catch (err) {
            console.log(err);
            Swal.fire({
                icon: "error",
                title: "เกิดข้อผิดพลาด!",
                text: `${err.response?.data?.message || err.message}`,
            });
        }
    };
    const roleRedirect = (role) => {
        if (role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/user');
        }
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-black">
            <div className="bg-[#101010] p-8 rounded-2xl shadow-2xl max-w-md w-full">
                <h2 className="text-3xl font-bold text-center mb-6 text-white">Login</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Email</label>
                        <input
                            className="w-full py-2 px-3 rounded-xl bg-white/10 text-white border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Password</label>
                        <input
                            className="w-full py-2 px-3 rounded-xl bg-white/10 text-white border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleOnChange}
                            required
                        />
                    </div>
                    <button
                        className="w-full py-2 px-5 rounded-xl bg-white/20 text-white hover:bg-white/30 hover:shadow-lg transition-all duration-200"
                        type="submit"
                    >
                        เข้าสู่ระบบ
                    </button>
                    <p className="text-center text-white/70 my-3">หรือ</p>
                    <a
                        href="/register"
                        className="block w-full py-2 px-5 rounded-xl bg-white/10 text-white text-center hover:bg-white/20 hover:shadow-lg transition-all duration-200"
                    >
                        ฉันยังไม่มีบัญชี?
                    </a>
                </form>
            </div>
        </div>
    );
};

export default Login;