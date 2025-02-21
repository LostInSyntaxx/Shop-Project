import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Dashboard = () => {
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLogs, setSelectedLogs] = useState([]);
    const logsPerPage = 10;

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const storage = JSON.parse(localStorage.getItem('Shop-Project - main'));
                if (!storage || !storage.state || !storage.state.token) {
                    console.error('No token found in localStorage');
                    return;
                }
                const token = storage.state.token;
                const res = await axios.get('http://localhost:3000/api/product-logs', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLogs(res.data);
            } catch (err) {
                console.error('Error fetching product logs', err);
            }
        };
        fetchLogs();
    }, []);

    const filteredLogs = logs.filter(log =>
        Object.values(log).some(val =>
            val?.toString().toLowerCase().includes(search.toLowerCase())
        )
    );

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedLogs(currentLogs.map(log => log.id));
        } else {
            setSelectedLogs([]);
        }
    };

    const handleSelectLog = (logId) => {
        if (selectedLogs.includes(logId)) {
            setSelectedLogs(selectedLogs.filter(id => id !== logId));
        } else {
            setSelectedLogs([...selectedLogs, logId]);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedLogs.length === 0) {
            alert('กรุณาเลือกรายการที่ต้องการลบ');
            return;
        }

        try {
            const storage = JSON.parse(localStorage.getItem('Shop-Project - main'));
            const token = storage.state.token;
            await axios.delete('http://localhost:3000/api/product-logs', {
                headers: { Authorization: `Bearer ${token}` },
                data: { ids: selectedLogs }
            });
            setLogs(logs.filter(log => !selectedLogs.includes(log.id)));
            setSelectedLogs([]);
            alert('ลบข้อมูลเรียบร้อยแล้ว');
        } catch (err) {
            console.error('Error deleting logs', err);
            alert('เกิดข้อผิดพลาดในการลบข้อมูล');
        }
    };

    return (
        <div className="container mx-auto p-6 bg-base-100 rounded-xl shadow-2xl">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">ประวัติการซื้อสินค้า</h1>

            {/* ช่องค้นหา */}
            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="ค้นหาสินค้า, ผู้ซื้อ..."
                    className="input input-bordered w-full max-w-lg bg-base-200 focus:bg-base-100 transition-colors duration-300"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-primary ml-4">
                    ค้นหา
                </button>
            </div>

            {/* ปุ่มลบทั้งหมด */}
            <div className="mb-4">
                <button
                    onClick={handleDeleteSelected}
                    className="btn btn-error"
                    disabled={selectedLogs.length === 0}
                >
                    ลบที่เลือกทั้งหมด
                </button>
            </div>

            {/* ตารางประวัติสินค้า */}
            <div className="overflow-x-auto rounded-lg shadow-md">
                <table className="table w-full">
                    <thead className="bg-gradient-to-r from-primary to-secondary text-white">
                    <tr>
                        <th className="p-4">
                            <input
                                type="checkbox"
                                onChange={handleSelectAll}
                                checked={selectedLogs.length === currentLogs.length && currentLogs.length > 0}
                            />
                        </th>
                        <th className="p-4">ลำดับ</th>
                        <th className="p-4">ชื่อสินค้า</th>
                        <th className="p-4">จำนวน</th>
                        <th className="p-4">ราคา</th>
                        <th className="p-4">ผู้ซื้อ</th>
                        <th className="p-4">วันที่ซื้อ</th>
                    </tr>
                    </thead>
                    <tbody>
                    {currentLogs.length > 0 ? currentLogs.map((log, index) => (
                        <tr key={index} className="hover:bg-base-200 transition-colors duration-200">
                            <td className="p-4">
                                <input
                                    type="checkbox"
                                    checked={selectedLogs.includes(log.id)}
                                    onChange={() => handleSelectLog(log.id)}
                                />
                            </td>
                            <td className="p-4">{indexOfFirstLog + index + 1}</td>
                            <td className="p-4">{log.productName || 'ไม่ระบุ'}</td>
                            <td className="p-4">{log.quantity}</td>
                            <td className="p-4">{log.price}</td>
                            <td className="p-4">{log.buyerName}</td>
                            <td className="p-4">{new Date(log.purchaseDate).toLocaleString()}</td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="7" className="text-center p-4 text-gray-500">ไม่พบข้อมูล</td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-6">
                <div className="join">
                    <button
                        className="join-item btn"
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        «
                    </button>
                    {Array.from({ length: Math.ceil(filteredLogs.length / logsPerPage) }, (_, i) => (
                        <button
                            key={i + 1}
                            className={`join-item btn ${currentPage === i + 1 ? 'btn-active' : ''}`}
                            onClick={() => paginate(i + 1)}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        className="join-item btn"
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === Math.ceil(filteredLogs.length / logsPerPage)}
                    >
                        »
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
