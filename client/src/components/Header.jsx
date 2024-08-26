import React from 'react';
import m3d_logo from '../assets/images/m3d_logo.png';

const Header = () => {
    return (
        <header className="p-4 flex items-center justify-between">
            <div className="flex items-center">
                <img src={m3d_logo} alt="logo" className="h-14 w-auto border border-[#8791A3] rounded-md" />
            </div>
            <nav className="flex items-center space-x-6">
                <a href="#" className="text-white font-semibold hover:text-gray-300">About Us</a>
                <a href="#" className="text-white font-semibold hover:text-gray-300">Model Library</a>
                <button className="primary-button font-semibold">
                    Contact Us
                </button>
            </nav>
        </header>
    );
};

export default Header;