import React, { useState, useEffect } from 'react';
import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaChartLine, FaFileAlt, FaCalendarAlt, FaCheck, FaSpinner, FaTimes, FaExclamationTriangle, FaBox, FaTruck, FaEnvelope, FaMapMarkerAlt, FaTag, FaLink, FaCopy, FaWeight, FaRuler, FaDollarSign } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'sonner';

function StatCard({ icon: Icon, title, value, trend, color, isLoading, subtitle, comparisonText }) {
  const iconColor = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    amber: 'text-amber-400',
    emerald: 'text-emerald-400'
  };
  
  const trendColor = trend && trend.value >= 0 ? 'text-emerald-400' : 'text-red-400';
  const trendArrow = trend && trend.value >= 0 ? '↑' : '↓';

  return (
    <div className="bg-[#1a1b1e]/30 border border-neutral-800/30 rounded-xl p-4 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Icon className={`mr-2 ${iconColor[color]}`} />
          <span className="text-sm font-medium text-white/90">{title}</span>
        </div>
        
        {trend && (
          <div className={`text-xs ${trendColor}`}>
            {trendArrow} {Math.abs(trend.value).toFixed(1)}%
          </div>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-cyan-500"></div>
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      ) : (
        <>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
          
          {subtitle && (
            <p className="text-xs text-gray-400 mt-2">
              {subtitle}
            </p>
          )}
          
          {comparisonText && (
            <p className="text-xs text-gray-400 mt-1">
              {comparisonText}
            </p>
          )}
        </>
      )}
    </div>
  );
}

