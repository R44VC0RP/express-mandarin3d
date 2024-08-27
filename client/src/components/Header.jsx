import React from 'react';
import m3d_logo from '../assets/images/m3d_logo.png';
import { useAuth } from '../context/AuthContext';
import { FaSignOutAlt } from "react-icons/fa";

const Header = () => {

    const { isAuthenticated, user } = useAuth();
    React.useEffect(() => {
		if (user && user.role) {
		}
	}, [user]);
    return (
        <header className="p-4 flex items-center justify-between">
            <div className="flex items-center">
                <a href="/">
                    <img src={m3d_logo} alt="logo" className="h-14 w-auto border border-[#8791A3] rounded-md" />
                </a>
            </div>
            <nav className="flex items-center space-x-6">
                <a href="#" className="text-white font-semibold hover:text-gray-300">About Us</a>
                <a href="#" className="text-white font-semibold hover:text-gray-300">Model Library</a>
                <button className="primary-button font-semibold">
                    Contact Us
                </button>
                {isAuthenticated && (
                    <a href="/logout">
                        <FaSignOutAlt className="mr-2 text-red-500 bg-gray-200 rounded-full p-1 text-2xl" />
                    </a>
                )}
            </nav>
        </header>
    );
};

export default Header;