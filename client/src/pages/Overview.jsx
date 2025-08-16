// frontend/src/pages/Overview.jsx
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Axios from "../utils/Axios";
import SummaryApi from "../common/SummaryApi";
import toast from "react-hot-toast";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from "@mui/material";
import { FiUsers, FiPackage, FiXCircle } from "react-icons/fi";

const Overview = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    canceledOrders: 0,
    deliveredOrders: 0,
  });

  const fetchStats = async () => {
    try {
      const response = await Axios(SummaryApi.orderStats);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch statistics");
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

  return (
    <Box sx={{ p: 3 }}>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
            Overview
          </Typography>
        </CardContent>
      </Card>

      {/* Line Chart */}
      <Card
  sx={{
    mb: 3,
    p: 2,
    display: { xs: 'none', md: 'block' } // 👈 MUI way
  }}
>
  <Typography variant="h6" sx={{ mb: 2 }}>
    Statistics (Last 7 Days)
  </Typography>
  <Box sx={{ width: '100%', height: { xs: 250, sm: 300 } }}>
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="users" stroke="#3498db" strokeWidth={2} dot={{ r: 3 }} name="Users" />
        <Line type="monotone" dataKey="orders" stroke="#2ecc71" strokeWidth={2} dot={{ r: 3 }} name="Orders" />
        <Line type="monotone" dataKey="canceled" stroke="#e74c3c" strokeWidth={2} dot={{ r: 3 }} name="Canceled" />
        <Line type="monotone" dataKey="delivered" stroke="#9b59b6" strokeWidth={2} dot={{ r: 3 }} name="Delivered" />
      </LineChart>
    </ResponsiveContainer>
  </Box>
</Card>


      {/* Cards */}
      <Grid container spacing={3} alignItems="stretch">
  {[{
    icon: <FiUsers size={30} style={{ color: '#3498db' }} />,
    value: stats.totalUsers,
    label: 'Total Users',
  }, {
    icon: <FiPackage size={30} style={{ color: '#2ecc71' }} />,
    value: stats.totalOrders,
    label: 'Total Orders',
  }, {
    icon: <FiXCircle size={30} style={{ color: '#e74c3c' }} />,
    value: stats.canceledOrders,
    label: 'Canceled Orders',
  }].map((item, index) => (
    <Grid item xs={12} sm={6} md={4} key={index}>
      <Card sx={{ height: '100%' }}>
      <CardContent
  sx={{
    display: 'flex',
    alignItems: 'center',
    gap: 2,
    height: '100px',
    px: 2, // increase horizontal padding
    py: 3, // optional vertical padding
  }}
>

          {item.icon}
          <Box>
            <Typography variant="h6">{item.value}</Typography>
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  ))}
</Grid>

    </Box>
  );
};

export default Overview;
