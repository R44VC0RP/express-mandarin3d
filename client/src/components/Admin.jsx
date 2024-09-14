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
import Orders from './admin/Orders.jsx';
import logo from '../assets/images/m3d_logo.png';
import { Button } from '../components/ui/button';
import { Home, CreditCard, Receipt, Users, Package, BarChart, FileText, Clock, Database, PieChart } from 'lucide-react';
import OrderFocused from './admin/Order-Focused.jsx';



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
                { name: 'Orders', icon: FaFileAlt },
                { name: 'Order-Focused', icon: FaFileAlt },
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
        <aside className="w-56 bg-[#0c3235] border-r border-[#0c3235] shadow-md h-screen">
            <a href="/">
                <div className="flex items-center space-x-2 px-3 py-2 border-b border-[#1e6a70]">
                    <img src={logo} alt="M3D Logo" className="w-6 h-6 rounded-lg" />
                    <span className="font-semibold text-md text-white">Mandarin 3D Prints</span>
                </div>
            </a>
            <nav className="px-2 py-2 ">
                {tabGroups.map((group) => (
                    <div key={group.groupName}>
                        <h3 className="text-xs font-semibold text-gray-400 mb-1">{group.groupName}</h3>
                        {group.tabs.map((tab) => (
                            <Button
                                key={tab.name}
                                variant="ghost"
                                className={`w-full justify-start text-md py-1 px-2 mb-0.5 ${activeTab === tab.name ? 'bg-[#1e6a70] text-white' : 'text-white'}`}
                                onClick={() => handleTabClick(tab.name)}
                            >
                                <tab.icon className={`mr-2 h-3 w-3 ${activeTab === tab.name ? 'text-white' : 'text-white'}`} />
                                {tab.name}
                            </Button>
                        ))}
                    </div>
                ))}
            </nav>
        </aside>
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
            {activeTab === 'Orders' && <Orders />}
            {activeTab === 'Order-Focused' && <OrderFocused />}
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
        <div className="flex h-screen">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex flex-col flex-grow overflow-y-auto">
                <Content activeTab={activeTab} />
            </div>
        </div>
    );
}

export default Admin;