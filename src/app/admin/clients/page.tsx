"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader, Mail, Users } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import type { Client } from "@/types/database";

function ClientsContent() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setClients(data || []);

        // Subscribe to real-time updates
        const subscription = supabase
          .channel("clients")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "clients" },
            (payload) => {
              if (payload.eventType === "INSERT") {
                setClients((prev) => [payload.new as Client, ...prev]);
                toast.success("New client registered!");
              } else if (payload.eventType === "UPDATE") {
                setClients((prev) =>
                  prev.map((c) =>
                    c.id === (payload.new as Client).id ? (payload.new as Client) : c
                  )
                );
              }
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(subscription);
        };
      } catch (error) {
        console.error("Error loading clients:", error);
        toast.error("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-purple-500" />
          <p className="text-gray-400">Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Client Management</h1>
        <p className="text-gray-400">
          View and manage all registered clients
        </p>
      </div>

      {/* Search */}
      <div className="glass rounded-lg p-4">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 bg-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-500"
        />
      </div>

      {/* Clients List */}
      <div className="glass rounded-lg overflow-hidden">
        {filteredClients.length === 0 ? (
          <div className="p-12 text-center">
            <Users size={48} className="mx-auto text-gray-500 mb-4" />
            <p className="text-gray-400">
              {searchTerm ? "No clients matching your search" : "No clients yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, index) => (
                  <motion.tr
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">{client.name}</td>
                    <td className="px-6 py-4">
                      <a
                        href={`mailto:${client.email}`}
                        className="text-purple-400 hover:text-purple-300 flex items-center gap-2"
                      >
                        <Mail size={16} />
                        {client.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {client.company || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {new Date(client.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={`/admin/clients/${client.id}`}
                        className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-sm text-purple-300 transition-colors"
                      >
                        View
                      </a>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="glass rounded-lg p-6">
          <h3 className="font-semibold mb-4">Total Clients</h3>
          <p className="text-3xl font-bold text-purple-400">{clients.length}</p>
        </div>
        <div className="glass rounded-lg p-6">
          <h3 className="font-semibold mb-4">New This Month</h3>
          <p className="text-3xl font-bold text-purple-400">
            {
              clients.filter(
                (c) =>
                  new Date(c.created_at) >
                  new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
              ).length
            }
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function ClientsPage() {
  return (
    <AdminDashboardLayout>
      <ClientsContent />
    </AdminDashboardLayout>
  );
}
