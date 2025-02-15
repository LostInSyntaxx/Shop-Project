import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNav from '../components/MainNav.jsx';

const Layout = () => {
    return (
        <div className="">
            {/* Navigation Bar */}
            <header className="w-full">
                <MainNav />
            </header>

            {/* Main Content */}
            <main className=" w-full">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-base-100 shadow-md py-4 text-center text-gray-500">
                <p>&copy; 2025 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;
