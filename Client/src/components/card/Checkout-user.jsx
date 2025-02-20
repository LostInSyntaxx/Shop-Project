import React, { useEffect, useState } from "react";
import { listUserApi, saveAddress } from "../../Api/api-user.jsx";
import useShopStore from "../../store/shop-store.jsx";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

// Import FontAwesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faHome,
    faBox,
    faCartArrowDown,
    faMoneyBillWave,
    faCreditCard
} from "@fortawesome/free-solid-svg-icons";

const CheckoutUser = () => {
    const token = useShopStore((s) => s.token);
    const [products, setProducts] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);

    const [address, setAddress] = useState("");
    const [addressSaved, setAddressSaved] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        hdlGetUserCart(token);
    }, []);

    const hdlGetUserCart = (token) => {
        listUserApi(token)
            .then((res) => {
                setProducts(res.data.products);
                setCartTotal(res.data.cartTotal);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // ✅ SweetAlert2 Notification Function
    const showSwal = (icon, title, text) => {
        Swal.fire({
            icon: icon,
            title: title,
            text: text,
            timer: 3000,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
            background: "#1e1e1e",
            color: "#fff"
        });
    };

    const hdSaveAddress = () => {
        if (!address) {
            showSwal("error", "❌ กรุณากรอกที่อยู่!", "กรุณากรอกที่อยู่ก่อนบันทึก");
            return;
        }
        saveAddress(token, address)
            .then((res) => {
                setAddressSaved(true);
                showSwal("success", "ที่อยู่ถูกบันทึกเรียบร้อย!", "คุณสามารถดำเนินการชำระเงินได้");
            })
            .catch((err) => {
                showSwal("error", "บันทึกที่อยู่ล้มเหลว!", "โปรดลองอีกครั้ง");
                console.log(err);
            });
    };

    const GoToQrCode = () => {
        if (!addressSaved) {
            showSwal("warning", "กรุณาบันทึกที่อยู่!", "คุณต้องบันทึกที่อยู่ก่อนชำระเงิน");
            return;
        }
        navigate("/user/payment");
    };

    return (
        <div className="mx-auto p-6 flex gap-6">
            {/* Left Section (ที่อยู่การจัดส่ง) */}
            <div className="w-2/3">
                <div className="bg-black/25 p-6 rounded-lg shadow-lg space-y-4">
                    <h2 className="text-lg font-semibold">
                        <FontAwesomeIcon icon={faHome} className="mr-2 text-blue-400" /> ที่อยู่การจัดส่ง
                    </h2>
                    <textarea
                        required
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="กรุณากรอกที่อยู่"
                        className="w-full p-3 rounded-lg border border-gray-500 bg-black/40 text-white"
                    />
                    <button
                        onClick={hdSaveAddress}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-transform"
                    >
                        Save Address
                    </button>
                </div>
            </div>

            {/* Right Section (คำสั่งสินค้าของคุณ) */}
            <div className="w-1/3 flex justify-end">
                <div className="bg-black/25 rounded-2xl p-6 space-y-4 shadow-lg w-full">
                    <h2 className="text-lg font-bold">
                        <FontAwesomeIcon icon={faCartArrowDown} className="mr-2 text-green-400" /> คำสั่งสินค้าของคุณ
                    </h2>

                    {/* Product List */}
                    {products.map((item, index) => (
                        <div key={index} className="flex justify-between items-end border-b pb-2 mb-2">
                            <div>
                                <p className="font-semibold">
                                    <FontAwesomeIcon icon={faBox} className="mr-2 text-yellow-400" /> {item.product.title}
                                </p>
                                <p className="text-sm">
                                    จำนวน: {item.count} x {item.product.price.toLocaleString()} ฿
                                </p>
                            </div>
                            <p className="text-red-500 font-bold">{(item.count * item.product.price).toLocaleString()} ฿</p>
                        </div>
                    ))}

                    {/* Summary */}
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <p className="text-gray-400">🚚 ค่าจัดส่ง</p>
                            <p>0.00 ฿</p>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-gray-400">🎟️ ส่วนลด</p>
                            <p>0.00 ฿</p>
                        </div>
                    </div>
                    <hr className="border-gray-600" />

                    {/* Total Price */}
                    <div className="flex justify-between text-lg font-semibold">
                        <p><FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-yellow-500" /> ยอดรวมสุทธิ</p>
                        <p className="text-red-500">{cartTotal.toLocaleString()} ฿</p>
                    </div>
                    <hr className="border-gray-600" />

                    {/* Checkout Button */}
                    <button
                        onClick={GoToQrCode}
                        className="bg-green-500 w-full p-3 rounded-lg text-white font-bold hover:bg-green-700 transition-all"
                    >
                        <FontAwesomeIcon icon={faCreditCard} className="mr-2" /> ดำเนินการชำระเงิน
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CheckoutUser;
