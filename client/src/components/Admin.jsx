import React, { useState, useEffect } from 'react';
import { FaBars, FaUser, FaCog, FaChartBar, FaBoxes, FaFileAlt, FaShoppingCart, FaTruck, FaBox } from 'react-icons/fa';
import Dashboard from '../components/admin/Dashboard';
import FilamentInventory from '../components/admin/Filaments';
import FileManagement from '../components/admin/Files';
import UserManagement from '../components/admin/UserManagement';
import Settings from '../components/admin/Settings';
import ShippingInfo from './admin/ShippingInfo.jsx';
import ProductManagement from './admin/Products.jsx';
import CartManagement from './admin/Cart.jsx';
import logo from '../assets/images/m3d_logo.png';


function Sidebar({ activeTab, setActiveTab }) {
    const tabGroups = [
        {
            groupName: 'Main',
            tabs: [
                { name: 'Dashboard', icon: FaChartBar },
                
            ],
        },
        {
            groupName: 'Management',
            tabs: [
                { name: 'Users', icon: FaUser },
                { name: 'Settings', icon: FaCog },
            ],
        },
        {
            groupName: 'Inventories',
            tabs: [
                { name: 'Filaments', icon: FaBoxes },
                { name: 'Files', icon: FaFileAlt },
                { name: 'Shipping Info', icon: FaTruck },
                { name: 'Products', icon: FaBox },
                { name: 'Carts', icon: FaShoppingCart },
                
            ]
        }
    ];

    const handleTabClick = (tabName) => {
        setActiveTab(tabName);
        localStorage.setItem('activeAdminTab', tabName);
    };

    return (
        <div className="w-64 h-screen bg-[#070707] text-white p-4">
            <a href="/">
                <img src={logo} alt="logo" className="w-16 h-16 mb-8 mx-auto border border-white rounded-md" />
            </a>
            <h1 className="text-2xl font-bold mb-8">Admin Panel</h1>
            {tabGroups.map((group) => (
                <div key={group.groupName} className="mb-4">
                    <h2 className="text-xl font-semibold mb-2">{group.groupName}</h2>
                    {group.tabs.map((tab) => (
                        <div
                            key={tab.name}
                            onClick={() => handleTabClick(tab.name)}
                            className={`flex items-center w-full p-2 mb-2 rounded cursor-pointer ${
                                activeTab === tab.name ? 'bg-gray-700' : 'hover:bg-gray-700'
                            }`}
                        >
                            <tab.icon className="mr-2" />
                            {tab.name}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function Content({ activeTab }) {
    return (
        <div className="flex-grow p-8">
            {activeTab === 'Dashboard' && <Dashboard />}
            {activeTab === 'Filaments' && <FilamentInventory />}
            {activeTab === 'Files' && <FileManagement />}
            {activeTab === 'Users' && <UserManagement />}
            {activeTab === 'Settings' && <Settings />}
            {activeTab === 'Shipping Info' && <ShippingInfo />}
            {activeTab === 'Products' && <ProductManagement />}
            {activeTab === 'Carts' && <CartManagement />}
        </div>
    );
}

function Admin() {
    const [activeTab, setActiveTab] = useState(() => {
        return localStorage.getItem('activeAdminTab') || 'Dashboard';
    });

    useEffect(() => {
        localStorage.setItem('activeAdminTab', activeTab);
    }, [activeTab]);

    return (
        <div className="flex bg-[#0F0F0F] text-white">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex flex-col flex-grow">
                <Content activeTab={activeTab} />
            </div>
        </div>
    );
}

export default Admin;