import React from 'react';
import { Link } from 'react-router-dom';

const MainNav = () => {
    return (
        <nav className="bg-tranparent py-2 text-white sticky -top-20 hidden lg:block relative z-[9999999] svelte-1mk7zim">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-8">
                        <Link
                            to="/"
                                    className="text-2xl font-bold  bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:scale-105 transition-transform duration-300"
                            >
                            LOGO
                        </Link>
                        <div className="flex space-x-6">
                            <Link
                                to="/"
                                className="text-base-content transition duration-300 px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-primary hover:shadow-md agd alk aty aul ayp azp bdk"
                            >
                                Home
                            </Link>
                            <Link
                                to="/shop"
                                className="text-base-content  transition duration-300 px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-primary hover:shadow-md"
                            >
                                Shop
                            </Link>
                            <Link
                                to="/cart"
                                className="text-base-content  transition duration-300 px-3 py-2 rounded-lg hover:bg-opacity-10 hover:bg-primary hover:shadow-md"
                            >
                                cart
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="py-2 px-7 block"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register"
                                className="py-2 px-7 block bg-black/50 text-white rounded-xl"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default MainNav;