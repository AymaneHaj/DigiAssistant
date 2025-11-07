import { Link, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../../store/authSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import logo from '../../assets/logo.png';

export default function Header() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutAction());
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
          >
            <motion.div
              className="w-12 h-12 rounded-lg overflow-hidden shadow-md group-hover:shadow-lg transition-shadow"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <img
                src={logo}
                alt="Digitancy Logo"
                className="w-full h-full object-contain"
              />
            </motion.div>
            <div className="hidden sm:flex flex-col">
              <span className="text-xl font-bold text-[#343A40]">
                DigiAssistant
              </span>
              <span className="text-xs text-[#5A5A5A] font-medium">
                Be Strategic, Think Digital
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/chat"
                  className="text-[#5A5A5A] hover:text-[#008C9E] font-medium transition-colors px-4 py-2 rounded-lg hover:bg-[#008C9E]/5"
                >
                  Chat
                </Link>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-5 py-2 bg-[#008C9E] hover:bg-[#008C9E]/90 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </motion.button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-[#5A5A5A] hover:text-[#008C9E] font-medium transition-colors px-4 py-2 rounded-lg hover:bg-[#008C9E]/5"
                >
                  Login
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-[#008C9E] hover:bg-[#008C9E]/90 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md"
                  >
                    Register
                  </Link>
                </motion.div>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg text-[#5A5A5A] hover:text-[#343A40] hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden border-t border-gray-200 bg-white"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-4 py-4 space-y-3">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/chat"
                      className="block text-[#5A5A5A] hover:text-[#008C9E] font-medium transition-colors px-4 py-3 rounded-lg hover:bg-[#008C9E]/5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Chat
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-3 bg-[#008C9E] hover:bg-[#008C9E]/90 text-white rounded-lg font-medium transition-all shadow-sm"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-[#5A5A5A] hover:text-[#008C9E] font-medium transition-colors px-4 py-3 rounded-lg hover:bg-[#008C9E]/5"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-4 py-3 bg-[#008C9E] hover:bg-[#008C9E]/90 text-white rounded-lg font-medium transition-all text-center shadow-sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}