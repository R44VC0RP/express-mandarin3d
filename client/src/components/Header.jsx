import React, { useState, useEffect } from 'react';
import m3d_logo from '../assets/images/m3d_logo.png';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/Cart';
import { ShoppingCart } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { FaSignOutAlt, FaBars, FaTimes, FaDownload, FaHome, FaArrowRight } from "react-icons/fa";
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

    const navLinks = [
        { href: "https://shop.mandarin3d.com", text: "Product Store" },
        { href: "/upload", text: "Upload Model" },
        { href: "/contact", text: "Contact Us" }
    ];

    return (
        <>
            <header className="p-4 backdrop-blur-md border-b border-white/5 relative z-50 bg-[#0F0F0F]/80">
                <div className="container mx-auto">
                    <div className="flex items-center justify-between">
                        {/* Logo Section */}
                        <div className="flex items-center">
                            <div className="relative" onContextMenu={handleLogoRightClick}>
                                <a href="/" className="block transition-transform hover:scale-105">
                                    <img src={m3d_logo} alt="logo" className="h-10 sm:h-12 w-auto rounded-md" />
                                </a>
                                {isLogoMenuOpen && (
                                    <div className="absolute left-0 mt-2 w-48 sm:w-64 bg-[#1E1F22] border border-cyan-500/20 rounded-xl shadow-lg shadow-cyan-500/10 z-10 logo-menu-container overflow-hidden">
                                        {[
                                            { icon: <FaDownload />, text: "Download SVG Logo", href: "/svg-logo" },
                                            { icon: <FaDownload />, text: "Download SVG Wordmark", href: "/svg-wordmark" },
                                            { icon: <FaHome />, text: "Go Home", href: "/" }
                                        ].map((item, index) => (
                                            <button 
                                                key={index}
                                                className="flex items-center w-full px-4 py-3 text-sm text-[#8F9099] hover:text-white hover:bg-cyan-500/10 transition-colors group"
                                                onClick={() => window.location.href = item.href}
                                            >
                                                <span className="text-cyan-500 mr-3">{item.icon}</span>
                                                {item.text}
                                                <FaArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden">
                            <button
                                onClick={toggleMobileMenu}
                                className="text-[#8F9099] hover:text-white text-2xl focus:outline-none transition-colors"
                            >
                                {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
                            </button>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex md:items-center md:space-x-8">
                            <nav className="flex items-center space-x-8">
                                {navLinks.map((link, index) => (
                                    <a 
                                        key={index}
                                        href={link.href} 
                                        className="text-[#8F9099] hover:text-white transition-colors relative group"
                                    >
                                        {link.text}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-500 group-hover:w-full transition-all duration-300" />
                                    </a>
                                ))}
                            </nav>
                            <div className="flex items-center space-x-6">
                                {cart.cart_id && (
                                    <a href="/cart" className="relative group">
                                        <ShoppingCart className="text-[#8F9099] group-hover:text-white transition-colors" />
                                        {cart.files.length > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                                {cart.files.length}
                                            </span>
                                        )}
                                    </a>
                                )}
                                {isAuthenticated ? (
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="h-8 w-8 ring-2 ring-cyan-500/20 transition-all hover:ring-cyan-500/40">
                                            <AvatarImage src={user.profilePicture || "https://via.placeholder.com/40"} alt="Profile" />
                                            <AvatarFallback className="bg-cyan-500/10 text-cyan-500">
                                                {user.username.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <button 
                                            onClick={() => window.location.href = '/logout'}
                                            className="flex items-center space-x-2 text-[#8F9099] hover:text-white transition-colors group"
                                        >
                                            <FaSignOutAlt className="transform group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                ) : (
                                    <a 
                                        href="/login"
                                        className="px-4 py-2 rounded-full border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all duration-300"
                                    >
                                        Sign In
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 bg-[#0F0F0F]/95 backdrop-blur-xl z-50 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] ${
                    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="flex flex-col min-h-screen p-8">
                    <div className="flex justify-between items-center mb-12">
                        <img src={m3d_logo} alt="logo" className="h-10 w-auto rounded-md" />
                        <button
                            onClick={toggleMobileMenu}
                            className="text-[#8F9099] hover:text-white text-2xl focus:outline-none transition-colors"
                        >
                            <FaTimes />
                        </button>
                    </div>
                    <nav className="flex flex-col space-y-8">
                        {navLinks.map((link, index) => (
                            <a
                                key={index}
                                href={link.href}
                                className="text-[#8F9099] hover:text-white transition-colors text-2xl sm:text-3xl font-semibold flex items-center group"
                            >
                                {link.text}
                                <FaArrowRight className="ml-4 opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all" />
                            </a>
                        ))}
                    </nav>
                    <div className="mt-auto pt-8 flex flex-col space-y-6">
                        {cart.cart_id && (
                            <a href="/cart" className="flex items-center text-[#8F9099] hover:text-white transition-colors group">
                                <ShoppingCart className="mr-3" />
                                Cart
                                {cart.files.length > 0 && (
                                    <span className="ml-2 bg-cyan-500 text-white text-sm rounded-full h-6 w-6 flex items-center justify-center">
                                        {cart.files.length}
                                    </span>
                                )}
                                <FaArrowRight className="ml-auto opacity-0 group-hover:opacity-100 transform group-hover:translate-x-2 transition-all" />
                            </a>
                        )}
                        {isAuthenticated ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <Avatar className="h-8 w-8 ring-2 ring-cyan-500/20">
                                        <AvatarImage src={user.profilePicture || "https://via.placeholder.com/40"} alt="Profile" />
                                        <AvatarFallback className="bg-cyan-500/10 text-cyan-500">
                                            {user.username.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className="text-[#8F9099]">{user.username}</span>
                                </div>
                                <button 
                                    onClick={() => window.location.href = '/logout'}
                                    className="text-[#8F9099] hover:text-white transition-colors"
                                >
                                    <FaSignOutAlt className="text-xl" />
                                </button>
                            </div>
                        ) : (
                            <a 
                                href="/login"
                                className="flex items-center justify-center px-6 py-3 rounded-full border border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-white transition-all duration-300 group"
                            >
                                Sign In
                                <FaArrowRight className="ml-2 transform group-hover:translate-x-2 transition-all" />
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;