import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faStore, faShoppingCart, faSignInAlt, faUserPlus, faBell, faSignOutAlt, faHistory } from "@fortawesome/free-solid-svg-icons";
import useShopStore from "../store/shop-store.jsx";
import Swal from "sweetalert2";

const MainNav = () => {
    const carts = useShopStore((s) => s.carts);
    const user = useShopStore((s) => s.user);
    const logout = useShopStore((s) => s.logout);

    const [isAlertEnabled, setIsAlertEnabled] = useState(true);
    const [isLogoutAlertEnabled, setIsLogoutAlertEnabled] = useState(true);

    const handleLogout = () => {
        if (isLogoutAlertEnabled) {
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
        } else {
            logout();
        }
    };

    return (
        <nav className="bg-transparent py-3 sticky top-0 z-[9999999]">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center h-16">

                    {/* LOGO */}
                    <div className="flex items-center space-x-8">
                        <Link
                            to="/"
                            className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
                        >
                            LOGO
                        </Link>

                        {/* เมนูตรงกลาง */}
                        <div className="flex space-x-6 text-lg font-medium">
                            <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-primary transition">
                                <FontAwesomeIcon icon={faHome} />
                                Home
                            </Link>
                            <Link to="/shop" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-primary transition">
                                <FontAwesomeIcon icon={faStore} />
                                Shop
                            </Link>
                            <Link to="/cart" className="relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-primary transition">
                                <FontAwesomeIcon icon={faShoppingCart} />
                                Cart
                                {carts.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                        {carts.length}
                                    </span>
                                )}
                            </Link>
                        </div>
                    </div>

                    {/* Switch Alert + User Profile */}
                    <div className="flex items-center gap-4">
                        {/* ✅ Switch แจ้งเตือน */}
                        <label className="flex items-center gap-2 text-white text-sm cursor-pointer">
                            <FontAwesomeIcon icon={faBell} />
                            แจ้งเตือน
                            <input
                                type="checkbox"
                                checked={isAlertEnabled}
                                onChange={() => setIsAlertEnabled(!isAlertEnabled)}
                                className="toggle toggle-sm toggle-primary"
                            />
                        </label>

                        {user ? (
                            <div className="dropdown dropdown-end">
                                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full">
                                        <img
                                            alt="User Avatar"
                                            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                                        />
                                    </div>
                                </div>
                                <ul
                                    tabIndex={0}
                                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow gap-2"
                                >
                                    {/* ✅ History */}
                                    <li className="py-2">
                                        <Link to={"/user/history"} className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faHistory} />
                                            <span>History</span>
                                        </Link>
                                    </li>
                                    <li className="py-2">
                                        <Link to={"/admin"} className="flex items-center gap-2">
                                            <FontAwesomeIcon icon={faHistory} />
                                            <span>ระบบหลังบ้าน</span>
                                        </Link>
                                    </li>
                                    <div className="border-t border-gray-600 my-2"></div>
                                    <li className="py-2">
                                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                                            <FontAwesomeIcon icon={faSignOutAlt} />
                                            ยืนยัน Logout
                                            <input
                                                type="checkbox"
                                                checked={isLogoutAlertEnabled}
                                                onChange={() => setIsLogoutAlertEnabled(!isLogoutAlertEnabled)}
                                                className="toggle toggle-sm toggle-error"
                                            />
                                        </label>
                                    </li>

                                    {/* ✅ ปุ่ม Logout */}
                                    <li className="py-2">
                                        <button onClick={handleLogout} className="btn btn-error w-full py-3">
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
                                <Link to="/register" className="flex items-center gap-2 px-5 py-2 bg-primary text-white rounded-xl shadow-lg hover:bg-opacity-80 transition">
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
