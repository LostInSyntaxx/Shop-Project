import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faStore, faShoppingCart, faSignInAlt, faUserPlus } from "@fortawesome/free-solid-svg-icons";

const MainNav = () => {
    
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

                                <span className="absolute -top-2 -right-2  text-white text-xs font-bold px-2 py-1 rounded-full">

                </span>
                            </Link>
                        </div>
                    </div>

                    {/* ปุ่ม Login / Register */}
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
                </div>
            </div>
        </nav>
    );
};

export default MainNav;
