import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import useShopStore from "../../store/shop-store.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLock,
  faSignInAlt,
  faUserPlus,
  faEye,
  faEyeSlash,
  faUser,
  faArrowLeft,
  faCheck,
} from "@fortawesome/free-solid-svg-icons";
import { faDiscord, faGoogle } from "@fortawesome/free-brands-svg-icons";
import AOS from "aos";
import "aos/dist/aos.css";

const Login = () => {
  const navigate = useNavigate();
  const actionLogin = useShopStore((state) => state.actionLogin);
  const [form, setForm] = useState({ emailOrUsername: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isHovering, setIsHovering] = useState(null);

  const DISCORD_OAUTH_URL = "http://localhost:3000/api/discord";
  const GOOGLE_OAUTH_URL = "http://localhost:3000/api/google";

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    // Check for saved credentials if "remember me" was checked previously
    const savedCredentials = localStorage.getItem('rememberedCredentials');
    if (savedCredentials) {
      const { emailOrUsername, password } = JSON.parse(savedCredentials);
      setForm({ emailOrUsername, password });
      setRememberMe(true);
    }
  }, []);

  const handleOnChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (rememberMe) {
      localStorage.setItem('rememberedCredentials', JSON.stringify(form));
    } else {
      localStorage.removeItem('rememberedCredentials');
    }

    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const res = await actionLogin(form);
      const role = res.data.payload.role;

      Swal.fire({
        title: "เข้าสู่ระบบสำเร็จ!",
        text: "ยินดีต้อนรับกลับมา!",
        icon: "success",
        background: "#1a1a1a",
        color: "#fff",
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        if (role === "admin") navigate("/admin");
        else navigate("/");
      }, 1500);
    } catch (err) {
      Swal.fire({
        title: "เกิดข้อผิดพลาด!",
        text: err.response?.data?.message || err.message,
        icon: "error",
        background: "#1a1a1a",
        color: "#fff",
        confirmButtonColor: "#3b82f6"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1a1a] to-[#121212] flex items-center justify-center p-4">
      {/* Back Button */}
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="flex items-center gap-3 text-white/70 hover:text-white transition-all group"
          onMouseEnter={() => setIsHovering('back')}
          onMouseLeave={() => setIsHovering(null)}
        >
          <div className={`w-10 h-10 rounded-xl ${isHovering === 'back' ? 'bg-white/20' : 'bg-white/10'} flex items-center justify-center transition-all duration-300 group-hover:scale-110`}>
            <FontAwesomeIcon 
              icon={faArrowLeft} 
              className={`transition-transform ${isHovering === 'back' ? 'translate-x-[-2px]' : ''}`} 
            />
          </div>
          <span className="hidden sm:block">กลับหน้าหลัก</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-[#242424] rounded-3xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-sm">
          <div className="flex flex-col lg:flex-row min-h-[700px]">
            {/* Left Side - Welcome Section */}
            <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden bg-gradient-to-br from-[#1a1a1a]/80 to-[#242424]/80">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 overflow-hidden opacity-10">
                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20 animate-float"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16 animate-float-delay"></div>
              </div>

              <div className="relative z-10 text-center lg:text-left">
                <div 
                  className="inline-block p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm mb-6 transition-all duration-300 hover:scale-105"
                  onMouseEnter={() => setIsHovering('icon')}
                  onMouseLeave={() => setIsHovering(null)}
                >
                  <FontAwesomeIcon 
                    icon={faSignInAlt} 
                    className={`text-4xl lg:text-5xl text-white transition-transform ${isHovering === 'icon' ? 'rotate-[-10deg]' : ''}`} 
                  />
                </div>

                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4">
                  ยินดีต้อนรับกลับมา
                </h1>
                <p className="text-white/60 mb-8">กรุณาเข้าสู่ระบบเพื่อเข้าถึงบัญชีของคุณ</p>
                
                <div className="mt-8 pt-8 border-t border-white/20">
                  <p className="text-white/70 mb-4">ยังไม่มีบัญชี?</p>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium transition-all duration-300 hover:scale-105 group"
                    onMouseEnter={() => setIsHovering('register')}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    <span>สมัครสมาชิก</span>
                    <FontAwesomeIcon 
                      icon={faUserPlus} 
                      className={`ml-2 transition-transform ${isHovering === 'register' ? 'translate-x-1' : ''}`} 
                    />
                  </Link>
                </div>
              </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="lg:w-3/5 p-8 lg:p-12 bg-[#242424]">
              <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบ</h2>
                  <p className="text-white/60">เลือกวิธีการเข้าสู่ระบบที่คุณต้องการ</p>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-4" data-aos="fade-up" data-aos-delay="100">
                  <button
                    onClick={() => window.location.href = GOOGLE_OAUTH_URL}
                    className={`w-full py-3 px-6 rounded-xl bg-white/90 hover:bg-white text-gray-800 
                             flex items-center justify-center gap-3 transition-all duration-300 
                             font-medium border border-white/20 shadow-md hover:shadow-lg
                             ${isHovering === 'google' ? 'scale-[1.02]' : ''}`}
                    onMouseEnter={() => setIsHovering('google')}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    <FontAwesomeIcon icon={faGoogle} className="text-xl" />
                    <span>เข้าสู่ระบบด้วย Google</span>
                  </button>

                  <button
                    onClick={() => window.location.href = DISCORD_OAUTH_URL}
                    className={`w-full py-3 px-6 rounded-xl bg-[#5865F2]/90 hover:bg-[#5865F2] text-white 
                             flex items-center justify-center gap-3 transition-all duration-300 
                             font-medium border border-[#5865F2]/20 shadow-md hover:shadow-lg
                             ${isHovering === 'discord' ? 'scale-[1.02]' : ''}`}
                    onMouseEnter={() => setIsHovering('discord')}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    <FontAwesomeIcon icon={faDiscord} className="text-xl" />
                    <span>เข้าสู่ระบบด้วย Discord</span>
                  </button>
                </div>

                <div className="flex items-center my-8">
                  <div className="flex-1 border-t border-white/20"></div>
                  <span className="px-4 text-white/60 text-sm">หรือใช้บัญชีของคุณ</span>
                  <div className="flex-1 border-t border-white/20"></div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Email/Username Input */}
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">อีเมลหรือชื่อผู้ใช้</label>
                    <div className="relative group">
                      <FontAwesomeIcon
                        icon={faUser}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-500 transition-colors"
                      />
                      <input
                        className="w-full py-3 pl-12 pr-4 rounded-xl bg-white/5 text-white border border-white/10 
                                 hover:border-white/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                                 outline-none transition-all duration-300 placeholder:text-white/30"
                        name="emailOrUsername"
                        type="text"
                        placeholder="กรอกอีเมลหรือชื่อผู้ใช้"
                        value={form.emailOrUsername}
                        onChange={handleOnChange}
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2">
                    <label className="text-white/80 text-sm font-medium">รหัสผ่าน</label>
                    <div className="relative group">
                      <FontAwesomeIcon
                        icon={faLock}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-blue-500 transition-colors"
                      />
                      <input
                        className="w-full py-3 pl-12 pr-14 rounded-xl bg-white/5 text-white border border-white/10 
                                 hover:border-white/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                                 outline-none transition-all duration-300 placeholder:text-white/30"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="กรอกรหัสผ่าน"
                        value={form.password}
                        onChange={handleOnChange}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setRememberMe(!rememberMe)}
                        className={`w-5 h-5 rounded flex items-center justify-center transition-all duration-200
                                 ${rememberMe ? 'bg-blue-500 border-blue-500' : 'border-2 border-white/40 hover:border-white/60'}`}
                        aria-checked={rememberMe}
                        role="checkbox"
                      >
                        {rememberMe && <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />}
                      </button>
                      <span className="text-white/70 text-sm">จดจำฉัน</span>
                    </div>

                    <Link
                      to="/forgot-password"
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                      onMouseEnter={() => setIsHovering('forgot')}
                      onMouseLeave={() => setIsHovering(null)}
                    >
                      ลืมรหัสผ่าน?
                    </Link>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 
                             hover:from-blue-600 hover:to-blue-700 text-white transition-all duration-300 
                             font-medium disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center justify-center gap-3 shadow-md hover:shadow-lg
                             ${isHovering === 'login' && !isLoading ? 'scale-[1.02]' : ''}`}
                    onMouseEnter={() => setIsHovering('login')}
                    onMouseLeave={() => setIsHovering(null)}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        <span>กำลังเข้าสู่ระบบ...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSignInAlt} />
                        <span>เข้าสู่ระบบ</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-10px) translateX(5px); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
        .animate-float-delay {
          animation: float 8s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
};

export default Login;