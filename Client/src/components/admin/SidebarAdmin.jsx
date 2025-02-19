import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie, faWrench, faTags, faBox, faRightFromBracket, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import AOS from 'aos';  // Import AOS
import 'aos/dist/aos.css';  // Import AOS CSS

const SidebarAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 1000);
        AOS.init({ duration: 1000, offset: 100, easing: 'ease-in-out' });  // Initialize AOS
        return () => clearTimeout(timer);
    }, [location.pathname]);

    return (
        <div className="flex min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-5 left-5 z-50 btn btn-sm btn-circle btn-outline lg:hidden transition-transform transform hover:scale-110"
            >
                <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
            </button>

            {/* Sidebar */}
            <div
                data-aos="fade-right"  // ใช้ AOS Fade Animation
                className={`bg-white dark:bg-gray-800 shadow-xl h-screen w-72 p-5 fixed lg:relative z-40 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="text-3xl font-bold text-center text-primary mb-8">
                    Admin Panel
                </div>

                <nav className="flex flex-col gap-4">
                    <NavLink to="/admin" data-aos="fade-up" className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gradient-to-r from-primary to-indigo-500 hover:text-white ${isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-700 dark:text-gray-300'}`}>
                        <FontAwesomeIcon icon={faChartPie} /> Dashboard
                    </NavLink>
                    <NavLink to="manage" data-aos="fade-up" data-aos-delay="100" className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gradient-to-r from-primary to-indigo-500 hover:text-white ${isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-700 dark:text-gray-300'}`}>
                        <FontAwesomeIcon icon={faWrench} /> Manage
                    </NavLink>
                    <NavLink to="category" data-aos="fade-up" data-aos-delay="200" className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gradient-to-r from-primary to-indigo-500 hover:text-white ${isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-700 dark:text-gray-300'}`}>
                        <FontAwesomeIcon icon={faTags} /> Category
                    </NavLink>
                    <NavLink to="product" data-aos="fade-up" data-aos-delay="300" className={({ isActive }) =>
                        `flex items-center gap-3 p-3 rounded-lg transition-all hover:bg-gradient-to-r from-primary to-indigo-500 hover:text-white ${isActive ? 'bg-primary text-white shadow-lg' : 'text-gray-700 dark:text-gray-300'}`}>
                        <FontAwesomeIcon icon={faBox} /> Product
                    </NavLink>
                </nav>

                <div className="mt-auto">
                    <NavLink to="/logout" data-aos="fade-up" data-aos-delay="400" className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all">
                        <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                    </NavLink>
                </div>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="text-white text-xl flex flex-col items-center">
                        <span className="loading loading-spinner loading-lg"></span>
                        <p className="mt-3">กำลังโหลด...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SidebarAdmin;
