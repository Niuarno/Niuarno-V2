"use client";

import { motion } from "framer-motion";

const skillsData = [
  {
    category: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Framer Motion",
      "Three.js",
    ],
  },
  {
    category: "Backend",
    skills: [
      "Node.js",
      "Express.js",
      "PostgreSQL",
      "Supabase",
      "WebSockets",
      "REST APIs",
    ],
  },
  {
    category: "Tools & DevOps",
    skills: [
      "Git",
      "Docker",
      "Vercel",
      "GitHub",
      "AWS",
      "CI/CD",
    ],
  },
  {
    category: "Design",
    skills: [
      "Figma",
      "UI/UX Design",
      "Responsive Design",
      "Animation Design",
      "Accessibility",
      "Performance",
    ],
  },
];

export function SkillsSection() {
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
    <section id="skills" className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 gradient-text">
            Tech Stack
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {skillsData.map((skillGroup, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass rounded-lg p-6 hover:bg-white/10 transition-all"
            >
              <h3 className="text-cyan-400 font-bold mb-4">
                {skillGroup.category}
              </h3>
              <div className="space-y-3">
                {skillGroup.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skillIndex}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: skillIndex * 0.05 }}
                    className="flex items-center"
                  >
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-3" />
                    <span className="text-gray-300">{skill}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
