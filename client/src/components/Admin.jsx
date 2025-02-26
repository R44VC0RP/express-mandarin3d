import React, { useState, useEffect } from 'react';
import { FaBars, FaUser, FaCog, FaChartBar, FaBoxes, FaFileAlt, FaShoppingCart, FaTruck, FaBox, FaSignOutAlt, FaUsers, FaNewspaper } from 'react-icons/fa';
import Dashboard from '../components/admin/Dashboard';
import FilamentInventory from '../components/admin/Filaments';
import FileManagement from '../components/admin/Files';
import UserManagement from '../components/admin/UserManagement';
import Settings from '../components/admin/Settings';
import ShippingInfo from './admin/ShippingInfo.jsx';
import ProductManagement from './admin/Products.jsx';
import QuoteManagement from './admin/QuoteManagement.jsx';
import CartManagement from './admin/Cart.jsx';
import Orders from './admin/Orders.jsx';
import CustomerAnalytics from './admin/CustomerAnalytics.jsx';
import PressReleases from './admin/PressReleases.jsx';
import logo from '../assets/images/m3d_logo.png';
import { Button } from '../components/ui/button';
import { Home, CreditCard, Receipt, Users, Package, BarChart, FileText, Clock, Database, PieChart } from 'lucide-react';

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
                { name: 'Customer Analytics', icon: FaUsers },
                { name: 'Settings', icon: FaCog },
                { name: 'Orders', icon: FaFileAlt },
                { name: 'Quotes', icon: FaFileAlt },
                { name: 'Press Releases', icon: FaNewspaper },
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
        <aside className="w-60 bg-gradient-to-b from-[#0a252a] to-[#051b1d] shadow-xl h-screen overflow-y-auto overflow-x-hidden flex flex-col border-r border-cyan-900/30">
            <a href="/" className="block">
                <div className="flex items-center space-x-3 px-4 py-5 bg-gradient-to-r from-[#0d2e32]/80 to-[#0d2e32]/20 backdrop-blur-sm">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-cyan-500/20 rounded-full blur-sm"></div>
                        <img src={logo} alt="Mandarin 3D" className="w-8 h-8 rounded-lg relative z-10" />
                    </div>
                    <div>
                        <span className="font-bold text-md text-white block">Mandarin 3D</span>
                        <span className="text-xs text-cyan-400/70">Admin Portal</span>
                    </div>
                </div>
            </a>
            
            <nav className="flex-grow px-3 py-5 space-y-6">
                {tabGroups.map((group) => (
                    <div key={group.groupName} className="space-y-1">
                        <h3 className="text-xs font-semibold text-cyan-500/70 uppercase tracking-wider px-3 mb-2">{group.groupName}</h3>
                        <div className="space-y-1">
                            {group.tabs.map((tab) => (
                                <Button
                                    key={tab.name}
                                    variant="ghost"
                                    className={`w-full justify-start text-sm py-2.5 px-3 rounded-md transition-all duration-200 ${
                                        activeTab === tab.name 
                                        ? 'bg-gradient-to-r from-cyan-900/60 to-cyan-800/20 text-white font-medium shadow-md' 
                                        : 'text-gray-300 hover:bg-cyan-900/30 hover:text-cyan-200'
                                    }`}
                                    onClick={() => handleTabClick(tab.name)}
                                >
                                    <tab.icon className={`mr-3 h-4 w-4 ${
                                        activeTab === tab.name ? 'text-cyan-400' : 'text-gray-400'
                                    }`} />
                                    {tab.name}
                                </Button>
                            ))}
                        </div>
                    </div>
                ))}
            </nav>
            
            <div className="px-3 py-4 border-t border-cyan-900/30 mt-auto">
                <a href="/logout" className="flex items-center px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-cyan-900/30 rounded-md transition-colors">
                    <FaSignOutAlt className="mr-3 h-4 w-4" />
                    Logout
                </a>
                <div className="mt-4 px-3">
                    <div className="text-xs text-gray-500">Mandarin 3D Admin v1.2</div>
                </div>
            </div>
        </aside>
    );
}

function Content({ activeTab }) {
    return (
        <div className="flex-grow p-8 bg-gradient-to-br from-[#0F0F0F] to-[#1A1A1A] text-white">
            <div className="max-w-screen-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white/90">{activeTab}</h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-cyan-600 to-cyan-400 rounded-full mt-2"></div>
                </div>
                
                <div className="bg-[#1a1b1e]/80 rounded-lg border border-neutral-800/50 shadow-xl backdrop-blur-sm p-6">
                    {activeTab === 'Dashboard' && <Dashboard />}
                    {activeTab === 'Filaments' && <FilamentInventory />}
                    {activeTab === 'Files' && <FileManagement />}
                    {activeTab === 'Users' && <UserManagement />}
                    {activeTab === 'Settings' && <Settings />}
                    {activeTab === 'Shipping Info' && <ShippingInfo />}
                    {activeTab === 'Products' && <ProductManagement />}
                    {activeTab === 'Carts' && <CartManagement />}
                    {activeTab === 'Orders' && <Orders />}
                    {activeTab === 'Quotes' && <QuoteManagement />}
                    {activeTab === 'Customer Analytics' && <CustomerAnalytics />}
                    {activeTab === 'Press Releases' && <PressReleases />}
                </div>
            </div>
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
        <div className="flex h-screen bg-[#0F0F0F] text-white overflow-hidden">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <div className="flex flex-col flex-grow overflow-y-auto">
                <Content activeTab={activeTab} />
            </div>
        </div>
    );
}

export default Admin;