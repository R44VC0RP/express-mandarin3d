import React, { useState } from 'react';
import m3d_logo from '../assets/images/m3d_logo.png';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
    const { isAuthenticated, user } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    React.useEffect(() => {
        if (user && user.role) {
        }
    }, [user]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <header className="p-4 flex items-center justify-between ">
            <div className="flex items-center">
                <a href="/">
                    <img src={m3d_logo} alt="logo" className="h-14 w-auto border border-[#8791A3] rounded-md" />
                </a>
            </div>
            <div className="md:hidden">
                <button onClick={toggleMobileMenu} className="text-white">
                    {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                </button>
            </div>
            <nav className={`flex-col md:flex-row md:flex items-center md:space-x-6 ${isMobileMenuOpen ? 'flex items-end' : 'hidden'} md:flex`}>
                <a href="#" className={`text-white font-semibold hover:text-gray-300 ${isMobileMenuOpen ? 'py-2' : ''}`}>About Us</a>
                <a href="#" className={`text-white font-semibold hover:text-gray-300 ${isMobileMenuOpen ? 'py-2' : ''}`}>Model Library</a>
                <button className={`primary-button font-semibold ${isMobileMenuOpen ? 'py-2' : ''}`} onClick={() => window.location.href = '/cart'}>
                    Contact Us
                </button>
                {isAuthenticated && (
                    <a href="/logout" className={`${isMobileMenuOpen ? 'py-2' : ''}`}>
                        <FaSignOutAlt className="mr-2 text-red-500 bg-gray-200 rounded-full p-1 text-2xl" />
                    </a>
                )}
            </nav>
        </header>
    );
};

export default Header;