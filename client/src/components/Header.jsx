import React, { useState, useEffect } from 'react';
import m3d_logo from '../assets/images/m3d_logo.png';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/Cart';
import { ShoppingCart } from 'lucide-react';
import { FaSignOutAlt, FaBars, FaTimes, FaShoppingCart, FaDownload, FaImages, FaHome } from "react-icons/fa";

const Header = () => {
    const { isAuthenticated, user } = useAuth();
    const { cart } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);

    React.useEffect(() => {
        if (user && user.role) {
        }
    }, [user]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const handleLogoRightClick = (e) => {
        e.preventDefault();
        setIsLogoMenuOpen(!isLogoMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isLogoMenuOpen && !event.target.closest('.logo-menu-container')) {
                setIsLogoMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isLogoMenuOpen]);

    return (
        <header className="p-4 flex items-center justify-between ">
            <div className="flex items-center logo-menu-container">
                <div className="relative" onContextMenu={handleLogoRightClick}>
                    <a href="/">
                        <img src={m3d_logo} alt="logo" className="h-14 w-auto border border-[#8791A3] rounded-md" />
                    </a>
                    {isLogoMenuOpen && (
                        <div className="absolute left-0 mt-2 w-64 bg-[#2A2A2A] border border-[#5E5E5E] rounded-md shadow-lg z-10">
                            <button className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#3A3A3A]" onClick={() => window.location.href = '/svg-logo'}>
                                <FaDownload className="mr-2" />
                                Download SVG Logo
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#3A3A3A]" onClick={() => window.location.href = '/svg-wordmark'}>
                                <FaDownload className="mr-2" />
                                Download SVG Wordmark
                            </button>
                            <button className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#3A3A3A]" onClick={() => window.location.href = '/'}>
                                <FaHome className="mr-2" />
                                Go Home
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <div className="md:hidden justify-end">
            {cart.cart_id && (
                    <a href="/cart" className="relative md:hidden items-center justify-center pr-5 pt-2">
                        <div className="card-special p-2 flex items-center">
                            <ShoppingCart className="text-white text-2xl hover:text-gray-300 mr-2" />
                            {cart.files.length > 0 && (
                                <p className="text-white text-sm">{cart.files.length}</p>
                            )}
                        </div>
                    </a>
                )}
                <button onClick={toggleMobileMenu} className="text-white justify-end mt-2">
                    {isMobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                </button>
            
            </div>
            <nav className={`flex-col md:flex-row md:flex items-center md:space-x-6 ${isMobileMenuOpen ? 'flex items-end' : 'hidden'} md:flex`}>
                <div className={`flex flex-col items-end space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} md:flex-row md:items-center md:space-y-0 md:space-x-6 md:max-h-full md:opacity-100`}>
                    <a href="#" className="text-white font-semibold hover:text-gray-300 py-2 md:py-0">About Us</a>
                    <a href="#" className="text-white font-semibold hover:text-gray-300 py-2 md:py-0">Model Library</a>
                    <button className="primary-button font-semibold" onClick={() => window.location.href = '/contact'}>
                        Contact Us
                    </button>
                    {cart.cart_id && (
                        <a href="/cart" className="relative hidden md:flex items-center justify-center pr-5 pt-2">
                            <ShoppingCart className="text-white text-2xl hover:text-gray-300 mr-2 " />
                            {cart.files.length > 0 && (
                                <p className="text-white text-sm">{cart.files.length}</p>
                            )}
                        </a>
                    )}
                </div>
            </nav>
        </header>
    );
};

export default Header;