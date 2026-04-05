"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { ClientDashboardLayout } from "@/components/ClientDashboardLayout";
import type { Message } from "@/types/database";

function MessagesContent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [clientId, setClientId] = useState<string | null>(null);

  useEffect(() => {
    // Get current user
    const getClient = async () => {
      try {
        const session = await supabase.auth.getSession();
        if (!session.data?.session?.user?.email) {
          toast.error("Please login first");
          return;
        }

        // Fetch client record
        const { data: client, error } = await supabase
          .from("clients")
          .select("id")
          .eq("email", session.data.session.user.email)
          .single();

        if (error) throw error;
        setClientId(client.id);

        // Fetch messages
        await fetchMessages(client.id);

        // Subscribe to new messages
        const subscription = supabase
          .channel("messages")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `client_id=eq.${client.id}`,
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
      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load messages");
      } finally {
        setLoading(false);
      }
    };

    getClient();
  }, []);

  const fetchMessages = async (cid: string) => {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("client_id", cid)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMessages(data || []);
      scrollToBottom();
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !clientId || sending) return;

    setSending(true);
    try {
      const { error } = await supabase.from("messages").insert([
        {
          client_id: clientId,
          content: newMessage,
          sender_type: "client",
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
          <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-cyan-500" />
          <p className="text-gray-400">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col h-full gap-6"
    >
      <div>
        <h1 className="text-4xl font-bold gradient-text mb-2">Messages</h1>
        <p className="text-gray-400">
          Chat with your dedicated project manager
        </p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 glass rounded-lg p-6 overflow-y-auto flex flex-col gap-4 max-h-[500px]">
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
                  msg.sender_type === "client" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    msg.sender_type === "client"
                      ? "bg-cyan-500/20 text-cyan-100"
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
      <form onSubmit={handleSendMessage} className="flex gap-3">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
          disabled={sending}
          className="flex-1 px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder-gray-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={sending || !newMessage.trim()}
          className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {sending ? (
            <Loader size={18} className="animate-spin" />
          ) : (
            <Send size={18} />
          )}
          <span>Send</span>
        </button>
      </form>
    </motion.div>
  );
}

export default function MessagesPage() {
  return (
    <ClientDashboardLayout>
      <MessagesContent />
    </ClientDashboardLayout>
  );
}
