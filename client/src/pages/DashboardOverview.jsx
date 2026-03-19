import React, { useEffect, useState } from 'react';
import { FiUsers, FiShoppingBag, FiTrendingUp, FiDatabase, FiLayers, FiBox, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import toast from 'react-hot-toast';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    Legend,
    AreaChart,
    Area
} from 'recharts';

const DashboardOverview = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await Axios({
                ...SummaryApi.orderStats
            });
            if (response.data.success) {
                setStats(response.data.data);
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || "Failed to fetch statistics");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Revenue",
            value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`,
            icon: <FiTrendingUp size={24} />,
            color: "bg-emerald-50 text-emerald-600",
            borderColor: "border-emerald-100"
        },
        {
            title: "Total Orders",
            value: stats?.totalOrders || 0,
            icon: <FiShoppingBag size={24} />,
            color: "bg-blue-50 text-blue-600",
            borderColor: "border-blue-100"
        },
        {
            title: "Total Customers",
            value: stats?.totalUsers || 0,
            icon: <FiUsers size={24} />,
            color: "bg-purple-50 text-purple-600",
            borderColor: "border-purple-100"
        },
        {
            title: "Total Products",
            value: stats?.totalProducts || 0,
            icon: <FiBox size={24} />,
            color: "bg-orange-50 text-orange-600",
            borderColor: "border-orange-100"
        },
        {
            title: "Total Categories",
            value: stats?.totalCategories || 0,
            icon: <FiLayers size={24} />,
            color: "bg-pink-50 text-pink-600",
            borderColor: "border-pink-100"
        },
        {
            title: "Total Sub Categories",
            value: stats?.totalSubCategories || 0,
            icon: <FiDatabase size={24} />,
            color: "bg-indigo-50 text-indigo-600",
            borderColor: "border-indigo-100"
        }
    ];

    const orderStats = [
        {
            title: "Delivered Orders",
            value: stats?.deliveredOrders || 0,
            icon: <FiCheckCircle size={20} />,
            color: "text-emerald-500",
            percentage: stats?.totalOrders ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100) : 0
        },
        {
            title: "Canceled Orders",
            value: stats?.canceledOrders || 0,
            icon: <FiXCircle size={20} />,
            color: "text-red-500",
            percentage: stats?.totalOrders ? Math.round((stats.canceledOrders / stats.totalOrders) * 100) : 0
        },
        {
            title: "In Progress",
            value: stats?.receivedOrders || 0,
            icon: <FiShoppingBag size={20} />,
            color: "text-blue-500",
            percentage: stats?.totalOrders ? Math.round((stats.receivedOrders / stats.totalOrders) * 100) : 0
        }
    ];

    return (
        <div className="p-4 lg:p-6 bg-gray-50/50 min-h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                <p className="text-gray-500 mt-1">Real-time statistics for your store</p>
            </div>

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {statCards.map((card, index) => (
                    <div 
                        key={index} 
                        className={`bg-white p-6 rounded-2xl border ${card.borderColor} shadow-sm transition-all duration-300 hover:shadow-md group`}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{card.title}</p>
                                <h2 className="text-2xl font-bold text-gray-900 mt-1 group-hover:text-emerald-600 transition-colors">
                                    {card.value}
                                </h2>
                            </div>
                            <div className={`${card.color} p-4 rounded-xl transition-transform duration-300 group-hover:scale-110`}>
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Sales Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-gray-800">Revenue Analysis</h3>
                        <div className="flex items-center gap-2">
                             <div className="flex items-center gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                                <span className="text-xs text-gray-500 font-medium uppercase">Revenue</span>
                             </div>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={stats?.monthlyStats || []}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(value) => `₹${value >= 1000 ? (value / 1000) + 'k' : value}`}
                                />
                                <RechartsTooltip 
                                    contentStyle={{ 
                                        backgroundColor: '#fff', 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                                    }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#10b981" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorRev)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Orders Breakdown */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-800 mb-6">Order Statistics</h3>
                    <div className="space-y-6">
                        {orderStats.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className={item.color}>{item.icon}</span>
                                        <span className="text-sm font-medium text-gray-600">{item.title}</span>
                                    </div>
                                    <span className="text-sm font-bold text-gray-900">{item.value}</span>
                                </div>
                                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full ${item.color.replace('text', 'bg')}`} 
                                        style={{ width: `${item.percentage}%` }}
                                    />
                                </div>
                                <div className="flex justify-end mt-1">
                                    <span className="text-[10px] text-gray-400 font-medium uppercase">{item.percentage}% of total</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                        <p className="text-sm text-emerald-800 font-medium">Business Performance</p>
                        <p className="text-xs text-emerald-600 mt-1">Your store is performing well this month. Keep it up!</p>
                    </div>
                </div>
            </div>

            {/* Additional Order Charts (Bar) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800">Order Volume</h3>
                </div>
                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={stats?.monthlyStats || []}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis 
                                dataKey="name" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                            />
                            <RechartsTooltip 
                                cursor={{ fill: '#f9fafb' }}
                                contentStyle={{ 
                                    backgroundColor: '#fff', 
                                    borderRadius: '12px', 
                                    border: 'none', 
                                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
                                }}
                            />
                            <Bar 
                                dataKey="orders" 
                                fill="#3b82f6" 
                                radius={[4, 4, 0, 0]} 
                                barSize={40}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
