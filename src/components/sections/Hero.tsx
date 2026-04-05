"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Dynamic Three.js import
    import("three").then((THREE) => {
      if (!canvasRef.current) return;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      });

      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(0x000000, 0);
      camera.position.z = 5;

      // Create globe
      const globeGeometry = new THREE.SphereGeometry(2, 64, 64);
      const globeMaterial = new THREE.MeshPhongMaterial({
        color: 0x00d4ff,
        emissive: 0x001122,
        transparent: true,
        opacity: 0.8,
        wireframe: false,
      });
      const globe = new THREE.Mesh(globeGeometry, globeMaterial);
      scene.add(globe);

      // Add glowing points on the globe
      const pointsGeometry = new THREE.BufferGeometry();
      const pointsCount = 200;
      const positions = new Float32Array(pointsCount * 3);
      const colors = new Float32Array(pointsCount * 3);

      for (let i = 0; i < pointsCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / pointsCount);
        const theta = Math.sqrt(pointsCount * Math.PI) * phi;

        positions[i * 3] = Math.cos(theta) * Math.sin(phi) * 2.01;
        positions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * 2.01;
        positions[i * 3 + 2] = Math.cos(phi) * 2.01;

        colors[i * 3] = 0; // R
        colors[i * 3 + 1] = 0.8; // G
        colors[i * 3 + 2] = 1; // B
      }

      pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const pointsMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
      });
      const points = new THREE.Points(pointsGeometry, pointsMaterial);
      scene.add(points);

      // Add connection lines (arcs)
      const lineGeometry = new THREE.BufferGeometry();
      const linePositions = [];
      for (let i = 0; i < 20; i++) {
        const startPhi = Math.random() * Math.PI * 2;
        const startTheta = Math.random() * Math.PI;
        const endPhi = Math.random() * Math.PI * 2;
        const endTheta = Math.random() * Math.PI;

        const startX = Math.sin(startTheta) * Math.cos(startPhi) * 2.1;
        const startY = Math.sin(startTheta) * Math.sin(startPhi) * 2.1;
        const startZ = Math.cos(startTheta) * 2.1;

        const endX = Math.sin(endTheta) * Math.cos(endPhi) * 2.1;
        const endY = Math.sin(endTheta) * Math.sin(endPhi) * 2.1;
        const endZ = Math.cos(endTheta) * 2.1;

        // Create arc
        const midX = (startX + endX) / 2 + Math.random() * 0.5;
        const midY = (startY + endY) / 2 + Math.random() * 0.5;
        const midZ = (startZ + endZ) / 2 + Math.random() * 0.5;

        linePositions.push(startX, startY, startZ);
        linePositions.push(midX, midY, midZ);
        linePositions.push(endX, endY, endZ);
      }

      lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x00d4ff,
        transparent: true,
        opacity: 0.3,
      });
      const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
      scene.add(lines);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
      scene.add(ambientLight);

      const pointLight1 = new THREE.PointLight(0x00d4ff, 1);
      pointLight1.position.set(5, 5, 5);
      scene.add(pointLight1);

      const pointLight2 = new THREE.PointLight(0x7c3aed, 0.5);
      pointLight2.position.set(-5, -5, 5);
      scene.add(pointLight2);

      // Mouse tracking
      let mouseX = 0;
      let mouseY = 0;

      const onMouseMove = (e: MouseEvent) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
      };

      window.addEventListener("mousemove", onMouseMove);

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate);

        globe.rotation.y += 0.005;
        points.rotation.y += 0.005;
        lines.rotation.y += 0.005;

        // Mouse interaction
        globe.rotation.x = mouseY * 0.1;
        globe.rotation.z = mouseX * 0.1;

        renderer.render(scene, camera);
      };

      animate();

      // Handle resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("resize", handleResize);
      };
    });
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0" />;
}

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section ref={containerRef} className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <Hero3D />
      </motion.div>

      <motion.div
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ opacity }}
      >
        <motion.h1
          className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-text"
          variants={itemVariants}
        >
          Building Future-Ready Digital Experiences
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          Premium web development services combining cutting-edge technology,
          stunning 3D visuals, and seamless client management.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={itemVariants}
        >
          <Link
            href="#portfolio"
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
          >
            View My Work
          </Link>
          <Link
            href="/client-dashboard"
            className="px-8 py-3 glass rounded-lg font-semibold hover:bg-white/10 transition-all"
          >
            Client Portal
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <svg
          className="w-6 h-6 text-cyan-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </motion.div>
    </section>
  );
}
