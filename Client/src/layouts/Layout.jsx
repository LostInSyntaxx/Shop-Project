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
            <footer>

            </footer>
        </div>
    );
};

export default Layout;
