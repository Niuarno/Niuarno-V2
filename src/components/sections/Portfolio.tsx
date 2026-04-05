"use client";

import { motion } from "framer-motion";
import { ExternalLink, Code } from "lucide-react";

const portfolioProjects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "Full-stack e-commerce solution with real-time inventory",
    image: "/placeholder-project-1.jpg",
    technologies: ["Next.js", "Stripe", "PostgreSQL", "Tailwind"],
    link: "#",
    github: "#",
  },
  {
    id: 2,
    title: "SaaS Dashboard",
    description: "Analytics dashboard with real-time data visualization",
    image: "/placeholder-project-2.jpg",
    technologies: ["React", "D3.js", "Firebase", "Material-UI"],
    link: "#",
    github: "#",
  },
  {
    id: 3,
    title: "Mobile App",
    description: "Cross-platform mobile application with Expo",
    image: "/placeholder-project-3.jpg",
    technologies: ["React Native", "Expo", "Firebase"],
    link: "#",
    github: "#",
  },
  {
    id: 4,
    title: "Real-Time Chat App",
    description: "Instant messaging platform with WebSockets",
    image: "/placeholder-project-4.jpg",
    technologies: ["Socket.io", "Node.js", "React"],
    link: "#",
    github: "#",
  },
];

export function PortfolioSection() {
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
    <section id="portfolio" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 gradient-text">
            Featured Projects
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {portfolioProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group glass rounded-lg overflow-hidden hover:bg-white/15 transition-all cursor-pointer"
            >
              {/* Project Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📸</div>
                    <p className="text-sm">Project Preview</p>
                  </div>
                </div>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0"
                  initial={{ x: -100 }}
                  whileHover={{ x: 100 }}
                  transition={{ duration: 0.8 }}
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-400 mb-4">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/5 rounded-full text-sm text-gray-300 hover:bg-white/10 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4">
                  <motion.a
                    href={project.link}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors"
                  >
                    <ExternalLink size={18} />
                    <span>View</span>
                  </motion.a>
                  <motion.a
                    href={project.github}
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Code size={18} />
                    <span>Code</span>
                  </motion.a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
