"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import { Loader, TrendingUp, Users, Eye } from "lucide-react";

interface AnalyticsData {
  totalVisitors: number;
  totalPageViews: number;
  dailyData: Array<{
    date: string;
    visitors: number;
    page_views: number;
    country?: string;
    device_type?: string;
  }>;
  deviceStats: Record<string, number>;
  countryStats: Record<string, number>;
}

function AnalyticsContent() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics');
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      } else {
        // Fallback to mock data if API fails
        setData(getMockData());
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setData(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = (): AnalyticsData => ({
    totalVisitors: 1234,
    totalPageViews: 5678,
    dailyData: [
      { date: "2024-01-01", visitors: 234, page_views: 521 },
      { date: "2024-01-02", visitors: 321, page_views: 687 },
      { date: "2024-01-03", visitors: 289, page_views: 623 },
      { date: "2024-01-04", visitors: 412, page_views: 789 },
      { date: "2024-01-05", visitors: 501, page_views: 1023 },
      { date: "2024-01-06", visitors: 389, page_views: 756 },
      { date: "2024-01-07", visitors: 423, page_views: 891 },
    ],
    deviceStats: { desktop: 45, mobile: 40, tablet: 15 },
    countryStats: {
      "United States": 1245,
      "United Kingdom": 856,
      "Canada": 743,
      "Australia": 612,
      "Germany": 534,
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-cyan-500" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  // Prepare chart data
  const chartData = data.dailyData.map(day => ({
    date: new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    visitors: day.visitors,
    pageViews: day.page_views,
  }));

  const deviceData = Object.entries(data.deviceStats).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    fill: name === 'desktop' ? '#00d4ff' : name === 'mobile' ? '#7c3aed' : '#ec4899',
  }));

  const countryData = Object.entries(data.countryStats)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([country, visitors]) => ({ country, visitors }));

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Analytics</h1>
        <p className="text-gray-400">
          Real-time visitor tracking and insights
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass p-6 rounded-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/20 rounded-lg">
              <Users className="w-6 h-6 text-cyan-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.totalVisitors.toLocaleString()}</p>
              <p className="text-gray-400">Total Visitors</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass p-6 rounded-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <Eye className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{data.totalPageViews.toLocaleString()}</p>
              <p className="text-gray-400">Page Views</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass p-6 rounded-lg"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {data.totalVisitors > 0 ? ((data.totalPageViews / data.totalVisitors) * 100).toFixed(1) : '0'}%
              </p>
              <p className="text-gray-400">Avg. Pages/Visit</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Visitors Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass p-6 rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Visitors Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Line
                type="monotone"
                dataKey="visitors"
                stroke="#00d4ff"
                strokeWidth={2}
                dot={{ fill: '#00d4ff' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Device Types */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass p-6 rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Device Types</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={deviceData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {deviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Countries */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass p-6 rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Top Countries</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="country" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="visitors" fill="#7c3aed" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Page Views vs Visitors */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="glass p-6 rounded-lg"
        >
          <h3 className="text-xl font-semibold mb-4">Page Views vs Visitors</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="visitors" fill="#00d4ff" name="Visitors" />
              <Bar dataKey="pageViews" fill="#ec4899" name="Page Views" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function AnalyticsPage() {
  return (
    <AdminDashboardLayout>
      <AnalyticsContent />
    </AdminDashboardLayout>
  );
}
