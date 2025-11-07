import React from 'react';
import { Link } from 'react-router-dom';
import { Play, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] bg-gradient-to-br from-white via-[#F8F9FA] to-[#E8F4F5] relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#008C9E]/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#008C9E]/10 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <div className="relative text-center py-20 px-4 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-block mb-6"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#008C9E]/10 to-[#006b7a]/10 text-[#008C9E] rounded-full text-sm font-semibold border border-[#008C9E]/20">
              <span className="w-2 h-2 bg-[#008C9E] rounded-full animate-pulse"></span>
              Digital Maturity Assessment
            </span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6">
            <motion.span
              className="block mb-2 bg-gradient-to-r from-[#343A40] to-[#5A5A5A] bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Welcome to
            </motion.span>
            <motion.span
              className="block bg-gradient-to-r from-[#008C9E] via-[#00A8B8] to-[#008C9E] bg-clip-text text-transparent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              DigiAssistant
            </motion.span>
      </h1>

          <motion.p
            className="mt-8 max-w-3xl mx-auto text-lg sm:text-xl text-[#5A5A5A] leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
        Your professional partner for digital maturity diagnostics.
            <br className="hidden sm:block" />
            Start your conversational assessment today and unlock your business potential.
          </motion.p>

          <motion.div
            className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/chat"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#008C9E] to-[#006b7a] hover:from-[#006b7a] hover:to-[#008C9E] text-white text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Start Diagnostic</span>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-[#008C9E] text-lg font-semibold rounded-xl border-2 border-[#008C9E] shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[#343A40] mb-4">
            Why Choose <span className="text-[#008C9E]">DigiAssistant</span>?
          </h2>
          <p className="text-lg text-[#5A5A5A] max-w-2xl mx-auto">
            Everything you need to assess and improve your digital maturity
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-6 lg:gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Feature 1 */}
          <motion.div
            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 hover:border-[#008C9E]/30"
            whileHover={{ y: -8, scale: 1.02 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#008C9E]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#008C9E] to-[#006b7a] rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#343A40] mb-3">
                Precise Assessment
              </h3>
              <p className="text-[#5A5A5A] leading-relaxed">
                Get a detailed evaluation of your digital maturity across 6 key dimensions with AI-powered analysis.
              </p>
            </div>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 hover:border-[#008C9E]/30"
            whileHover={{ y: -8, scale: 1.02 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#008C9E]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#008C9E] to-[#006b7a] rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#343A40] mb-3">
                Actionable Insights
              </h3>
              <p className="text-[#5A5A5A] leading-relaxed">
                Receive personalized recommendations to improve your digital strategy and accelerate growth.
              </p>
            </div>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100/50 hover:border-[#008C9E]/30"
            whileHover={{ y: -8, scale: 1.02 }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#008C9E]/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#008C9E] to-[#006b7a] rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <BarChart3 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-bold text-[#343A40] mb-3">
                Visual Reports
              </h3>
              <p className="text-[#5A5A5A] leading-relaxed">
                Download comprehensive PDF reports with charts, gap analysis, and detailed recommendations.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-5xl mx-auto px-4 py-20">
        <motion.div
          className="relative bg-gradient-to-br from-[#008C9E] via-[#00A8B8] to-[#006b7a] rounded-3xl p-12 sm:p-16 shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative text-center">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Ready to Transform Your Business?
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-white/90 mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Join hundreds of SMBs who have improved their digital maturity with DigiAssistant.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-10 py-4 bg-white hover:bg-gray-50 text-[#008C9E] text-lg font-bold rounded-xl shadow-2xl transition-all duration-300"
                >
                  Get Started Free
        </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}