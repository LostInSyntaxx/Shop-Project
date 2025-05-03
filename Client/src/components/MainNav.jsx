import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faStore,
    faShoppingCart,
    faSignInAlt,
    faUserPlus,
    faBell,
    faSignOutAlt,
    faHistory,
    faUser,
    faCrown
} from "@fortawesome/free-solid-svg-icons";
import useShopStore from "../store/shop-store.jsx";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";

const MainNav = () => {
    const carts = useShopStore((s) => s.carts);
    const user = useShopStore((s) => s.user);
    const logout = useShopStore((s) => s.logout);

    const [isAlertEnabled, setIsAlertEnabled] = useState(true);
    const [isLogoutAlertEnabled, setIsLogoutAlertEnabled] = useState(true);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        AOS.init({ duration: 800, easing: "ease-in-out", once: true });
        
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        if (isLogoutAlertEnabled) {
            Swal.fire({
                title: "ออกจากระบบ?",
                text: "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ",
                icon: "question",
                showCancelButton: true,
                confirmButtonColor: "#ef4444",
                cancelButtonColor: "#3b82f6",
                confirmButtonText: "ออกจากระบบ",
                cancelButtonText: "ยกเลิก",
                background: "#1a1a1a",
                color: "#fff",
                backdrop: "rgba(0,0,0,0.7)"
            }).then((result) => {
                if (result.isConfirmed) {
                    logout();
                    Swal.fire({
                        title: "ออกจากระบบสำเร็จ!",
                        text: "คุณได้ออกจากระบบเรียบร้อยแล้ว",
                        icon: "success",
                        background: "#1a1a1a",
                        color: "#fff",
                        iconColor: "#10b981"
                    });
                }
            });
        } else {
            logout();
        }
    };

    return (
        <nav className={`bg-gradient-to-b from-gray-900 to-gray-900/90 backdrop-blur-md py-3 sticky top-0 z-[9999] border-b border-gray-800 shadow-lg transition-all duration-300 ${isScrolled ? 'py-2 shadow-xl' : 'py-3'}`}>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-rose-500 bg-clip-text text-transparent hover:from-purple-500 hover:via-pink-600 hover:to-rose-600 transition-all duration-500"
                        data-aos="fade-right"
                    >
                        <span className="flex items-center">
                            ShopLuxe
                            <span className="text-xs bg-gradient-to-r from-rose-500 to-pink-500 text-white px-2 py-1 rounded-full ml-2 hidden sm:inline-block">
                                PREMIUM
                            </span>
                        </span>
                    </Link>

                    {/* Main Navigation */}
                    <div className="hidden md:flex space-x-1 text-lg font-medium" data-aos="fade-down">
                        {[
                            { to: "/", icon: faHome, label: "Home" },
                            { to: "/shop", icon: faStore, label: "Shop" },
                            { to: "/cart", icon: faShoppingCart, label: "Cart", badge: carts.length }
                        ].map(({ to, icon, label, badge }) => (
                            <Link 
                                key={label} 
                                to={to} 
                                className="relative flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-800/50 transition-all group hover:shadow-lg hover:shadow-purple-500/10"
                            >
                                <div className="relative">
                                    <FontAwesomeIcon 
                                        icon={icon} 
                                        className="text-gray-300 group-hover:text-purple-400 transition-colors group-hover:scale-110" 
                                    />
                                    {badge > 0 && (
                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full animate-pulse">
                                            {badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-gray-300 group-hover:text-white font-medium">{label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* User Controls */}
                    <div className="flex items-center gap-4" data-aos="fade-left">
                        {/* Notification Toggle */}
                        <div className="hidden sm:flex items-center gap-2">
                            <div className="tooltip tooltip-bottom" data-tip="Notifications">
                                <label className="flex items-center cursor-pointer p-2 rounded-full hover:bg-gray-800/50 transition-all">
                                    <input 
                                        type="checkbox" 
                                        checked={isAlertEnabled} 
                                        onChange={() => setIsAlertEnabled(!isAlertEnabled)} 
                                        className="hidden"
                                    />
                                    <div className="relative">
                                        <FontAwesomeIcon 
                                            icon={faBell} 
                                            className={`text-lg ${isAlertEnabled ? 'text-yellow-400 animate-pulse' : 'text-gray-400'}`}
                                        />
                                        {isAlertEnabled && (
                                            <span className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></span>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        {user ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar group">
                                    <div className="w-10 rounded-full ring-2 ring-purple-500/50 hover:ring-purple-400 transition-all group-hover:ring-offset-2 group-hover:ring-offset-gray-900">
                                        <img 
                                            alt="User Avatar" 
                                            src={user.avatar || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} 
                                            className="hover:scale-105 transition-transform"
                                        />
                                    </div>
                                </div>
                                <ul 
                                    tabIndex={0} 
                                    className="menu menu-sm dropdown-content bg-gray-900/95 backdrop-blur-lg text-white rounded-2xl shadow-2xl z-[1] mt-3 w-64 p-2 gap-1 border border-gray-700/50"
                                >
                                    <li className="px-4 py-3 border-b border-gray-700/50 hover:bg-transparent">
                                        <div className="flex items-center gap-3">
                                            <div className="avatar">
                                                <div className="w-12 rounded-full ring-2 ring-purple-500/50">
                                                    <img src={user.avatar || "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-bold text-white truncate">{user.name}</p>
                                                <div className={`badge ${user.role === 'admin' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'} gap-1 mt-1`}>
                                                    {user.role === 'admin' && <FontAwesomeIcon icon={faCrown} className="text-yellow-300" />}
                                                    {user.role || 'Member'}
                                                </div>
                                            </div>
                                        </div>
                                    </li>

                                    <li>
                                        <Link 
                                            to="/user" 
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors hover:translate-x-1"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faUser} className="text-blue-400" />
                                            </div>
                                            <span>โปรไฟล์</span>
                                        </Link>
                                    </li>

                                    <li>
                                        <Link 
                                            to="/user/history" 
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors hover:translate-x-1"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faHistory} className="text-emerald-400" />
                                            </div>
                                            <span>ประวัติการสั่งซื้อ</span>
                                        </Link>
                                    </li>

                                    {user.role === "admin" && (
                                        <li>
                                            <Link 
                                                to="/admin" 
                                                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-purple-500/20 transition-colors hover:translate-x-1"
                                            >
                                                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faUser} className="text-purple-400" />
                                                </div>
                                                <span>ระบบหลังบ้าน</span>
                                                <span className="badge badge-sm bg-gradient-to-r from-purple-500 to-pink-500 border-0 text-white ml-auto">Admin</span>
                                            </Link>
                                        </li>
                                    )}

                                    <div className="border-t border-gray-700/50 my-2"></div>

                                    <li>
                                        <label className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                    <FontAwesomeIcon icon={faSignOutAlt} className="text-red-400" />
                                                </div>
                                                <span>แจ้งเตือนเมื่อออกจากระบบ</span>
                                            </div>
                                            <input
                                                type="checkbox"
                                                checked={isLogoutAlertEnabled}
                                                onChange={() => setIsLogoutAlertEnabled(!isLogoutAlertEnabled)}
                                                className="toggle toggle-sm toggle-error"
                                            />
                                        </label>
                                    </li>

                                    <li>
                                        <button 
                                            onClick={handleLogout} 
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-red-500/10 to-rose-500/10 hover:from-red-500/20 hover:to-rose-500/20 text-red-400 transition-colors w-full hover:translate-x-1"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                                                <FontAwesomeIcon icon={faSignOutAlt} />
                                            </div>
                                            <span>ออกจากระบบ</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link 
                                    to="/login" 
                                    className="btn btn-ghost text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all hidden sm:flex group"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-2 group-hover:bg-blue-500/30 transition-colors">
                                        <FontAwesomeIcon icon={faSignInAlt} />
                                    </div>
                                    เข้าสู่ระบบ
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="btn bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center mr-2">
                                        <FontAwesomeIcon icon={faUserPlus} />
                                    </div>
                                    สมัครสมาชิก
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default MainNav;