function ActivityItem({ type, data, date }) {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <FaCheck className="text-green-400" />;
      case 'unsliced':
        return <FaSpinner className="text-yellow-400 animate-spin" />;
      case 'error':
        return <FaExclamationTriangle className="text-red-400" />;
      default:
        return null;
    }
  };

  const getOrderStatusIcon = (status) => {
    switch (status) {
      case 'Reviewing':
        return <FaFileAlt className="text-blue-400" />;
      case 'In Queue':
        return <FaBox className="text-yellow-400" />;
      case 'Printing':
        return <FaSpinner className="text-cyan-400 animate-spin" />;
      case 'Completed':
        return <FaCheck className="text-green-400" />;
      case 'Shipping':
        return <FaTruck className="text-purple-400" />;
      case 'Delivered':
        return <FaCheck className="text-green-400" />;
      default:
        return <FaFileAlt className="text-gray-400" />;
    }
  };

  // Safely access properties with fallbacks
  const getFileName = () => {
    if (!data) return 'Unknown File';
    return data.filename || 'Unnamed File';
  };

  const getOrderNumber = () => {
    if (!data) return 'Unknown Order';
    return data.order_number || `#${data.order_id?.substring(0, 8) || 'Unknown'}`;
  };

  const getFileId = () => {
    if (!data || !data.fileid) return 'Unknown ID';
    return data.fileid.substring(0, 8) + '...';
  };

  const getDimensions = () => {
    if (!data || !data.dimensions) return null;
    const { x = 0, y = 0, z = 0 } = data.dimensions;
    return `${x}mm × ${y}mm × ${z}mm`;
  };

  const getFileStatus = () => {
    if (!data) return 'unknown';
    return data.file_status || 'unknown';
  };

  const getOrderStatus = () => {
    if (!data) return 'Unknown';
    return data.order_status || 'Processing';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <div className="flex items-start space-x-3 p-4 hover:bg-[#1e2229]/50 rounded-lg transition-colors">
      <div className={`p-2 rounded-lg ${type === 'file' ? 'bg-cyan-500/10' : 'bg-purple-500/10'} mt-1`}>
        {type === 'file' ? (
          <FaFileAlt className={`text-sm ${type === 'file' ? 'text-cyan-400' : 'text-purple-400'}`} />
        ) : (
          <FaShoppingCart className={`text-sm ${type === 'file' ? 'text-cyan-400' : 'text-purple-400'}`} />
        )}
      </div>
      
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-white">
            {type === 'file' ? getFileName() : getOrderNumber()}
          </h4>
          <span className="text-xs text-gray-500">
            {formatDate(date)}
          </span>
        </div>
        
        <div className="flex flex-col mt-1 space-y-1">
          {type === 'file' ? (
            <>
              <div className="flex items-center text-xs text-gray-400">
                <span className="flex items-center space-x-1">
                  {getStatusIcon(getFileStatus())}
                  <span className="ml-1 capitalize">{getFileStatus()}</span>
                </span>
                <span className="mx-2">•</span>
                <span>ID: {getFileId()}</span>
              </div>
              {getDimensions() && (
                <div className="text-xs text-gray-500 mt-1">
                  <span className="flex items-center">
                    <FaTag className="mr-1 text-gray-500" />
                    {getDimensions()}
                  </span>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex items-center text-xs text-gray-400">
                <span className="flex items-center space-x-1">
                  {getOrderStatusIcon(getOrderStatus())}
                  <span className="ml-1">{getOrderStatus()}</span>
                </span>
                {data && data.customer_details && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{data.customer_details.name || 'Unknown Customer'}</span>
                  </>
                )}
              </div>
              {data && data.total_details && (
                <div className="text-xs text-gray-500 mt-1">
                  <span className="flex items-center">
                    <FaDollarSign className="mr-1 text-gray-500" />
                    ${((data.total_details.amount_total || 0) / 100).toFixed(2)}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Component for top referral sources
function TopReferralSourcesCard({ files, isLoading }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  const getFileId = (file) => {
    if (!file || !file.fileid) return 'Unknown ID';
    return file.fileid.substring(0, 8) + '...';
  };

  const getDimensions = (file) => {
    if (!file || !file.dimensions) return null;
    const { x = 0, y = 0, z = 0 } = file.dimensions;
    return `${x}×${y}×${z}mm`;
  };

  const getFileName = (file) => {
    if (!file) return 'Unknown File';
    return file.filename || 'Unnamed File';
  };

  const getFileStatus = (file) => {
    if (!file) return 'unknown';
    return file.file_status || 'unknown';
  };

  const getReferenceCount = (file) => {
    if (!file || typeof file.referenceCount !== 'number') return 0;
    return file.referenceCount;
  };

  const getMass = (file) => {
    if (!file || typeof file.mass_in_grams !== 'number') return null;
    return `${file.mass_in_grams}g`;
  };

  const isReferralCode = (file) => {
    return file && file.isReferralCode === true;
  };

  return (
    <div className="bg-[#1a1b1e]/30 border border-neutral-800/30 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-neutral-800/30 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white/90">Top Referral Sources</h3>
        <div className="p-1.5 rounded-lg bg-cyan-600/10 text-cyan-400">
          <FaLink className="text-sm" />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
      ) : files && files.length > 0 ? (
        <div className="divide-y divide-neutral-800/20">
          {files.map((file, index) => (
            <div key={index} className="p-4 hover:bg-[#1e2229]/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center">
                  <div className="p-1.5 rounded-lg bg-cyan-500/10 mr-3">
                    <FaLink className="text-sm text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/90">
                      {isReferralCode(file) ? file.fileid : getFileName(file)}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isReferralCode(file) ? 'Referral Source' : `ID: ${getFileId(file)}`}
                    </p>
                  </div>
                </div>
                <div className="px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-medium">
                  {getReferenceCount(file)} {getReferenceCount(file) === 1 ? 'file' : 'files'}
                </div>
              </div>
              
              {isReferralCode(file) && file.recentFiles && file.recentFiles.length > 0 ? (
                <div className="mt-3 bg-[#1e2229]/30 rounded-lg p-2">
                  <p className="text-xs text-gray-400 mb-2">Recent files using this referral:</p>
                  <div className="space-y-2">
                    {file.recentFiles.map((recentFile, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-gray-300 truncate max-w-[70%]">{recentFile.filename}</span>
                        <span className="text-gray-500">{formatDate(recentFile.dateCreated)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center text-xs text-gray-400">
                    <FaCalendarAlt className="mr-1.5 text-gray-500" />
                    {formatDate(file.dateCreated)}
                  </div>
                  {!isReferralCode(file) && (
                    <div className="flex items-center text-xs text-gray-400">
                      <FaCheck className="mr-1.5 text-green-400" />
                      <span className="capitalize">{getFileStatus(file)}</span>
                    </div>
                  )}
                  {!isReferralCode(file) && getDimensions(file) && (
                    <div className="flex items-center text-xs text-gray-400">
                      <FaRuler className="mr-1.5 text-gray-500" />
                      {getDimensions(file)}
                    </div>
                  )}
                  {!isReferralCode(file) && getMass(file) && (
                    <div className="flex items-center text-xs text-gray-400">
                      <FaWeight className="mr-1.5 text-gray-500" />
                      {getMass(file)}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="p-6 text-center text-gray-500">
          <p>No referral sources found</p>
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({
    files: { total: 0, currentMonth: 0, prevMonth: 0, growth: 0, isLoading: true },
    orders: { total: 0, currentMonth: 0, prevMonth: 0, growth: 0, isLoading: true },
    revenue: { total: 0, currentMonth: 0, prevMonth: 0, growth: 0, isLoading: true }
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [isActivityLoading, setIsActivityLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [topReferralSources, setTopReferralSources] = useState([]);
  const [isReferralsLoading, setIsReferralsLoading] = useState(true);
  const [customerAnalytics, setCustomerAnalytics] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats from the specialized endpoint
        const statsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (statsResponse.data.status === 'success') {
          const { users, orders, revenue } = statsResponse.data.stats;
          
          // Fetch file statistics
          const filesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/files/recent`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            params: { limit: 1000 } // Get a large number to calculate stats
          });
          
          let filesStats = {
            total: 0,
            currentMonth: 0,
            prevMonth: 0,
            growth: 0,
            isLoading: false
          };
          
          if (filesResponse.data.status === 'success' && Array.isArray(filesResponse.data.files)) {
            const allFiles = filesResponse.data.files;
            filesStats.total = allFiles.length;
            
            // Get current date info
            const now = new Date();
            const currentYear = now.getFullYear();
            const currentMonth = now.getMonth(); // 0-11
            
            // Calculate first and last day of current month
            const currentMonthStart = new Date(currentYear, currentMonth, 1);
            const currentMonthEnd = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59, 999);
            
            // Calculate first and last day of previous month
            const prevMonthStart = new Date(currentYear, currentMonth - 1, 1);
            const prevMonthEnd = new Date(currentYear, currentMonth, 0, 23, 59, 59, 999);
            
            // Count files created in current and previous month
            filesStats.currentMonth = allFiles.filter(file => {
              const fileDate = new Date(file.dateCreated);
              return fileDate >= currentMonthStart && fileDate <= currentMonthEnd;
            }).length;
            
            filesStats.prevMonth = allFiles.filter(file => {
              const fileDate = new Date(file.dateCreated);
              return fileDate >= prevMonthStart && fileDate <= prevMonthEnd;
            }).length;
            
            // Calculate growth percentage
            if (filesStats.prevMonth === 0) {
              filesStats.growth = filesStats.currentMonth > 0 ? 100 : 0;
            } else {
              filesStats.growth = ((filesStats.currentMonth - filesStats.prevMonth) / filesStats.prevMonth) * 100;
            }
            
            filesStats.growth = parseFloat(filesStats.growth.toFixed(2));
          }
          
          setStats({
            files: filesStats,
            orders: { 
              total: orders.total, 
              currentMonth: orders.currentMonth,
              prevMonth: orders.prevMonth,
              growth: orders.growth,
              isLoading: false 
            },
            revenue: { 
              total: revenue.total,
              currentMonth: revenue.currentMonth,
              prevMonth: revenue.prevMonth,
              growth: revenue.growth,
              isLoading: false 
            }
          });
        }

        // Fetch customer analytics data (same as CustomerAnalytics component)
        const customerResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/customer-analytics`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (customerResponse.data.status === 'success') {
          setCustomerAnalytics(customerResponse.data.analytics);
        }

        // Fetch top referral sources
        const referralsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/files/top-referenced`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (referralsResponse.data.status === 'success') {
          if (Array.isArray(referralsResponse.data.topReferencedFiles)) {
            setTopReferralSources(referralsResponse.data.topReferencedFiles);
          } else {
            console.warn('Top referral sources data is not an array:', referralsResponse.data);
            setTopReferralSources([]);
          }
        } else {
          console.warn('Failed to fetch top referral sources:', referralsResponse.data);
          setTopReferralSources([]);
        }
        setIsReferralsLoading(false);

        // Fetch recent files
        const filesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/files/recent`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          params: { limit: 10 }
        });

        // Fetch recent orders
        const ordersResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/admin/orders/getall`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          params: { limit: 10 }
        });

        // Combine recent files and orders into a single activity feed
        let recentFiles = [];
        let recentOrders = [];
        
        if (filesResponse.data.status === 'success' && Array.isArray(filesResponse.data.files)) {
          recentFiles = filesResponse.data.files.map(file => ({
            type: 'file',
            data: file,
            date: file.dateCreated
          }));
        } else {
          console.warn('Recent files data is not in expected format:', filesResponse.data);
        }

        if (ordersResponse.data.status === 'success' && Array.isArray(ordersResponse.data.orders)) {
          recentOrders = ordersResponse.data.orders.slice(0, 10).map(order => ({
            type: 'order',
            data: order,
            date: order.dateCreated
          }));
        } else {
          console.warn('Recent orders data is not in expected format:', ordersResponse.data);
        }

        // Combine and sort by date (newest first)
        const combinedActivity = [...recentFiles, ...recentOrders]
          .filter(item => item.date) // Ensure date exists
          .sort((a, b) => {
            try {
              return new Date(b.date) - new Date(a.date);
            } catch (e) {
              console.warn('Error sorting dates:', e);
              return 0;
            }
          })
          .slice(0, 15);

        setRecentActivity(combinedActivity);
        setIsActivityLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setStats(prev => ({
          files: { ...prev.files, isLoading: false },
          orders: { ...prev.orders, isLoading: false },
          revenue: { ...prev.revenue, isLoading: false }
        }));
        setIsActivityLoading(false);
        setIsReferralsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const filteredActivity = activeTab === 'all' 
    ? recentActivity 
    : recentActivity.filter(item => item.type === activeTab);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Calculate growth percentage
  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={FaFileAlt} 
          title="Files Uploaded" 
          value={stats.files.isLoading ? "0" : stats.files.currentMonth}
          color="cyan" 
          trend={{ value: stats.files.growth }}
          isLoading={stats.files.isLoading}
          subtitle={`${stats.files.total} total files`}
          comparisonText={`${stats.files.prevMonth} files last month`}
        />
        <StatCard 
          icon={FaShoppingCart} 
          title="Orders" 
          value={stats.orders.isLoading ? "0" : stats.orders.currentMonth}
          color="purple" 
          trend={{ value: stats.orders.growth }}
          isLoading={stats.orders.isLoading}
          subtitle={`${stats.orders.total} total orders`}
          comparisonText={`${stats.orders.prevMonth} orders last month`}
        />
        <StatCard 
          icon={FaMoneyBillWave} 
          title="Revenue" 
          value={stats.revenue.isLoading ? "$0.00" : formatCurrency(stats.revenue.currentMonth)}
          color="amber" 
          trend={{ value: stats.revenue.growth }}
          isLoading={stats.revenue.isLoading}
          subtitle={`${formatCurrency(stats.revenue.total)} total revenue`}
          comparisonText={`${formatCurrency(stats.revenue.prevMonth)} last month`}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-8">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white/90">Recent Activity</h3>
            <div className="flex items-center space-x-1 bg-[#1a1b1e]/50 rounded-lg p-1 border border-neutral-800/30">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors ${
                  activeTab === 'all' 
                    ? 'bg-gradient-to-r from-cyan-600/20 to-cyan-600/10 text-white' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab('file')}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors flex items-center ${
                  activeTab === 'file' 
                    ? 'bg-gradient-to-r from-cyan-600/20 to-cyan-600/10 text-white' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <FaFileAlt className="mr-1.5" /> Files
              </button>
              <button 
                onClick={() => setActiveTab('order')}
                className={`px-3 py-1.5 text-xs rounded-md transition-colors flex items-center ${
                  activeTab === 'order' 
                    ? 'bg-gradient-to-r from-cyan-600/20 to-cyan-600/10 text-white' 
                    : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <FaShoppingCart className="mr-1.5" /> Orders
              </button>
            </div>
          </div>
          
          <div className="bg-[#1a1b1e]/30 border border-neutral-800/30 rounded-xl max-h-[600px] overflow-y-auto">
            {isActivityLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cyan-500"></div>
              </div>
            ) : filteredActivity.length > 0 ? (
              <div className="divide-y divide-neutral-800/20">
                {filteredActivity.map((activity, index) => (
                  <ActivityItem 
                    key={`${activity.type}-${index}`}
                    type={activity.type}
                    data={activity.data}
                    date={activity.date}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-8">No recent activity to display</p>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <TopReferralSourcesCard 
            files={topReferralSources} 
            isLoading={isReferralsLoading} 
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;