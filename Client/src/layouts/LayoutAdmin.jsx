import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarAdmin from '../components/admin/SidebarAdmin.jsx';
import HeaderAdmin from '../components/admin/HeaderAdmin.jsx';

const LayoutAdmin = () => {
    return (
        <div className="min-h-screen flex">
            <div className=" flex">
                <SidebarAdmin />
            </div>
            <div className="flex-1 flex flex-col overflow-hidden">
                <header className=" shadow-md">
                    <HeaderAdmin />
                </header>
                <main className="flex-1 overflow-x-hidden overflow-y-auto  p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LayoutAdmin;