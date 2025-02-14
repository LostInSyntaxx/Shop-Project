import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const LoadingToRedirect = () => {
    const [count, setCount] = useState(10);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const hasVisited = localStorage.getItem('hasVisitedRedirectPage');
        if (hasVisited) {
            setRedirect(true);
            return;
        }

        // ถ้ายังไม่เคยเข้ามา ให้ตั้งค่า Local Storage และเริ่มนับถอยหลัง
        localStorage.setItem('hasVisitedRedirectPage', 'true');

        const interval = setInterval(() => {
            setCount((currentCount) => {
                if (currentCount === 1) {
                    clearInterval(interval);
                    setRedirect(true);
                }
                return currentCount - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-gray-900 to-black">
            <div className="bg-[#101010] p-8 rounded-2xl shadow-2xl max-w-md w-full text-center">
                <h2 className="text-3xl font-bold text-white mb-6">No Permission</h2>
                <p className="text-white/80 mb-6">You do not have permission to access this page.</p>
                <div className="flex justify-center items-center space-x-2">
                    <span className="text-white">Redirecting in</span>
                    <span className="text-2xl font-bold text-primary">{count}</span>
                    <span className="text-white">seconds...</span>
                </div>
                <div className="mt-6">
                    <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden relative">
                        <div
                            className="h-3 rounded-full"
                            style={{
                                width: `${((10 - count) / 10) * 100}%`,
                                background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)',
                                backgroundSize: '200% 200%',
                                animation: 'progress 2s linear infinite',
                            }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-bold text-white">
                                {((10 - count) / 10) * 100}%
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <style>
                {`
                    @keyframes progress {
                        0% {
                            background-position: 0% 50%;
                        }
                        50% {
                            background-position: 100% 50%;
                        }
                        100% {
                            background-position: 0% 50%;
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default LoadingToRedirect;