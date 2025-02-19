import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import ReCAPTCHA from 'react-google-recaptcha';

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
    const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State for button cooldown
    const [countdown, setCountdown] = useState(0); // Countdown timer
    const recaptchaRef = useRef(null); // Ref for reCAPTCHA

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(form.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        // Validate password match
        if (form.password !== form.confirmPassword) {
            // Show SweetAlert2 error for password mismatch
            Swal.fire({
                icon: 'error',
                title: 'Password Mismatch',
                text: 'Passwords do not match. Please try again.',
                confirmButtonText: 'OK',
            });
            return;
        }

        // Validate reCAPTCHA
        const recaptchaValue = recaptchaRef.current.getValue();
        if (!recaptchaValue) {
            setError('Please complete the reCAPTCHA.');
            return;
        }

        // Clear error if validation passes
        setError('');
        setIsLoading(true);
        setIsButtonDisabled(true); // Disable the button
        setCountdown(15); // Start countdown

        try {
            // Send reCAPTCHA token to the server for verification
            const res = await axios.post('http://localhost:3000/api/register', {
                ...form,
                recaptcha: recaptchaValue,
            });
            console.log(res.data);

            // Show success alert with auto-close after 5 seconds
            Swal.fire({
                icon: 'success',
                title: 'Registration Successful!',
                text: 'You have successfully registered.',
                confirmButtonText: 'OK',
                timer: 5000, // Auto-close after 5 seconds
                timerProgressBar: true, // Show progress bar
            }).then(() => {
                // Redirect to login page or clear form
                setForm({ email: '', password: '', confirmPassword: '' });
                recaptchaRef.current.reset(); // Reset reCAPTCHA
            });
        } catch (err) {
            console.error(err);
            setError(err.response?.data.message || 'Registration failed. Please try again.');

            // Show error alert with auto-close after 5 seconds
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                text: err.response?.data.message || 'Something went wrong. Please try again.',
                confirmButtonText: 'OK',
                timer: 5000, // Auto-close after 5 seconds
                timerProgressBar: true, // Show progress bar
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Countdown timer effect
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setIsButtonDisabled(false); // Enable the button after countdown
        }
    }, [countdown]);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-black">
            <div className="bg-[#101010] p-8 rounded-2xl shadow-2xl max-w-md w-full">
                <h2 className="text-3xl font-bold text-center mb-6 text-white">สมัครสมาชิก </h2>

                {/* Error Alert */}
                {error && (
                    <div className="alert alert-error mb-6">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Email</label>
                        <input
                            className="w-full py-2 px-3 rounded-xl bg-white/10 text-white border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Password</label>
                        <div className="relative">
                            <input
                                className="w-full py-2 px-3 rounded-xl bg-white/10 text-white border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-white mb-2">Confirm Password</label>
                        <div className="relative">
                            <input
                                className="w-full py-2 px-3 rounded-xl bg-white/10 text-white border border-white/10 hover:border-white/20 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm your password"
                                value={form.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                onClick={toggleConfirmPasswordVisibility}
                            >
                                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-center">
                        <ReCAPTCHA
                            ref={recaptchaRef}
                            sitekey="6LeOa9cqAAAAAJ_1VheX_CXbOwzc-PEWWEk-f6Ca"
                        />
                    </div>
                    <button
                        className="w-full py-2 px-5 rounded-xl bg-white/20 text-white hover:bg-white/30 hover:shadow-lg transition-all duration-200 flex items-center justify-center"
                        type="submit"
                        disabled={isLoading || isButtonDisabled}
                    >
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin h-5 w-5 mr-3 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Processing...
                            </>
                        ) : isButtonDisabled ? (
                            `Please wait ${countdown} seconds`
                        ) : (
                            'สมัครสมาชิก'
                        )}
                    </button>
                    <p className="text-center text-white/70 my-3">หรือ</p>
                    <a
                        href="/login"
                        className="block w-full py-2 px-5 rounded-xl bg-white/10 text-white text-center hover:bg-white/20 hover:shadow-lg transition-all duration-200"
                    >
                        ฉันมีบัญชีอยู่แล้ว?
                    </a>
                </form>
            </div>
        </div>
    );
};

export default Register;