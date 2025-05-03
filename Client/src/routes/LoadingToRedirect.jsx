import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faClock, faHome } from '@fortawesome/free-solid-svg-icons';

const LoadingToRedirect = () => {
    const [count, setCount] = useState(10);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-4">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/80 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700/50 max-w-md w-full text-center">
                {/* Icon Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r from-red-500/20 to-amber-500/20">
                        <FontAwesomeIcon 
                            icon={faLock} 
                            className="text-3xl text-red-400" 
                        />
                    </div>
                </div>

                {/* Main Message */}
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 to-amber-500 bg-clip-text text-transparent mb-3">
                    Access Denied
                </h2>
                <p className="text-gray-300 mb-6">
                    You don't have permission to access this page
                </p>

                {/* Countdown Timer */}
                <div className="flex justify-center items-center gap-2 mb-6">
                    <FontAwesomeIcon icon={faClock} className="text-amber-400" />
                    <span className="text-gray-300">Redirecting in</span>
                    <span className="text-2xl font-bold text-white bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">
                        {count}
                    </span>
                    <span className="text-gray-300">seconds</span>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-gray-700/50 h-3 rounded-full overflow-hidden mb-2">
                    <div
                        className="h-full rounded-full relative"
                        style={{
                            width: `${((10 - count) / 10) * 100}%`,
                            background: 'linear-gradient(90deg, #f59e0b, #ef4444)',
                            transition: 'width 1s ease-out',
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-red-500/30 animate-pulse"></div>
                    </div>
                </div>

                {/* Percentage Indicator */}
                <div className="text-xs text-gray-400 mb-8">
                    {100 - (count * 10)}% complete
                </div>

                {/* Home Button (Early Redirect) */}
                <button
                    onClick={() => setRedirect(true)}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gray-700/50 to-gray-800/50 hover:from-gray-700/70 hover:to-gray-800/70 text-gray-300 border border-gray-700 hover:border-gray-600 transition-all"
                >
                    <FontAwesomeIcon icon={faHome} />
                    Return Home Now
                </button>
            </div>
        </div>
    );
};

export default LoadingToRedirect;