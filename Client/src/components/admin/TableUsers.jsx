import React, { useEffect, useState } from "react";
import { changeUserStatus, changeUserRole, getListAllUsers } from "../../Api/api-admin.jsx";
import useShopStore from "../../store/shop-store.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faUser, faUserShield, faCheckCircle, faTimesCircle, faEye, faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";

const TableUsers = () => {
    const token = useShopStore((state) => state.token);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        GetUsers(token);
    }, []);

    const GetUsers = (token) => {
        getListAllUsers(token)
            .then((res) => setUsers(res.data))
            .catch((err) => console.log(err));
    };

    const usersStatus = (userId, userStatus) => {
        Swal.fire({
            title: "ยืนยันการเปลี่ยนสถานะ?",
            text: `คุณต้องการ ${userStatus ? "ปิดใช้งาน" : "เปิดใช้งาน"} บัญชีนี้ใช่หรือไม่?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                const value = { id: userId, enabled: !userStatus };
                changeUserStatus(token, value)
                    .then(() => {
                        Swal.fire("สำเร็จ!", "เปลี่ยนสถานะเรียบร้อย", "success");
                        GetUsers(token);
                    })
                    .catch(() => {
                        Swal.fire("เกิดข้อผิดพลาด!", "ลองอีกครั้ง", "error");
                    });
            }
        });
    };

    const usersStatusRole = (userId, userRole) => {
        Swal.fire({
            title: "ยืนยันการเปลี่ยนสิทธิ์?",
            text: `คุณต้องการเปลี่ยนสิทธิ์เป็น "${userRole}" ใช่หรือไม่?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "ยืนยัน",
            cancelButtonText: "ยกเลิก",
        }).then((result) => {
            if (result.isConfirmed) {
                const value = { id: userId, role: userRole };
                changeUserRole(token, value)
                    .then(() => {
                        Swal.fire("สำเร็จ!", "เปลี่ยนสิทธิ์เรียบร้อย", "success");
                        GetUsers(token);
                    })
                    .catch(() => {
                        Swal.fire("เกิดข้อผิดพลาด!", "ลองอีกครั้ง", "error");
                    });
            }
        });
    };

    return (
        <div className="container mx-auto p-4 bg-black/35 rounded-2xl">
            <div className="overflow-x-auto rounded-box bg-black/20">
                <table className="table w-full">
                    {/* ------ Table Header ------ */}
                    <thead>
                    <tr className="text-white text-center">
                        <th className="bg-black/20 text-white/70 p-3 w-12">#</th>
                        <th className="bg-black/20 text-white/70 p-3 w-40">
                            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                            Email
                        </th>
                        <th className="bg-black/20 text-white/70 p-3 w-24">
                            <FontAwesomeIcon icon={faUserShield} className="mr-2" />
                            สิทธิ์
                        </th>
                        <th className="bg-black/20 text-white/70 p-3 w-32">สถานะ</th>
                        <th className="bg-black/20 text-white/70 p-3 w-32">จัดการ</th>
                    </tr>
                    </thead>

                    {/* ------ Table Body ------ */}
                    <tbody>
                    {users?.map((el, i) => (
                        <tr key={el.id} className="text-center hover:bg-black/30">
                            <th className="p-3">{i + 1}</th>
                            <td className="p-3">{el.email}</td>
                            <td className="p-3">
                                <div className="relative">
                                    <select
                                        onChange={(e) => usersStatusRole(el.id, e.target.value)}
                                        value={el.role}
                                        className="bg-black/25 text-white/50 p-2 rounded-lg pr-8 appearance-none"
                                    >
                                        <option value="user">
                                            User
                                        </option>
                                        <option value="admin">
                                             Admin
                                        </option>
                                    </select>
                                    <FontAwesomeIcon
                                        icon={el.role === "admin" ? faUserShield : faUser}
                                        className="absolute right-2 top-2 text-white"
                                    />
                                </div>
                            </td>

                            {/* Status Toggle */}
                            <td className="p-3">
                                {el.enabled ? (
                                    <span className="text-green-400 flex items-center justify-center gap-2">
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                        Active
                                    </span>
                                ) : (
                                    <span className="text-red-400 flex items-center justify-center gap-2">
                                        <FontAwesomeIcon icon={faTimesCircle} />
                                        Inactive
                                    </span>
                                )}
                            </td>

                            {/* Manage Button */}
                            <td className="p-3">
                                <button
                                    onClick={() => usersStatus(el.id, el.enabled)}
                                    className="bg-gray-700 text-white px-3 py-1 rounded shadow hover:bg-gray-600 transition flex items-center justify-center gap-2 w-full"
                                >
                                    <FontAwesomeIcon icon={el.enabled ? faToggleOff : faToggleOn} />
                                    {el.enabled ? "Disable" : "Enable"}
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TableUsers;
