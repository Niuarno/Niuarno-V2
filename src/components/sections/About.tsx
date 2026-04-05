"use client";

import { motion } from "framer-motion";

export function AboutSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-black/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-12 gradient-text">
            About Me
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <motion.p
              variants={itemVariants}
              className="text-gray-300 text-lg leading-relaxed"
            >
              I'm a passionate web developer with 5+ years of experience building
              high-performance, visually stunning digital experiences. I
              specialize in creating interactive applications that combine
              cutting-edge design with robust functionality.
            </motion.p>

            <motion.p
              variants={itemVariants}
              className="text-gray-300 text-lg leading-relaxed"
            >
              My approach focuses on understanding client needs, delivering
              scalable solutions, and maintaining the highest standards of code
              quality. I love working with modern technologies and staying at
              the forefront of web development trends.
            </motion.p>

            <motion.div variants={itemVariants} className="space-y-3">
              <h3 className="text-xl font-semibold text-cyan-400">Services</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3" />
                  <span className="text-gray-300">Web Design & Development</span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3" />
                  <span className="text-gray-300">
                    Full-Stack Applications
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3" />
                  <span className="text-gray-300">
                    Performance Optimization
                  </span>
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-3" />
                  <span className="text-gray-300">
                    Real-Time Applications
                  </span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="glass rounded-lg p-8"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-cyan-400 font-semibold mb-2">Experience</h3>
                <p className="text-gray-300">5+ Years in Web Development</p>
              </div>
              <div>
                <h3 className="text-cyan-400 font-semibold mb-2">Projects</h3>
                <p className="text-gray-300">50+ Successful Projects</p>
              </div>
              <div>
                <h3 className="text-cyan-400 font-semibold mb-2">
                  Satisfaction Rate
                </h3>
                <p className="text-gray-300">99% Client Satisfaction</p>
              </div>
              <div>
                <h3 className="text-cyan-400 font-semibold mb-2">
                  Average Delivery
                </h3>
                <p className="text-gray-300">2 Weeks Project Completion</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
