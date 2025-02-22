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
    faHistory
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

    useEffect(() => {
        AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    }, []);

    const handleLogout = () => {
        Swal.fire({
            title: "ออกจากระบบ?",
            text: "คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "ออกจากระบบ",
            cancelButtonText: "ยกเลิก",
            background: "#1e1e1e",
            color: "#fff"
        }).then((result) => {
            if (result.isConfirmed) {
                logout();
                Swal.fire({
                    title: "ออกจากระบบสำเร็จ!",
                    text: "คุณได้ออกจากระบบเรียบร้อยแล้ว",
                    icon: "success",
                    background: "#1e1e1e",
                    color: "#fff",
                    confirmButtonColor: "#22c55e"
                });
            }
        });
    };

    return (
        <nav className="bg-black/20 py-3 sticky top-0 z-[9999]">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-3xl font-bold text-white hover:text-primary transition">
                        LOGO
                    </Link>

                    {/* เมนูตรงกลาง */}
                    <div className="flex space-x-6 text-lg font-medium">
                        {[
                            { to: "/", icon: faHome, label: "Home" },
                            { to: "/shop", icon: faStore, label: "Shop" },
                            { to: "/cart", icon: faShoppingCart, label: "Cart", badge: carts.length }
                        ].map(({ to, icon, label, badge }) => (
                            <Link key={label} to={to} className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/20 transition">
                                <FontAwesomeIcon icon={icon} />
                                {label}
                                {badge > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {badge}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>

                    {/* Alert & Profile */}
                    <div className="flex items-center gap-4">
                        {/* Switch แจ้งเตือน */}
                        <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                            <FontAwesomeIcon icon={faBell} />
                            แจ้งเตือน
                            <input type="checkbox" checked={isAlertEnabled} onChange={() => setIsAlertEnabled(!isAlertEnabled)} className="toggle toggle-sm toggle-primary" />
                        </label>

                        {user ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img alt="User Avatar" src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                    </div>
                                </div>
                                <ul tabIndex={0} className="menu menu-sm dropdown-content bg-black/90 backdrop-blur-md text-white rounded-xl z-[1] mt-3 w-52 p-2 gap-2">
                                    <li>
                                        <Link to={"/user/history"} className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700">
                                            <FontAwesomeIcon icon={faHistory} />
                                            <span>History</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={"/admin"} className="flex items-center gap-2 px-4 py-2 rounded-md hover:bg-gray-700">
                                            <FontAwesomeIcon icon={faHistory} />
                                            <span>ระบบหลังบ้าน</span>
                                        </Link>
                                    </li>
                                    <div className="border-t border-gray-600 my-2"></div>
                                    <li>
                                        <label className="flex items-center gap-2 px-4 py-2 text-sm cursor-pointer">
                                            <FontAwesomeIcon icon={faSignOutAlt} />
                                            ยืนยัน Logout
                                            <input type="checkbox" checked={isLogoutAlertEnabled} onChange={() => setIsLogoutAlertEnabled(!isLogoutAlertEnabled)} className="toggle toggle-sm toggle-error" />
                                        </label>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="btn btn-error w-full py-3 rounded-md hover:bg-red-600">
                                            <FontAwesomeIcon icon={faSignOutAlt} />
                                            Logout
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-6">
                                <Link to="/login" className="flex items-center gap-2 text-white hover:text-gray-300 transition">
                                    <FontAwesomeIcon icon={faSignInAlt} />
                                    Login
                                </Link>
                                <Link to="/register" className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:bg-opacity-80 transition">
                                    <FontAwesomeIcon icon={faUserPlus} />
                                    Register
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
