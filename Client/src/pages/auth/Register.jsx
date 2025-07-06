import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
    faEnvelope, 
    faLock, 
    faEye, 
    faEyeSlash, 
    faUserPlus, 
    faCheckCircle, 
    faUser, 
    faArrowLeft 
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import ReCAPTCHA from "react-google-recaptcha";
import AOS from "aos";
import "aos/dist/aos.css";

const passwordSchema = z
    .string()
    .min(6, { message: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" })
    .refine((value) => (value.match(/[!@#$%^&*()_+{}[\]:;<>,.?~]/g) || []).length >= 2, {
        message: "รหัสผ่านต้องมีอักขระพิเศษอย่างน้อย 2 ตัว (!@#$%^&*)",
    });

const schema = z
    .object({
        username: z.string()
            .min(3, { message: "Username ต้องมีอย่างน้อย 3 ตัวอักษร" })
            .max(20, { message: "Username ต้องไม่เกิน 20 ตัวอักษร" })
            .regex(/^[a-zA-Z0-9_]+$/, { message: "Username ต้องประกอบด้วยตัวอักษร ตัวเลข หรือ _ เท่านั้น" }),
        email: z.string().email({ message: "กรุณากรอกอีเมลที่ถูกต้อง" }),
        password: passwordSchema,
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "รหัสผ่านไม่ตรงกัน",
        path: ["confirmPassword"],
    });

const Register = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isHovering, setIsHovering] = useState(null);
    const recaptchaRef = useRef(null);

    useEffect(() => {
        AOS.init({ duration: 800, easing: "ease-in-out", once: true });
    }, []);

    const onSubmit = async (data) => {
        const recaptchaValue = recaptchaRef.current?.getValue();
        if (!recaptchaValue) {
            Swal.fire({
                title: "โปรดยืนยันตัวตน",
                text: "กรุณายืนยันว่าคุณไม่ใช่บอท",
                icon: "warning",
                background: "#1a1a1a",
                color: "#fff",
                confirmButtonColor: "#3b82f6",
                backdrop: `
                    rgba(0,0,0,0.8)
                    url("/images/nyan-cat.gif")
                    left top
                    no-repeat
                `
            });
            return;
        }

        try {
            await axios.post("http://localhost:3000/api/register", {
                ...data,
                recaptcha: recaptchaValue,
            });

            await Swal.fire({
                title: "สมัครสมาชิกสำเร็จ!",
                text: "กำลังนำคุณไปยังหน้าเข้าสู่ระบบ",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
                background: "#1a1a1a",
                color: "#fff",
                timerProgressBar: true,
                willClose: () => navigate("/login")
            });
        } catch (err) {
            Swal.fire({
                title: "เกิดข้อผิดพลาด!",
                text: err.response?.data?.message || "กรุณาลองใหม่อีกครั้ง",
                icon: "error",
                background: "#1a1a1a",
                color: "#fff",
                confirmButtonColor: "#3b82f6"
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] to-[#121212] p-4">
            {/* Back Button */}
            <Link 
                to="/" 
                className="absolute top-6 left-6 text-white/70 hover:text-white transition-all flex items-center gap-3 group"
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

            {/* Main Container */}
            <div className="w-full max-w-5xl mx-auto">
                <div className="bg-[#242424] rounded-3xl shadow-2xl overflow-hidden border border-white/10 backdrop-blur-sm">
                    <div className="flex flex-col md:flex-row min-h-[700px]">
                        {/* Left Section - Welcome */}
                        <div className="md:w-2/5 p-8 md:p-12 bg-gradient-to-br from-[#1a1a1a]/80 to-[#242424]/80 flex flex-col justify-center relative overflow-hidden">
                            {/* Animated Background Elements */}
                            <div className="absolute inset-0 overflow-hidden opacity-10">
                                <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-20 -translate-y-20 animate-float"></div>
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16 animate-float-delay"></div>
                            </div>

                            <div className="relative z-10 text-center md:text-left">
                                <div 
                                    className="inline-block p-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-sm mb-6 transition-all duration-300 hover:scale-105"
                                    onMouseEnter={() => setIsHovering('icon')}
                                    onMouseLeave={() => setIsHovering(null)}
                                >
                                    <FontAwesomeIcon 
                                        icon={faUserPlus} 
                                        className={`text-4xl text-white transition-transform ${isHovering === 'icon' ? 'rotate-[-10deg]' : ''}`} 
                                    />
                                </div>
                                <h1 className="text-3xl font-bold text-white mb-4">สร้างบัญชีใหม่</h1>
                                <p className="text-white/60 mb-8">เข้าร่วมชุมชนของเราเพื่อประสบการณ์ที่ดียิ่งขึ้น</p>
                                
                                <div className="mt-8 pt-8 border-t border-white/20">
                                    <p className="text-white/70 mb-4">มีบัญชีอยู่แล้ว?</p>
                                    <Link
                                        to="/login"
                                        className="inline-flex items-center px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-medium transition-all duration-300 hover:scale-105 group"
                                        onMouseEnter={() => setIsHovering('login')}
                                        onMouseLeave={() => setIsHovering(null)}
                                    >
                                        <span>เข้าสู่ระบบ</span>
                                        <FontAwesomeIcon 
                                            icon={faCheckCircle} 
                                            className={`ml-2 transition-transform ${isHovering === 'login' ? 'translate-x-1' : ''}`} 
                                        />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Form */}
                        <div className="md:w-3/5 p-8 md:p-12 bg-[#242424]">
                            <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto space-y-6">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">สมัครสมาชิก</h2>
                                    <p className="text-white/60">กรอกข้อมูลเพื่อสร้างบัญชีใหม่</p>
                                </div>

                                {/* Username Field */}
                                <div className="space-y-2">
                                    <label className="text-white/80 block text-sm font-medium">ชื่อผู้ใช้</label>
                                    <div className="relative group">
                                        <FontAwesomeIcon 
                                            icon={faUser}
                                            className="absolute left-3 top-3 text-white/50 group-focus-within:text-blue-500 transition-colors"
                                        />
                                        <input
                                            {...register("username")}
                                            className="w-full py-3 pl-10 pr-4 rounded-xl bg-white/5 text-white border border-white/10 
                                                     hover:border-white/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                                                     outline-none transition-all placeholder:text-white/30"
                                            placeholder="ชื่อผู้ใช้ของคุณ"
                                        />
                                        {errors.username && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.username.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="text-white/80 block text-sm font-medium">อีเมล</label>
                                    <div className="relative group">
                                        <FontAwesomeIcon 
                                            icon={faEnvelope}
                                            className="absolute left-3 top-3 text-white/50 group-focus-within:text-blue-500 transition-colors"
                                        />
                                        <input
                                            {...register("email")}
                                            className="w-full py-3 pl-10 pr-4 rounded-xl bg-white/5 text-white border border-white/10 
                                                     hover:border-white/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                                                     outline-none transition-all placeholder:text-white/30"
                                            type="email"
                                            placeholder="example@email.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.email.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Password Fields */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Password */}
                                    <div className="space-y-2">
                                        <label className="text-white/80 block text-sm font-medium">รหัสผ่าน</label>
                                        <div className="relative group">
                                            <FontAwesomeIcon 
                                                icon={faLock}
                                                className="absolute left-3 top-3 text-white/50 group-focus-within:text-blue-500 transition-colors"
                                            />
                                            <input
                                                {...register("password")}
                                                type={showPassword ? "text" : "password"}
                                                className="w-full py-3 pl-10 pr-10 rounded-xl bg-white/5 text-white border border-white/10 
                                                         hover:border-white/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                                                         outline-none transition-all placeholder:text-white/30"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-3 text-white/50 hover:text-white/80 transition-colors"
                                                aria-label={showPassword ? "Hide password" : "Show password"}
                                            >
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.password.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="space-y-2">
                                        <label className="text-white/80 block text-sm font-medium">ยืนยันรหัสผ่าน</label>
                                        <div className="relative group">
                                            <FontAwesomeIcon 
                                                icon={faLock}
                                                className="absolute left-3 top-3 text-white/50 group-focus-within:text-blue-500 transition-colors"
                                            />
                                            <input
                                                {...register("confirmPassword")}
                                                type={showConfirmPassword ? "text" : "password"}
                                                className="w-full py-3 pl-10 pr-10 rounded-xl bg-white/5 text-white border border-white/10 
                                                         hover:border-white/30 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 
                                                         outline-none transition-all placeholder:text-white/30"
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-3 text-white/50 hover:text-white/80 transition-colors"
                                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                            >
                                                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                                {errors.confirmPassword.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Password Requirements */}
                                <div className="p-4 bg-[#1a1a1a]/50 rounded-xl border border-white/10">
                                    <h4 className="text-white/80 text-sm font-medium mb-2">ข้อกำหนดรหัสผ่าน:</h4>
                                    <ul className="text-white/60 text-sm space-y-1">
                                        <li className={`flex items-center gap-2 ${watch('password')?.length >= 6 ? 'text-green-400' : ''}`}>
                                            {watch('password')?.length >= 6 ? (
                                                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            อย่างน้อย 6 ตัวอักษร
                                        </li>
                                        <li className={`flex items-center gap-2 ${(watch('password')?.match(/[!@#$%^&*()_+{}[\]:;<>,.?~]/g) || []).length >= 2 ? 'text-green-400' : ''}`}>
                                            {(watch('password')?.match(/[!@#$%^&*()_+{}[\]:;<>,.?~]/g) || []).length >= 2 ? (
                                                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            อักขระพิเศษอย่างน้อย 2 ตัว
                                        </li>
                                        <li className={`flex items-center gap-2 ${watch('password') && watch('confirmPassword') && watch('password') === watch('confirmPassword') ? 'text-green-400' : ''}`}>
                                            {watch('password') && watch('confirmPassword') && watch('password') === watch('confirmPassword') ? (
                                                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                            รหัสผ่านตรงกัน
                                        </li>
                                    </ul>
                                </div>

                                {/* ReCAPTCHA */}
                                <div className="flex justify-center py-2">
                                    <ReCAPTCHA
                                        ref={recaptchaRef}
                                        sitekey="6LeOa9cqAAAAAJ_1VheX_CXbOwzc-PEWWEk-f6Ca"
                                        theme="dark"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className={`w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 
                                             text-white transition-all duration-300 font-medium disabled:opacity-50
                                             flex items-center justify-center gap-2 shadow-md hover:shadow-lg
                                             ${isHovering === 'submit' && !isSubmitting ? 'scale-[1.02] from-blue-600 to-blue-700' : ''}`}
                                    onMouseEnter={() => setIsHovering('submit')}
                                    onMouseLeave={() => setIsHovering(null)}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                                            <span>กำลังดำเนินการ...</span>
                                        </>
                                    ) : (
                                        <>
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                            <span>สมัครสมาชิก</span>
                                        </>
                                    )}
                                </button>
                            </form>
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

export default Register;