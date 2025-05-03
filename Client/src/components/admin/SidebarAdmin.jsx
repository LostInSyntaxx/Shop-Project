import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartPie,
  faWrench,
  faTags,
  faBox,
  faClipboardList,
  faRightFromBracket,
  faBars,
  faTimes,
  faUserCog,
  faCog,
  faMoon,
  faSun,
  faChevronRight,
  faChevronLeft
} from "@fortawesome/free-solid-svg-icons";
import AOS from "aos";
import "aos/dist/aos.css";

const SidebarAdmin = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [hoveredItem, setHoveredItem] = useState(null);
  const location = useLocation();

  useEffect(() => {
    AOS.init({ 
      duration: 500, 
      offset: 100, 
      easing: "ease-in-out",
      once: true
    });
    
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { path: "/admin", icon: faChartPie, label: "Dashboard", delay: "0" },
    { path: "manage", icon: faWrench, label: "Manage", delay: "100" },
    { path: "category", icon: faTags, label: "Categories", delay: "200" },
    { path: "product", icon: faBox, label: "Products", delay: "300" },
    { path: "orders", icon: faClipboardList, label: "Orders", delay: "400" },
    { path: "settings", icon: faCog, label: "Settings", delay: "500" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 left-4 z-50 lg:hidden p-3 rounded-xl ${
          darkMode ? 'bg-indigo-600' : 'bg-indigo-500'
        } text-white shadow-lg hover:shadow-xl transition-all duration-300 group`}
        aria-label="Toggle sidebar"
        data-aos="fade-right"
        data-aos-delay="100"
      >
        <FontAwesomeIcon 
          icon={isOpen ? faTimes : faBars} 
          className="text-lg group-hover:scale-110 transition-transform" 
        />
      </button>

      {/* Sidebar */}
      <div
        className={`h-screen fixed lg:relative z-30 transition-all duration-300 ease-in-out shadow-2xl ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${
          isCollapsed 
            ? "w-20 hover:w-64" 
            : "w-72"
        } ${
          darkMode 
            ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-r border-gray-700/50" 
            : "bg-gradient-to-b from-white via-gray-50 to-white border-r border-gray-200"
        }`}
        onMouseEnter={() => isCollapsed && setHoveredItem(true)}
        onMouseLeave={() => isCollapsed && setHoveredItem(false)}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo/Header */}
          <div className={`flex items-center ${isCollapsed ? "justify-center" : "justify-between"} mb-8 p-4`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 rounded-xl ${
                darkMode ? 'bg-gradient-to-br from-indigo-600 to-purple-600' : 'bg-gradient-to-br from-indigo-500 to-purple-500'
              } flex items-center justify-center text-white font-bold shadow-md`}>
                AP
              </div>
              {(!isCollapsed || hoveredItem) && (
                <h1 className={`text-xl font-bold ml-3 ${
                  darkMode ? 'text-white' : 'text-gray-800'
                }`}>
                  Admin<span className="text-indigo-400">Panel</span>
                </h1>
              )}
            </div>
            
            {/* Desktop Collapse Button */}
            {(!isCollapsed || hoveredItem) && (
              <button
                onClick={toggleCollapse}
                className={`hidden lg:flex items-center justify-center w-8 h-8 rounded-full ${
                  darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                } transition-all hover:scale-110`}
                aria-label="Collapse sidebar"
              >
                <FontAwesomeIcon 
                  icon={isCollapsed ? faChevronRight : faChevronLeft} 
                  className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                />
              </button>
            )}
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                data-aos="fade-up"
                data-aos-delay={item.delay}
                onMouseEnter={() => setHoveredItem(item.path)}
                onMouseLeave={() => setHoveredItem(null)}
                className={({ isActive }) =>
                  `flex items-center ${
                    isCollapsed && !hoveredItem ? "justify-center p-3" : "p-3 px-4"
                  } rounded-xl transition-all duration-300 group ${
                    isActive
                      ? `bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md ${
                          isCollapsed && hoveredItem ? 'pl-5' : ''
                        }`
                      : `${
                          darkMode 
                            ? 'text-gray-300 hover:bg-gray-700/50' 
                            : 'text-gray-600 hover:bg-gray-100'
                        } ${
                          isCollapsed && hoveredItem ? 'pl-5 bg-opacity-50' : ''
                        } hover:text-indigo-400`
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className={`relative ${
                      isCollapsed && !hoveredItem ? "text-xl" : "mr-4"
                    }`}>
                      <FontAwesomeIcon 
                        icon={item.icon} 
                        className={`${
                          isActive 
                            ? "text-white" 
                            : darkMode 
                              ? "text-indigo-400 group-hover:text-indigo-300" 
                              : "text-indigo-500 group-hover:text-indigo-600"
                        } transition-colors`} 
                      />
                      {isActive && (
                        <div className={`absolute -right-2 -top-2 w-3 h-3 rounded-full ${
                          darkMode ? 'bg-indigo-300' : 'bg-white'
                        } shadow-md animate-pulse`}></div>
                      )}
                    </div>
                    {(!isCollapsed || hoveredItem) && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Footer Section */}
          <div className="mt-auto space-y-4">
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className={`flex items-center ${
                isCollapsed && !hoveredItem ? "justify-center" : "justify-between"
              } w-full p-3 rounded-xl ${
                darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
              } transition-all hover:shadow-md`}
              data-aos="fade-up"
              data-aos-delay="600"
            >
              <div className="flex items-center">
                <FontAwesomeIcon 
                  icon={darkMode ? faMoon : faSun} 
                  className={`${
                    isCollapsed && !hoveredItem ? "text-xl" : "mr-4"
                  } ${darkMode ? "text-yellow-300" : "text-yellow-500"}`} 
                />
                {(!isCollapsed || hoveredItem) && (
                  <span className={darkMode ? "text-gray-300" : "text-gray-600"}>
                    {darkMode ? "Dark Mode" : "Light Mode"}
                  </span>
                )}
              </div>
              {(!isCollapsed || hoveredItem) && (
                <div className={`w-10 h-5 rounded-full flex items-center transition-all duration-300 ${
                  darkMode ? 'bg-indigo-600' : 'bg-indigo-400'
                }`}>
                  <div className={`w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                    darkMode ? 'translate-x-5' : 'translate-x-1'
                  }`}></div>
                </div>
              )}
            </button>

            {/* Logout Button */}
            <NavLink
              to="/logout"
              data-aos="fade-up"
              data-aos-delay="700"
              onMouseEnter={() => setHoveredItem('logout')}
              onMouseLeave={() => setHoveredItem(null)}
              className={`flex items-center ${
                isCollapsed && !hoveredItem ? "justify-center p-3" : "p-3 px-4"
              } rounded-xl transition-all duration-300 group ${
                darkMode 
                  ? 'text-red-400 hover:bg-gray-700/50 hover:text-red-300' 
                  : 'text-red-500 hover:bg-gray-100 hover:text-red-600'
              }`}
            >
              <FontAwesomeIcon 
                icon={faRightFromBracket} 
                className={`${
                  isCollapsed && !hoveredItem ? "text-xl" : "mr-4"
                } group-hover:animate-pulse`} 
              />
              {(!isCollapsed || hoveredItem) && (
                <span className="font-medium">Logout</span>
              )}
            </NavLink>

            {/* User Profile */}
            <div 
              className={`flex items-center ${
                isCollapsed && !hoveredItem ? "justify-center p-2" : "p-3"
              } rounded-xl ${
                darkMode ? 'bg-gray-700/50' : 'bg-gray-100'
              } transition-all`}
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <div className={`relative ${
                isCollapsed && !hoveredItem ? "w-10 h-10" : "w-10 h-10 mr-3"
              } rounded-full border-2 ${
                darkMode ? 'border-indigo-500' : 'border-indigo-400'
              } overflow-hidden shadow-md`}>
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="User" 
                  className="w-full h-full object-cover"
                />
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${
                  darkMode ? 'bg-green-400' : 'bg-green-500'
                } border ${
                  darkMode ? 'border-gray-800' : 'border-white'
                }`}></div>
              </div>
              
              {(!isCollapsed || hoveredItem) && (
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${
                    darkMode ? 'text-white' : 'text-gray-800'
                  }`}>Sarah Johnson</p>
                  <p className={`text-xs truncate ${
                    darkMode ? 'text-indigo-300' : 'text-indigo-500'
                  }`}>Admin</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden backdrop-blur-sm transition-opacity duration-300"
          data-aos="fade"
          data-aos-delay="200"
        />
      )}
    </>
  );
};

export default SidebarAdmin;