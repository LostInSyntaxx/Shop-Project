import React from 'react'

const HomeUser = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold text-center mt-10">ยินดีต้อนรับสู่หน้าหลักของผู้ใช้</h1>
            <p className="text-center text-gray-500 mt-4">ที่นี่คุณสามารถจัดการบัญชีและดูข้อมูลส่วนตัวของคุณได้</p>
            <div className="flex justify-center mt-10">
                <a href="/user/profile" className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-blue-600 transition">
                    ไปที่โปรไฟล์ของฉัน
                </a>

                <a href="/user/orders" className="bg-green-500 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-green-600 transition ml-4">
                    ดูคำสั่งซื้อของฉัน
                </a>

                <a href="/user/wishlist" className="bg-yellow-500 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-yellow-600 transition ml-4">
                    ดูรายการที่ชอบ
                </a>

                <a href="/user/settings" className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-gray-600 transition ml-4">
                    การตั้งค่า

                </a>
            </div>
        </div>
    )
}
export default HomeUser
