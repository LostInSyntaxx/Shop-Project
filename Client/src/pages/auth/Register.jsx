import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReCAPTCHA from 'react-google-recaptcha';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faLock, faEye, faEyeSlash, faUserPlus, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import AOS from "aos";
import "aos/dist/aos.css"; // Import CSS ของ AOS

const Register = () => {
    const [form, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const recaptchaRef = useRef(null);

    // ใช้ AOS เมื่อ component โหลด
    useEffect(() => {
        AOS.init({
            duration: 800, // ระยะเวลาการเล่น animation (มิลลิวินาที)
            easing: "ease-in-out", // รูปแบบการเคลื่อนไหว
            once: true, // เล่น animation แค่ครั้งเดียว
        });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-black">
            <div
                className="bg-[#101010] p-8 rounded-2xl shadow-2xl max-w-md w-full"
                data-aos="fade-up"
            >
                <h2 className="text-3xl font-bold text-center mb-6 text-white">สมัครสมาชิก</h2>

                {error && (
                    <div className="alert alert-error mb-6">
                        <span>{error}</span>
                    </div>
                )}

                <form className="space-y-6">

                    {/* Email Input */}
                    <div className="relative" data-aos="fade-right">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-3 top-3 text-white/50" />
                        <input
                            className="w-full py-2 pl-10 pr-3 rounded-xl bg-white/10 text-white border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative" data-aos="fade-left">
                        <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-white/50" />
                        <input
                            className="w-full py-2 pl-10 pr-10 rounded-xl bg-white/10 text-white border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2.5 text-white/50"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="relative" data-aos="fade-left">
                        <FontAwesomeIcon icon={faLock} className="absolute left-3 top-3 text-white/50" />
                        <input
                            className="w-full py-2 pl-10 pr-10 rounded-xl bg-white/10 text-white border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                            name="confirmPassword"
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-2.5 text-white/50"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                        </button>
                    </div>

                    {/* reCAPTCHA */}
                    <div className="flex justify-center" data-aos="zoom-in">
                        <ReCAPTCHA ref={recaptchaRef} sitekey="6LeOa9cqAAAAAJ_1VheX_CXbOwzc-PEWWEk-f6Ca" />
                    </div>

                    {/* Register Button */}
                    <button
                        className="w-full py-2 px-5 rounded-xl bg-white/20 text-white hover:bg-white/30 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        type="submit"
                        disabled={isLoading}
                        data-aos="fade-up"
                    >
                        {isLoading ? (
                            <span>กำลังดำเนินการ...</span>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faUserPlus} />
                                สมัครสมาชิก
                            </>
                        )}
                    </button>

                    <p className="text-center text-white/70 my-3">หรือ</p>

                    {/* Login Button */}
                    <a
                        href="/login"
                        className="block w-full py-2 px-5 rounded-xl bg-white/10 text-white text-center hover:bg-white/20 hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                        data-aos="fade-up"
                    >
                        <FontAwesomeIcon icon={faSignInAlt} />
                        ฉันมีบัญชีอยู่แล้ว?
                    </a>
                </form>
            </div>
        </div>
    );
};

export default Register;
