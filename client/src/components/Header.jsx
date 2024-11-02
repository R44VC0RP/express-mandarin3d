import React, { useState, useEffect } from 'react';
import m3d_logo from '../assets/images/m3d_logo.png';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/Cart';
import { ShoppingCart } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FaSignOutAlt, FaBars, FaTimes, FaShoppingCart, FaDownload, FaImages, FaHome, FaUser } from "react-icons/fa";
import { cn } from "@/lib/utils";

const Header = () => {
    const { isAuthenticated, user } = useAuth();
    const { cart } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        document.body.style.overflow = isMobileMenuOpen ? 'auto' : 'hidden';
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
            document.body.style.overflow = 'auto';
        };
    }, [isLogoMenuOpen]);

    return (
        <>
            <header className="p-4 flex items-center justify-between backdrop-blur-md border-b border-white border-opacity-10 relative z-50">
                {/* Logo Section */}
                <div className="flex items-center">
                    <div className="relative" onContextMenu={handleLogoRightClick}>
                        <a href="/">
                            <img src={m3d_logo} alt="logo" className="h-10 sm:h-14 w-auto rounded-md mr-2" />
                        </a>
                        {isLogoMenuOpen && (
                            <div className="absolute left-0 mt-2 w-48 sm:w-64 bg-[#2A2A2A] border border-[#5E5E5E] rounded-md shadow-lg z-10 logo-menu-container">
                                <button className="flex items-center w-full px-4 py-2 text-xs sm:text-sm text-white hover:bg-[#3A3A3A]" onClick={() => window.location.href = '/svg-logo'}>
                                    <FaDownload className="mr-2" />
                                    Download SVG Logo
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-xs sm:text-sm text-white hover:bg-[#3A3A3A]" onClick={() => window.location.href = '/svg-wordmark'}>
                                    <FaDownload className="mr-2" />
                                    Download SVG Wordmark
                                </button>
                                <button className="flex items-center w-full px-4 py-2 text-xs sm:text-sm text-white hover:bg-[#3A3A3A]" onClick={() => window.location.href = '/'}>
                                    <FaHome className="mr-2" />
                                    Go Home
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden">
                    <button
                        onClick={toggleMobileMenu}
                        className="text-white text-2xl focus:outline-none hover:text-gray-300 transition-colors"
                    >
                        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex md:items-center md:justify-end w-full md:w-auto">
                    <nav className="flex items-center space-x-6">
                        {/* <a href="/marketplace" className="text-white hover:text-[#11B3BD] transition-colors">Model Marketplace</a> */}
                        <a href="https://shop.mandarin3d.com" className="text-white hover:text-[#11B3BD] transition-colors">Product Store</a>
                        <a href="/contact" className="text-white hover:text-[#11B3BD] transition-colors">Contact Us</a>
                    </nav>
                    <div className="flex items-center ml-4">
                        {cart.cart_id && (
                            <a href="/cart" className="relative flex items-center justify-center ml-0 md:ml-4 cursor-pointer mr-4">
                                <ShoppingCart className="text-white text-2xl hover:text-gray-300" />
                                {cart.files.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#0D939B] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.files.length}
                                    </span>
                                )}
                            </a>
                        )}
                        {isAuthenticated && (
                            <div className="flex items-center ml-4">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.profilePicture || "https://via.placeholder.com/40"} alt="Profile" />
                                    <AvatarFallback>
                                        {user.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Badge className="ml-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white" onClick={() => window.location.href = '/logout'}>Logout</Badge>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Full-page Navigation Menu */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-30 backdrop-blur-lg z-50 transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-y-auto ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col min-h-screen p-8">
                    <div className="flex justify-between items-center mb-8">
                        <img src={m3d_logo} alt="logo" className="h-10 w-auto rounded-md" />
                        <button
                            onClick={toggleMobileMenu}
                            className="text-white text-2xl focus:outline-none hover:text-gray-300 transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>
                    <nav className="flex flex-col space-y-6">
                        <a
                            href="/marketplace"
                            className="text-white hover:text-[#11B3BD] transition-colors text-2xl sm:text-3xl font-semibold"
                        >
                            Model Marketplace
                        </a>
                        {/* <a
                            href="/products"
                            className="text-white hover:text-[#11B3BD] transition-colors text-2xl sm:text-3xl font-semibold"
                        >
                            Products
                        </a> */}
                        <a
                            href="/contact"
                            className="text-white hover:text-[#11B3BD] transition-colors text-2xl sm:text-3xl font-semibold"
                        >
                            Contact Us
                        </a>
                    </nav>
                    <div className="mt-auto pt-8 flex flex-col items-start space-y-4">
                        {cart.cart_id && (
                            <a href="/cart" className="relative inline-flex items-center">
                                <ShoppingCart className="text-white text-2xl hover:text-gray-300" />
                                {cart.files.length > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-[#0D939B] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                        {cart.files.length}
                                    </span>
                                )}
                            </a>
                        )}
                        {isAuthenticated && (
                            <div className="flex items-center">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.profilePicture || "https://via.placeholder.com/40"} alt="Profile" />
                                    <AvatarFallback>
                                        {user.username.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <Badge className="ml-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white" onClick={() => window.location.href = '/logout'}>Logout</Badge>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;