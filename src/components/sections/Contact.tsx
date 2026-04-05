"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, MessageCircle, Send } from "lucide-react";
import { autoCreateClient } from "@/lib/supabase";

export function ContactSection() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Auto-create client and send first message
      const result = await autoCreateClient(
        formData.email,
        formData.name,
        formData.message
      );

      if (result.error) {
        toast.error("Failed to send message. Please try again.");
        console.error(result.error);
      } else {
        toast.success("Message sent! Check your email to verify.");
        setFormData({ name: "", email: "", message: "" });
        // Redirect to client dashboard after a delay
        setTimeout(() => {
          router.push("/client-dashboard");
        }, 2000);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Get In Touch
          </h2>
          <p className="text-gray-400 text-lg mb-12">
            Have a project in mind? Let's start a conversation and bring your
            ideas to life.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div variants={itemVariants} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-500">
                  <Mail size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Email</h3>
                <p className="text-gray-400">hello@example.com</p>
                <p className="text-gray-500 text-sm">
                  Typically responds within 2 hours
                </p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400">
                  <MessageCircle size={24} />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Chat</h3>
                <p className="text-gray-400">Use the form to start chatting</p>
                <p className="text-gray-500 text-sm">
                  Instant messaging with your dedicated project manager
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="glass rounded-lg p-6 mt-8"
            >
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#services" className="text-cyan-400 hover:text-cyan-300">
                    → View Services
                  </a>
                </li>
                <li>
                  <a href="#portfolio" className="text-cyan-400 hover:text-cyan-300">
                    → See Portfolio
                  </a>
                </li>
                <li>
                  <a href="/client-dashboard" className="text-cyan-400 hover:text-cyan-300">
                    → Client Portal
                  </a>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.form
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder-gray-500"
                placeholder="Your name"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder-gray-500"
                placeholder="your@email.com"
              />
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                required
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                rows={5}
                className="w-full px-4 py-3 glass rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all placeholder-gray-500 resize-none"
                placeholder="Tell me about your project..."
              />
            </motion.div>

            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Sending...</span>
              ) : (
                <>
                  <Send size={18} />
                  <span>Send Message</span>
                </>
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
