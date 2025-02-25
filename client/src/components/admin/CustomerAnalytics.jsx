import React, { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaChartLine, FaUserCheck, FaCalendarAlt, FaSearch, FaSortAmountDown, FaSortAmountUp, FaExternalLinkAlt } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';

function MetricCard({ icon: Icon, title, value, subtitle, color }) {
  const gradientFrom = {
    cyan: 'from-cyan-600/10',
    purple: 'from-purple-600/10',
    amber: 'from-amber-600/10',
    emerald: 'from-emerald-600/10',
    blue: 'from-blue-600/10',
    pink: 'from-pink-600/10'
  };
  
  const gradientTo = {
    cyan: 'to-cyan-600/5',
    purple: 'to-purple-600/5',
    amber: 'to-amber-600/5',
    emerald: 'to-emerald-600/5',
    blue: 'to-blue-600/5',
    pink: 'to-pink-600/5'
  };
  
  const iconColor = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400',
    blue: 'text-blue-400',
    pink: 'text-pink-400'
  };
  
  const borderColor = {
    cyan: 'border-cyan-500/10',
    purple: 'border-purple-500/10',
    amber: 'border-amber-500/10',
    emerald: 'border-emerald-500/10',
    blue: 'border-blue-500/10',
    pink: 'border-pink-500/10'
  };

  return (
    <div className={`p-5 rounded-xl bg-gradient-to-b ${gradientFrom[color]} ${gradientTo[color]} backdrop-blur-sm border ${borderColor[color]} shadow-lg relative overflow-hidden`}>
      <div className="flex items-center mb-3">
        <div className={`p-2 rounded-lg bg-gray-800/50 mr-3 ${iconColor[color]}`}>
          <Icon className="text-xl" />
        </div>
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
      </div>
      
      <p className="text-3xl font-bold text-white tracking-tight">{value}</p>
      
      {subtitle && (
        <p className="text-xs text-gray-400 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function CustomerAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('totalSpent');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/customer-analytics`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (response.data.status === 'success') {
          setAnalytics(response.data.analytics);
        } else {
          toast.error('Failed to fetch customer analytics');
        }
      } catch (error) {
        console.error('Error fetching customer analytics:', error);
        toast.error('Failed to load customer analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Format number with 2 decimal places
  const formatNumber = (number) => {
    return Number(number).toFixed(2);
  };

  // Handle sort change
  const handleSortChange = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Filter and sort customers
  const getFilteredAndSortedCustomers = () => {
    if (!analytics || !analytics.customers) return [];

    let filtered = analytics.customers;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(customer => 
        customer.name?.toLowerCase().includes(term) || 
        customer.email?.toLowerCase().includes(term)
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'name':
          aValue = a.name || '';
          bValue = b.name || '';
          break;
        case 'email':
          aValue = a.email || '';
          bValue = b.email || '';
          break;
        case 'orders':
          aValue = a.orders.length;
          bValue = b.orders.length;
          break;
        case 'totalSpent':
          aValue = a.totalSpent;
          bValue = b.totalSpent;
          break;
        case 'averageOrderValue':
          aValue = a.averageOrderValue;
          bValue = b.averageOrderValue;
          break;
        case 'lastOrderDate':
          aValue = new Date(a.lastOrderDate).getTime();
          bValue = new Date(b.lastOrderDate).getTime();
          break;
        default:
          aValue = a.totalSpent;
          bValue = b.totalSpent;
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No customer data available</p>
      </div>
    );
  }

  const { summary } = analytics;
  const filteredCustomers = getFilteredAndSortedCustomers();

  return (
    <div>
      <h2 className="text-2xl font-semibold text-white/90 mb-6">Customer Analytics</h2>
      
      {/* Summary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <MetricCard 
          icon={FaUsers} 
          title="Total Customers" 
          value={summary.totalCustomers.toLocaleString()}
          color="cyan" 
        />
        <MetricCard 
          icon={FaUserCheck} 
          title="Repeat Customers" 
          value={`${summary.repeatCustomers.toLocaleString()} (${formatNumber(summary.repeatCustomerRate)}%)`}
          color="emerald" 
        />
        <MetricCard 
          icon={FaShoppingCart} 
          title="Average Orders" 
          value={formatNumber(summary.averageOrdersPerCustomer)}
          subtitle="Orders per customer"
          color="purple" 
        />
        <MetricCard 
          icon={FaMoneyBillWave} 
          title="Total Revenue" 
          value={formatCurrency(summary.totalRevenue)}
          color="amber" 
        />
        <MetricCard 
          icon={FaMoneyBillWave} 
          title="Average Revenue" 
          value={formatCurrency(summary.averageRevenuePerCustomer)}
          subtitle="Per customer"
          color="blue" 
        />
        <MetricCard 
          icon={FaShoppingCart} 
          title="Average Order Value" 
          value={formatCurrency(summary.totalRevenue / summary.totalOrders)}
          color="pink" 
        />
      </div>
      
      {/* Customer Table */}
      <div className="bg-[#1a1b1e]/30 border border-neutral-800/30 rounded-xl overflow-hidden mb-8">
        <div className="p-4 border-b border-neutral-800/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h3 className="text-lg font-semibold text-white/90">Customer List</h3>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#1e2229] border border-neutral-700/50 rounded-lg py-2 px-4 pl-10 text-sm text-white/90 focus:outline-none focus:border-cyan-500/50"
            />
            <FaSearch className="absolute left-3 top-2.5 text-gray-500" />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1e2229]/70 text-xs uppercase text-gray-400">
                <th className="px-4 py-3 text-left">
                  <button 
                    onClick={() => handleSortChange('name')}
                    className="flex items-center focus:outline-none"
                  >
                    Customer
                    {sortField === 'name' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-left">
                  <button 
                    onClick={() => handleSortChange('email')}
                    className="flex items-center focus:outline-none"
                  >
                    Email
                    {sortField === 'email' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button 
                    onClick={() => handleSortChange('orders')}
                    className="flex items-center justify-center focus:outline-none"
                  >
                    Orders
                    {sortField === 'orders' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button 
                    onClick={() => handleSortChange('totalSpent')}
                    className="flex items-center justify-end focus:outline-none"
                  >
                    Total Spent
                    {sortField === 'totalSpent' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button 
                    onClick={() => handleSortChange('averageOrderValue')}
                    className="flex items-center justify-end focus:outline-none"
                  >
                    Avg. Order
                    {sortField === 'averageOrderValue' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-center">
                  <button 
                    onClick={() => handleSortChange('lastOrderDate')}
                    className="flex items-center justify-center focus:outline-none"
                  >
                    Last Order
                    {sortField === 'lastOrderDate' && (
                      sortDirection === 'asc' ? <FaSortAmountUp className="ml-1" /> : <FaSortAmountDown className="ml-1" />
                    )}
                  </button>
                </th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/30">
              {filteredCustomers.map((customer, index) => (
                <tr 
                  key={index} 
                  className="text-sm hover:bg-[#1e2229]/30 transition-colors"
                >
                  <td className="px-4 py-3 text-white/90">{customer.name || 'N/A'}</td>
                  <td className="px-4 py-3 text-gray-400">{customer.email}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${customer.orders.length > 1 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-gray-500/10 text-gray-400'}`}>
                      {customer.orders.length}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-white/90">{formatCurrency(customer.totalSpent)}</td>
                  <td className="px-4 py-3 text-right text-gray-400">{formatCurrency(customer.averageOrderValue)}</td>
                  <td className="px-4 py-3 text-center text-gray-400">{formatDate(customer.lastOrderDate)}</td>
                  <td className="px-4 py-3 text-center">
                    <button 
                      onClick={() => setSelectedCustomer(customer)}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      title="View Details"
                    >
                      <FaExternalLinkAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCustomers.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">No customers found</p>
          </div>
        )}
      </div>
      
      {/* Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1a1b1e] border border-neutral-800/50 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-neutral-800/50">
              <h3 className="text-lg font-semibold text-white/90">Customer Details</h3>
              <button 
                onClick={() => setSelectedCustomer(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-60px)]">
              {/* Customer Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Customer Information</h4>
                  <p className="text-lg font-semibold text-white/90 mb-1">{selectedCustomer.name || 'N/A'}</p>
                  <p className="text-gray-400 mb-4">{selectedCustomer.email}</p>
                  
                  {selectedCustomer.user && (
                    <div className="bg-[#1e2229]/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Registered User</p>
                      <p className="text-sm text-white/90">Username: {selectedCustomer.user.username}</p>
                      <p className="text-sm text-white/90">Role: {selectedCustomer.user.role}</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium text-gray-400 mb-2">Customer Metrics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#1e2229]/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Total Spent</p>
                      <p className="text-lg font-semibold text-white/90">{formatCurrency(selectedCustomer.totalSpent)}</p>
                    </div>
                    <div className="bg-[#1e2229]/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Orders</p>
                      <p className="text-lg font-semibold text-white/90">{selectedCustomer.orders.length}</p>
                    </div>
                    <div className="bg-[#1e2229]/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Avg. Order Value</p>
                      <p className="text-lg font-semibold text-white/90">{formatCurrency(selectedCustomer.averageOrderValue)}</p>
                    </div>
                    <div className="bg-[#1e2229]/50 p-3 rounded-lg">
                      <p className="text-xs text-gray-400">Customer Since</p>
                      <p className="text-sm font-semibold text-white/90">{formatDate(selectedCustomer.firstOrderDate)}</p>
                      <p className="text-xs text-gray-400">{selectedCustomer.daysSinceFirstOrder} days ago</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Order History */}
              <div>
                <h4 className="text-sm font-medium text-gray-400 mb-3">Order History</h4>
                <div className="bg-[#1e2229]/30 border border-neutral-800/30 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-[#1e2229]/70 text-xs uppercase text-gray-400">
                        <th className="px-4 py-2 text-left">Order #</th>
                        <th className="px-4 py-2 text-left">Date</th>
                        <th className="px-4 py-2 text-center">Items</th>
                        <th className="px-4 py-2 text-right">Total</th>
                        <th className="px-4 py-2 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/30">
                      {selectedCustomer.orders.sort((a, b) => new Date(b.date) - new Date(a.date)).map((order, index) => (
                        <tr key={index} className="text-sm hover:bg-[#1e2229]/50 transition-colors">
                          <td className="px-4 py-2 text-white/90">{order.orderNumber}</td>
                          <td className="px-4 py-2 text-gray-400">{formatDate(order.date)}</td>
                          <td className="px-4 py-2 text-center text-gray-400">{order.items}</td>
                          <td className="px-4 py-2 text-right font-medium text-white/90">{formatCurrency(order.total)}</td>
                          <td className="px-4 py-2 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              order.status === 'Completed' || order.status === 'Delivered' 
                                ? 'bg-emerald-500/10 text-emerald-400' 
                                : order.status === 'Shipping' 
                                  ? 'bg-purple-500/10 text-purple-400'
                                  : order.status === 'In Queue' || order.status === 'Printing'
                                    ? 'bg-yellow-500/10 text-yellow-400'
                                    : 'bg-blue-500/10 text-blue-400'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerAnalytics; 