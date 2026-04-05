"use client";

import Link from "next/link";
import { Code2, Link as LinkIcon, Share2, Mail } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold gradient-text mb-2">Portfolio</h3>
            <p className="text-gray-400 text-sm">
              Premium web development & design solutions
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="text-gray-400 hover:text-cyan-400">
                  About
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-gray-400 hover:text-cyan-400">
                  Portfolio
                </a>
              </li>
              <li>
                <a href="#services" className="text-gray-400 hover:text-cyan-400">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-400 hover:text-cyan-400">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <h4 className="font-semibold mb-4">Social</h4>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Code2 size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <LinkIcon size={20} />
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Share2 size={20} />
              </a>
              <a
                href="mailto:hello@example.com"
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <p>
              &copy; {currentYear} Portfolio. All rights reserved. | Crafted
              with care.
            </p>
            <div className="flex gap-6 mt-4 sm:mt-0">
              <Link href="#" className="hover:text-cyan-400 transition-colors">
                Privacy
              </Link>
              <Link href="#" className="hover:text-cyan-400 transition-colors">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
