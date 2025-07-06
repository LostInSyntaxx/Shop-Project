import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useShopStore from "../../store/shop-store.jsx";
import Swal from "sweetalert2";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const setTokenAndFetchUser = useShopStore((state) => state.setTokenAndFetchUser);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      setTokenAndFetchUser(token)
        .then(() => {            
          Swal.fire("เข้าสู่ระบบสำเร็จ", "ยินดีต้อนรับ!", "success");
          navigate("/");
        })
        .catch(() => {
          Swal.fire("เกิดข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลผู้ใช้", "error");
          navigate("/login");
        });
    } else {
      Swal.fire("เกิดข้อผิดพลาด", "ไม่พบ token", "error");
      navigate("/login");
    }
  }, []);
}
