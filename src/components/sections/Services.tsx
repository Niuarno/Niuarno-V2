"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { autoCreateClient } from "@/lib/supabase";

const services = [
  {
    id: "basic",
    name: "Basic",
    price: 299,
    description: "Perfect for small projects",
    deliveryDays: 7,
    features: [
      "Up to 3 pages",
      "Responsive design",
      "Basic animations",
      "SEO optimization",
      "Production deployment",
      "1 month support",
    ],
    badge: null,
    cta: "Get Started",
  },
  {
    id: "standard",
    name: "Standard",
    price: 699,
    description: "Best for growing businesses",
    deliveryDays: 14,
    features: [
      "Up to 10 pages",
      "Advanced features",
      "Real-time interactions",
      "Database integration",
      "Admin panel",
      "Analytics setup",
      "3 months support",
    ],
    badge: "Most Popular",
    cta: "Get Started",
  },
  {
    id: "premium",
    name: "Premium",
    price: 1499,
    description: "Enterprise-grade solutions",
    deliveryDays: 21,
    features: [
      "Unlimited pages",
      "Custom features",
      "Full-stack development",
      "AI integration",
      "Advanced security",
      "Performance optimization",
      "6 months support",
      "Priority support",
    ],
    badge: null,
    cta: "Get Started",
  },
];

export function ServicesSection() {
  const router = useRouter();

  const handleOrderService = async (serviceId: string) => {
    try {
      // For demo purposes, we'll redirect to contact form
      // In production, this would create an order and start chat
      toast.success(`Interest registered for ${serviceId} package!`);
      router.push("#contact");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    }
  };
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">
            Services & Packages
          </h2>
          <p className="text-gray-400 text-lg mb-12">
            Choose the package that best fits your project needs
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              variants={itemVariants}
              className={`relative rounded-lg p-8 transition-all duration-300 ${
                service.badge
                  ? "glass scale-105 border-2 border-cyan-500/50"
                  : "glass hover:bg-white/10"
              }`}
            >
              {service.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-1 rounded-full text-sm font-semibold">
                    {service.badge}
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">{service.name}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {service.description}
                </p>
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold">${service.price}</span>
                  <span className="text-gray-400">one-time</span>
                </div>
                <p className="text-sm text-cyan-400">
                  ⏱️ {service.deliveryDays} days delivery
                </p>
              </div>

              <ul className="space-y-4 mb-8">
                {service.features.map((feature, featureIndex) => (
                  <motion.li
                    key={featureIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: featureIndex * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <Check size={20} className="text-cyan-500 flex-shrink-0 mt-1" />
                    <span className="text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              <button
                onClick={() => handleOrderService(service.id)}
                className={`block w-full py-3 rounded-lg font-semibold text-center transition-all ${
                  service.badge
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50"
                    : "glass hover:bg-white/10"
                }`}
              >
                {service.cta}
              </button>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <p className="text-gray-400 mb-4">
            Need a custom solution? Let's discuss your project.
          </p>
          <Link
            href="#contact"
            className="inline-block px-8 py-3 glass rounded-lg hover:bg-white/10 transition-all"
          >
            Start a Conversation
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
