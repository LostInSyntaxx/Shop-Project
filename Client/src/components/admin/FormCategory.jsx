import React, { useEffect, useState } from 'react';
import { createCategory, listCategory, removeCategory } from "../../Api/Main-Api.jsx";
import useShopStore from "../../store/shop-store.jsx";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrash, faMoon, faSun, faLayerGroup, faSpinner, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const FormCategory = () => {
    const token = useShopStore((state) => state.token);
    const [name, setName] = useState('');
    const categories = useShopStore((state) => state.categories);
    const getCategory = useShopStore((state) => state.getCategory);
    const [loading, setLoading] = useState(false);
    const [darkMode, setDarkMode] = useState(true);
    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        getCategory(token);
    }, []);

    const handleSelectCategory = (id) => {
        setSelectedCategories(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id) 
                : [...prev, id]
        );
    };

    const handleBulkDelete = async () => {
        if (selectedCategories.length === 0) {
            return Swal.fire({
                icon: "warning",
                title: "Please select categories to delete",
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#111827',
                customClass: {
                    popup: 'rounded-xl shadow-2xl'
                }
            });
        }

        const { isConfirmed } = await Swal.fire({
            title: "Confirm Deletion?",
            html: `Are you sure you want to delete <b>${selectedCategories.length}</b> categories?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            background: darkMode ? '#1F2937' : '#fff',
            color: darkMode ? '#fff' : '#111827',
            customClass: {
                popup: 'rounded-xl shadow-2xl',
                confirmButton: 'px-4 py-2 rounded-lg',
                cancelButton: 'px-4 py-2 rounded-lg'
            }
        });

        if (!isConfirmed) return;

        setLoading(true);
        try {
            await Promise.all(selectedCategories.map(id => removeCategory(token, id)));
            await Swal.fire({
                icon: "success",
                title: "Deleted!",
                html: `Successfully deleted <b>${selectedCategories.length}</b> categories`,
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#111827',
                customClass: {
                    popup: 'rounded-xl shadow-2xl'
                }
            });
            setSelectedCategories([]);
            getCategory(token);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Failed to delete categories",
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#111827',
                customClass: {
                    popup: 'rounded-xl shadow-2xl'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim()) {
            return Swal.fire({
                icon: "error",
                title: "Category name required!",
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#111827',
                customClass: {
                    popup: 'rounded-xl shadow-2xl'
                }
            });
        }

        setLoading(true);
        Swal.fire({
            title: "Adding category...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
            background: darkMode ? '#1F2937' : '#fff',
            color: darkMode ? '#fff' : '#111827',
            customClass: {
                popup: 'rounded-xl shadow-2xl'
            }
        });

        try {
            const res = await createCategory(token, { name });
            Swal.fire({
                icon: "success",
                title: "Success!",
                html: `Category <b>"${res.data.name}"</b> added successfully`,
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#111827',
                customClass: {
                    popup: 'rounded-xl shadow-2xl'
                }
            });
            setName("");
            getCategory(token);
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Failed to add category",
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#111827',
                customClass: {
                    popup: 'rounded-xl shadow-2xl'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id, categoryName) => {
        const { isConfirmed } = await Swal.fire({
            title: "Confirm Deletion?",
            html: `Are you sure you want to delete <b>"${categoryName}"</b>?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#6B7280",
            confirmButtonText: "Delete",
            cancelButtonText: "Cancel",
            background: darkMode ? '#1F2937' : '#fff',
            color: darkMode ? '#fff' : '#111827',
            customClass: {
                popup: 'rounded-xl shadow-2xl',
                confirmButton: 'px-4 py-2 rounded-lg',
                cancelButton: 'px-4 py-2 rounded-lg'
            }
        });

        if (!isConfirmed) return;

        try {
            await removeCategory(token, id);
            await Swal.fire({
                title: "Deleted!",
                html: `Category <b>"${categoryName}"</b> has been removed`,
                icon: "success",
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#111827',
                customClass: {
                    popup: 'rounded-xl shadow-2xl'
                }
            });
            getCategory(token);
        } catch (err) {
            Swal.fire({
                title: "Error!",
                text: "Failed to delete category",
                icon: "error",
                background: darkMode ? '#1F2937' : '#fff',
                color: darkMode ? '#fff' : '#111827',
                customClass: {
                    popup: 'rounded-xl shadow-2xl'
                }
            });
        }
    };

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        document.documentElement.classList.toggle('dark');
    };

    return (
        <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
            {/* Dark Mode Toggle */}
            <button
                onClick={toggleDarkMode}
                className={`fixed top-6 right-6 p-3 rounded-full z-50 ${
                    darkMode 
                        ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-yellow-300 shadow-lg hover:shadow-yellow-400/20' 
                        : 'bg-gradient-to-br from-gray-200 to-gray-300 text-gray-700 shadow-lg hover:shadow-gray-400/20'
                } hover:scale-110 transition-all duration-300`}
                aria-label="Toggle dark mode"
            >
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} size="lg" />
            </button>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                        darkMode 
                            ? 'bg-gradient-to-br from-blue-900 to-indigo-900 shadow-lg' 
                            : 'bg-gradient-to-br from-blue-100 to-indigo-100 shadow-lg'
                    }`}>
                        <FontAwesomeIcon 
                            icon={faLayerGroup} 
                            className={`text-3xl ${darkMode ? 'text-blue-300' : 'text-blue-600'}`} 
                        />
                    </div>
                    <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                        Category Management
                    </h1>
                    <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Add, edit or remove product categories
                    </p>
                </div>

                {/* Add Category Form */}
                <div className={`p-6 rounded-xl shadow-lg mb-8 transition-all duration-300 ${
                    darkMode 
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                        : 'bg-white border border-gray-200'
                }`}>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                                Category Name
                            </label>
                            <input
                                type="text"
                                className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:outline-none transition-all ${
                                    darkMode 
                                        ? 'bg-gray-700 border-gray-600 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400' 
                                        : 'bg-white border-gray-300 focus:ring-blue-400 focus:border-blue-400 text-gray-900 placeholder-gray-500'
                                }`}
                                placeholder="Enter category name..."
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all ${
                                loading 
                                    ? 'bg-blue-500 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                            } text-white shadow-md hover:shadow-lg`}
                        >
                            {loading ? (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
                                    <span>Adding...</span>
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faPlus} />
                                    <span>Add Category</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Bulk Delete Button */}
                {selectedCategories.length > 0 && (
                    <div className="flex justify-end mb-4">
                        <button
                            onClick={handleBulkDelete}
                            disabled={loading}
                            className={`py-2 px-4 rounded-lg font-medium flex items-center space-x-2 transition-all ${
                                loading 
                                    ? 'bg-red-500 cursor-not-allowed' 
                                    : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
                            } text-white shadow-md hover:shadow-lg`}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                            <span>Delete Selected ({selectedCategories.length})</span>
                        </button>
                    </div>
                )}

                {/* Categories List */}
                <div className={`rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
                    darkMode 
                        ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700' 
                        : 'bg-white border border-gray-200'
                }`}>
                    {categories.length === 0 ? (
                        <div className={`p-8 text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            <FontAwesomeIcon icon={faLayerGroup} className="text-3xl mb-3 opacity-50" />
                            <p className="text-lg">No categories yet</p>
                            <p className="text-sm mt-1">Add your first category using the form above</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-700">
                            {categories.map((item) => (
                                <li 
                                    key={item.id} 
                                    className={`p-4 hover:bg-opacity-50 transition-colors ${
                                        darkMode 
                                            ? 'hover:bg-gray-700' 
                                            : 'hover:bg-gray-100'
                                    } ${
                                        selectedCategories.includes(item.id) 
                                            ? darkMode 
                                                ? 'bg-blue-900/30' 
                                                : 'bg-blue-100' 
                                            : ''
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    className={`h-5 w-5 rounded transition-all ${
                                                        darkMode 
                                                            ? 'text-blue-500 bg-gray-700 border-gray-600 focus:ring-blue-500' 
                                                            : 'text-blue-600 bg-white border-gray-300 focus:ring-blue-400'
                                                    }`}
                                                    checked={selectedCategories.includes(item.id)}
                                                    onChange={() => handleSelectCategory(item.id)}
                                                />
                                            </label>
                                            <span className="text-lg font-medium">{item.name}</span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleRemove(item.id, item.name)}
                                                className={`py-2 px-3 rounded-md font-medium flex items-center space-x-2 transition-all ${
                                                    darkMode 
                                                        ? 'bg-gradient-to-br from-red-900/80 to-pink-900/80 hover:from-red-800/80 hover:to-pink-800/80 text-red-100' 
                                                        : 'bg-gradient-to-br from-red-100 to-pink-100 hover:from-red-200 hover:to-pink-200 text-red-800'
                                                } shadow-sm`}
                                            >
                                                <FontAwesomeIcon icon={faTrash} size="sm" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FormCategory;