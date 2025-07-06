import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import useShopStore from "../../store/shop-store.jsx";

export default function DiscordCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const setTokenAndFetchUser = useShopStore((state) => state.setTokenAndFetchUser);

  // ✅ สร้าง Toast instance
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      setTokenAndFetchUser(token)
        .then((user) => {
          Toast.fire({
            icon: "success",
            title: `ยินดีต้อนรับ ${user.name || user.email}`
          });
          navigate("/");
        })
        .catch((err) => {
          console.error("Login error", err);
          Toast.fire({
            icon: "error",
            title: "เข้าสู่ระบบไม่สำเร็จ"
          });
          navigate("/login");
        });
    } else {
      Toast.fire({
        icon: "error",
        title: "ไม่พบ token"
      });
      navigate("/login");
    }
  }, []);
}
