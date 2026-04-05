"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, MessageSquare, FileUp, TrendingUp } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";

function AdminDashboardContent() {
  const [stats, setStats] = useState({
    totalClients: 0,
    totalMessages: 0,
    totalFiles: 0,
    todayMessages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Get total clients
        const { count: clientCount } = await supabase
          .from("clients")
          .select("*", { count: "exact", head: true });

        // Get total messages
        const { count: messageCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true });

        // Get total files
        const { count: fileCount } = await supabase
          .from("file_uploads")
          .select("*", { count: "exact", head: true });

        // Get today's messages
        const today = new Date().toISOString().split("T")[0];
        const { count: todayCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .gte("created_at", `${today}T00:00:00`)
          .lt("created_at", `${today}T23:59:59`);

        setStats({
          totalClients: clientCount || 0,
          totalMessages: messageCount || 0,
          totalFiles: fileCount || 0,
          todayMessages: todayCount || 0,
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const statItems = [
    { label: "Total Clients", value: stats.totalClients, icon: Users },
    { label: "Total Messages", value: stats.totalMessages, icon: MessageSquare },
    { label: "Files Uploaded", value: stats.totalFiles, icon: FileUp },
    { label: "Today Messages", value: stats.todayMessages, icon: TrendingUp },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Administrator Dashboard
        </h1>
        <p className="text-gray-400">
          Manage clients, messages, and track platform metrics
        </p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={containerVariants}
      >
        {statItems.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass rounded-lg p-6 hover:bg-white/10 transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <Icon size={32} className="text-purple-500/50" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Welcome Section */}
      <motion.div
        variants={itemVariants}
        className="glass rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-6 gradient-text">Welcome to Admin Panel</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <h3 className="font-semibold text-cyan-400 mb-2">👥 Manage Clients</h3>
            <p className="text-sm text-gray-400">
              View all registered clients, their information, and communication history
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <h3 className="font-semibold text-cyan-400 mb-2">💬 Chat Management</h3>
            <p className="text-sm text-gray-400">
              Respond to client messages and maintain productive communication
            </p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
            <h3 className="font-semibold text-cyan-400 mb-2">📊 Analytics</h3>
            <p className="text-sm text-gray-400">
              View real-time analytics and visitor tracking data
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Links */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <a
          href="/admin/clients"
          className="glass rounded-lg p-6 hover:bg-white/10 transition-all group"
        >
          <Users size={32} className="text-purple-500 mb-4 group-hover:text-purple-400" />
          <h3 className="text-xl font-bold mb-2">View All Clients</h3>
          <p className="text-gray-400">Access the complete client directory</p>
        </a>
        <a
          href="/admin/messages"
          className="glass rounded-lg p-6 hover:bg-white/10 transition-all group"
        >
          <MessageSquare size={32} className="text-purple-500 mb-4 group-hover:text-purple-400" />
          <h3 className="text-xl font-bold mb-2">Message Management</h3>
          <p className="text-gray-400">Respond to client messages</p>
        </a>
      </motion.div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  return (
    <AdminDashboardLayout>
      <AdminDashboardContent />
    </AdminDashboardLayout>
  );
}
