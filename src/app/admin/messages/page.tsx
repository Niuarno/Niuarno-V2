"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader, Users } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { AdminDashboardLayout } from "@/components/AdminDashboardLayout";
import type { Message, Client } from "@/types/database";

function AdminMessagesContent() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load clients
  useEffect(() => {
    const loadClients = async () => {
      try {
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setClients(data || []);
        if (data && data.length > 0) {
          setSelectedClientId(data[0].id);
        }
      } catch (error) {
        console.error("Error loading clients:", error);
        toast.error("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    loadClients();
  }, []);

  // Load messages for selected client
  useEffect(() => {
    if (!selectedClientId) return;

    const loadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .eq("client_id", selectedClientId)
          .order("created_at", { ascending: true });

        if (error) throw error;
        setMessages(data || []);
        scrollToBottom();
      } catch (error) {
        console.error("Error loading messages:", error);
        toast.error("Failed to load messages");
      }
    };

    loadMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel("messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `client_id=eq.${selectedClientId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [selectedClientId]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedClientId || sending) return;

    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert([
        {
          client_id: selectedClientId,
          admin_id: "admin",
          content: newMessage,
          sender_type: "admin",
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-purple-500" />
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-screen gap-6"
    >
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Client Messages</h1>
        <p className="text-gray-400">Manage and respond to client inquiries</p>
      </div>

      <div className="flex flex-1 gap-6 min-h-0">
        {/* Clients List */}
        <div className="w-64 glass rounded-lg overflow-y-auto flex-shrink-0">
          <div className="p-4 border-b border-white/10 sticky top-0 bg-black/50">
            <h3 className="font-semibold flex items-center gap-2">
              <Users size={18} />
              Clients
            </h3>
          </div>
          <div className="divide-y divide-white/10">
            {clients.length === 0 ? (
              <div className="p-4 text-center text-gray-400 text-sm">
                No clients yet
              </div>
            ) : (
              clients.map((client) => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClientId(client.id)}
                  className={`w-full text-left p-4 hover:bg-white/10 transition-colors ${
                    selectedClientId === client.id ? "bg-purple-500/20" : ""
                  }`}
                >
                  <p className="font-semibold truncate">{client.name}</p>
                  <p className="text-xs text-gray-400 truncate">{client.email}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 glass rounded-lg p-6 flex flex-col gap-4 overflow-hidden">
          {selectedClientId ? (
            <>
              {/* Messages Container */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-4">
                {messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <p className="text-gray-400 mb-2">No messages yet</p>
                      <p className="text-sm text-gray-500">
                        Start a conversation below
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${
                          msg.sender_type === "admin"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-xs px-4 py-2 rounded-lg ${
                            msg.sender_type === "admin"
                              ? "bg-purple-500/20 text-purple-100"
                              : "bg-white/10 text-gray-100"
                          }`}
                        >
                          <p className="break-words">{msg.content}</p>
                          <p className="text-xs opacity-70 mt-1">
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-3 mt-auto">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your response..."
                  disabled={sending}
                  className="flex-1 px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-500 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {sending ? (
                    <Loader size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Select a client to view messages</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function AdminMessagesPage() {
  return (
    <AdminDashboardLayout>
      <AdminMessagesContent />
    </AdminDashboardLayout>
  );
}
