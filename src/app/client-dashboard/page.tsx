"use client";

import { ClientDashboardLayout } from "@/components/ClientDashboardLayout";
import { motion } from "framer-motion";
import { MessageSquare, FileUp, Zap } from "lucide-react";
import Link from "next/link";

function DashboardContent() {
  const stats = [
    { label: "Active Projects", value: "1", icon: Zap },
    { label: "Unread Messages", value: "0", icon: MessageSquare },
    { label: "Files Uploaded", value: "0", icon: FileUp },
  ];

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-bold gradient-text mb-2">
          Welcome to Your Dashboard
        </h1>
        <p className="text-gray-400">
          Manage your projects, chat with us, and track your deliverables
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {stats.map((stat, index) => {
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
                <Icon size={32} className="text-cyan-500/50" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="glass rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/client-dashboard/messages"
            className="p-6 glass rounded-lg hover:bg-white/10 transition-all group"
          >
            <MessageSquare size={24} className="text-cyan-500 mb-3" />
            <h3 className="font-semibold group-hover:text-cyan-400">
              Message Admin
            </h3>
            <p className="text-sm text-gray-400">Send a message to discuss your project</p>
          </Link>
          <Link
            href="/client-dashboard/files"
            className="p-6 glass rounded-lg hover:bg-white/10 transition-all group"
          >
            <FileUp size={24} className="text-cyan-500 mb-3" />
            <h3 className="font-semibold group-hover:text-cyan-400">
              Upload Files
            </h3>
            <p className="text-sm text-gray-400">
              Share files with your project manager
            </p>
          </Link>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div variants={itemVariants} className="glass rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-white/10">
            <div className="w-2 h-2 bg-cyan-500 rounded-full" />
            <div>
              <p className="font-semibold">Account Created</p>
              <p className="text-sm text-gray-400">Your account was successfully created</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ClientDashboard() {
  return (
    <ClientDashboardLayout>
      <DashboardContent />
    </ClientDashboardLayout>
  );
}
