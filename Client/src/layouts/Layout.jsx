import React from 'react';
import { Outlet } from 'react-router-dom';
import MainNav from '../components/MainNav.jsx';

const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navigation Bar */}
            <header className="bg-white shadow-md">
                <MainNav />
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <Outlet />
            </main>

            {/* Footer (Optional) */}
            <footer className="bg-white shadow-md py-4 text-center text-gray-600">
                <p>&copy; 2025 Your Company. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Layout;