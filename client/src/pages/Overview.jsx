// frontend/src/pages/Overview.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { FiUsers, FiPackage, FiXCircle, FiTrendingUp } from "react-icons/fi";

const Overview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    canceledOrders: 0,
    deliveredOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await Axios(SummaryApi.orderStats);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch statistics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Generate dummy time series data for the graph
  const generateChartData = () => {
    const now = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      data.push({
        date: date.toISOString().slice(5, 10), // e.g., "04-27"
        users: Math.floor(stats.totalUsers * (0.8 + Math.random() * 0.4)),
        orders: Math.floor(stats.totalOrders * (0.8 + Math.random() * 0.4)),
        canceled: Math.floor(stats.canceledOrders * (0.8 + Math.random() * 0.4)),
        delivered: Math.floor(stats.deliveredOrders * (0.8 + Math.random() * 0.4)),
      });
    }
    return data;
  };

  const chartData = generateChartData();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      icon: <FiUsers size={24} />,
      value: stats.totalUsers,
      label: 'Total Users',
      color: 'bg-indigo-50 text-indigo-600',
      borderColor: 'border-indigo-100/50'
    },
    {
      icon: <FiPackage size={24} />,
      value: stats.totalOrders,
      label: 'Total Orders',
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'border-emerald-100/50'
    },
    {
      icon: <FiXCircle size={24} />,
      value: stats.canceledOrders,
      label: 'Canceled Orders',
      color: 'bg-rose-50 text-rose-600',
      borderColor: 'border-rose-100/50'
    }
  ];

  return (
    <div className="bg-white min-h-full">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Overview</h1>
        <p className="text-gray-500 mt-1 font-medium">Quick summary of your platform's performance</p>
      </div>

      {/* Line Chart Section */}
      <div className="hidden md:block bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mb-8">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-slate-800">Platform Growth (Last 7 Days)</h3>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Users</span>
             </div>
             <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders</span>
             </div>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  padding: '12px'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="users" 
                stroke="#6366f1" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Users" 
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#10b981" 
                strokeWidth={4} 
                dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }} 
                activeDot={{ r: 6, strokeWidth: 0 }}
                name="Orders" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((item, index) => (
          <div 
            key={index}
            className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${item.color} p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 shadow-sm`}>
                {item.icon}
              </div>
              <div className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">Active Metric</div>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {item.value || 0}
            </h2>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">
              {item.label}
            </p>
            
            <div className="mt-6 flex items-center gap-2 text-[11px] font-bold text-emerald-500 bg-emerald-50/50 w-fit px-2 py-1 rounded-lg">
                <FiTrendingUp size={12} />
                <span>+12.5% Inc</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;

