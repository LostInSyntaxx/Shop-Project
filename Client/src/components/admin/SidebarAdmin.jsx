import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const SidebarAdmin = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [openSubMenu, setOpenSubMenu] = useState(null);

    // ฟังก์ชันสำหรับเปิด/ปิด Sub Menu
    const toggleSubMenu = (menu) => {
        setOpenSubMenu(openSubMenu === menu ? null : menu);
    };

    return (
        <div
            className={`${
                isCollapsed ? 'w-20' : 'w-64'
            } min-h-screen flex flex-col bg-gradient-to-r from-gray-900 to-black text-white transition-all duration-300 fixed lg:relative z-50`}
        >
            {/* Header */}
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
                {!isCollapsed && <h1 className="text-2xl font-bold">Admin Panel</h1>}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-all duration-300 lg:hidden"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    <li>
                        <NavLink
                            to="/admin"
                            className={({ isActive }) =>
                                `flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-all duration-300 ${
                                    isActive ? 'bg-gray-800 font-semibold' : ''
                                }`
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                            {!isCollapsed && 'Dashboard'}
                        </NavLink>
                    </li>
                    <li>
                        <div
                            className={`flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-all duration-300 cursor-pointer ${
                                openSubMenu === 'manage' ? 'bg-gray-800 font-semibold' : ''
                            }`}
                            onClick={() => toggleSubMenu('manage')}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                            {!isCollapsed && 'Manage'}
                            {!isCollapsed && (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-4 w-4 ml-auto transition-transform duration-300 ${
                                        openSubMenu === 'manage' ? 'transform rotate-180' : ''
                                    }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            )}
                        </div>
                        {openSubMenu === 'manage' && !isCollapsed && (
                            <ul className="pl-6 mt-2 space-y-2">
                                <li>
                                    <NavLink
                                        to="/admin/manage/users"
                                        className={({ isActive }) =>
                                            `flex items-center p-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-all duration-300 ${
                                                isActive ? 'bg-gray-800 font-semibold' : ''
                                            }`
                                        }
                                    >
                                        Users
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink
                                        to="/admin/manage/roles"
                                        className={({ isActive }) =>
                                            `flex items-center p-2 text-gray-300 hover:bg-gray-800 rounded-lg transition-all duration-300 ${
                                                isActive ? 'bg-gray-800 font-semibold' : ''
                                            }`
                                        }
                                    >
                                        Roles
                                    </NavLink>
                                </li>
                            </ul>
                        )}
                    </li>
                    <li>
                        <NavLink
                            to="/admin/category"
                            className={({ isActive }) =>
                                `flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-all duration-300 ${
                                    isActive ? 'bg-gray-800 font-semibold' : ''
                                }`
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                />
                            </svg>
                            {!isCollapsed && 'Category'}
                        </NavLink>
                    </li>
                    <li>
                        <NavLink
                            to="/admin/product"
                            className={({ isActive }) =>
                                `flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-all duration-300 ${
                                    isActive ? 'bg-gray-800 font-semibold' : ''
                                }`
                            }
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 mr-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                                />
                            </svg>
                            {!isCollapsed && 'Product'}
                        </NavLink>
                    </li>
                </ul>
            </nav>

            {/* Logout Button */}
            <div className="p-4 border-t border-gray-700">
                <NavLink
                    to="/logout"
                    className="flex items-center p-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-all duration-300"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-3"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                    </svg>
                    {!isCollapsed && 'Logout'}
                </NavLink>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700 text-center text-gray-400">
                <p>&copy; 2023 Admin Panel. All rights reserved.</p>
            </div>
        </div>
    );
};

export default SidebarAdmin;