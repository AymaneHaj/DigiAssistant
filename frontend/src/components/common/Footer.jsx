import { motion } from 'framer-motion';
import { Heart, Mail, Phone, Clock } from 'lucide-react';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#343A40] text-white mt-auto border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="text-center md:text-left">
            <motion.div
              className="flex items-center gap-3 justify-center md:justify-start mb-4"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-white p-1.5 shadow-lg">
                <img
                  src={logo}
                  alt="Digitancy Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">
                  DigiAssistant
                </span>
                <span className="text-xs text-gray-400">
                  by Digitancy
                </span>
              </div>
            </motion.div>
            <p className="text-gray-300 leading-relaxed text-sm">
              Empowering small and medium businesses with intelligent digital maturity assessment and actionable insights.
            </p>
            <p className="text-[#008C9E] font-medium text-sm mt-3">
              Be Strategic, Think Digital
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-gray-300 hover:text-[#008C9E] transition-colors hover:translate-x-1 transform duration-200"
              >
                Home
              </Link>
              <Link
                to="/login"
                className="block text-gray-300 hover:text-[#008C9E] transition-colors hover:translate-x-1 transform duration-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="block text-gray-300 hover:text-[#008C9E] transition-colors hover:translate-x-1 transform duration-200"
              >
                Register
              </Link>
              <Link
                to="/chat"
                className="block text-gray-300 hover:text-[#008C9E] transition-colors hover:translate-x-1 transform duration-200"
              >
                Diagnostic
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold mb-4 text-white">Contact</h3>
            <div className="space-y-3 text-gray-300 text-sm">
              <div className="flex items-center gap-2 justify-center md:justify-start hover:text-[#008C9E] transition-colors">
                <Mail className="w-4 h-4" />
                <p>support@digiassistant.com</p>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start hover:text-[#008C9E] transition-colors">
                <Phone className="w-4 h-4" />
                <p>+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center gap-2 justify-center md:justify-start text-[#008C9E]">
                <Clock className="w-4 h-4" />
                <p className="font-medium">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.p
              className="text-sm text-gray-400 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              © {new Date().getFullYear()} DigiAssistant by Digitancy. All rights reserved.
            </motion.p>
            <motion.p
              className="text-sm text-gray-400 flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
            >
              Made with <Heart className="w-4 h-4 text-[#008C9E] animate-pulse" /> for SMBs
            </motion.p>
          </div>
        </div>
      </div>
    </footer>
  );
}