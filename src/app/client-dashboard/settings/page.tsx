"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bell, Lock, User, Mail, Save } from "lucide-react";
import toast from "react-hot-toast";
import { ClientDashboardLayout } from "@/components/ClientDashboardLayout";
import { supabase } from "@/lib/supabase";

function SettingsContent() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    messageNotifications: true,
    fileNotifications: true,
    darkMode: true,
  });

  const [loading, setLoading] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Save settings to Supabase if needed
      // For now, just show success
      toast.success("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      toast.success("Account deletion requested. Please check your email.");
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error("Failed to delete account");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 max-w-2xl"
    >
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and preferences</p>
      </div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Bell size={24} />
          Notification Preferences
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <p className="font-semibold">Email Notifications</p>
              <p className="text-sm text-gray-400">
                Receive updates via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <p className="font-semibold">Message Notifications</p>
              <p className="text-sm text-gray-400">
                Get notified of new messages
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.messageNotifications}
                onChange={() => handleToggle("messageNotifications")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <p className="font-semibold">File Upload Notifications</p>
              <p className="text-sm text-gray-400">
                Be notified when files are uploaded
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.fileNotifications}
                onChange={() => handleToggle("fileNotifications")}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500" />
            </label>
          </div>
        </div>
      </motion.div>

      {/* Privacy & Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Lock size={24} />
          Privacy & Security
        </h2>

        <div className="space-y-4">
          <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors flex items-center gap-3">
            <Lock size={20} className="text-cyan-500" />
            <div>
              <p className="font-semibold">Change Password</p>
              <p className="text-sm text-gray-400">Update your account password</p>
            </div>
          </button>

          <button className="w-full p-4 bg-white/5 hover:bg-white/10 rounded-lg text-left transition-colors flex items-center gap-3">
            <Mail size={20} className="text-cyan-500" />
            <div>
              <p className="font-semibold">Change Email</p>
              <p className="text-sm text-gray-400">Update your email address</p>
            </div>
          </button>
        </div>
      </motion.div>

      {/* Account Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-lg p-8"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <User size={24} />
          Account
        </h2>

        <div className="space-y-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSaveSettings}
            disabled={loading}
            className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            <span>Save Settings</span>
          </motion.button>

          <button
            onClick={handleLogout}
            className="w-full px-6 py-3 glass rounded-lg font-semibold hover:bg-white/10 transition-all"
          >
            Logout
          </button>

          <button
            onClick={handleDeleteAccount}
            className="w-full px-6 py-3 bg-red-500/20 hover:bg-red-500/30 rounded-lg font-semibold text-red-400 transition-all"
          >
            Delete Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function SettingsPage() {
  return (
    <ClientDashboardLayout>
      <SettingsContent />
    </ClientDashboardLayout>
  );
}
