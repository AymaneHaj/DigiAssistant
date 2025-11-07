import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/common/Header';
import Footer from '../components/common/Footer';

/**
 * MainLayout
 * Renders the main application layout with Header and Footer.
 * It uses <Outlet /> to render the nested child routes (e.g., HomePage, ChatPage).
 */
export default function MainLayout() {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat' || location.pathname === '/diagnostic';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className={`flex-1 w-full max-w-7xl mx-auto ${isChatPage ? 'px-4 sm:px-6 lg:px-8 py-4' : 'py-8 px-4 sm:px-6 lg:px-8'}`}>
        {/* Child routes defined in App.jsx will render here */}
        <Outlet />
      </main>
      {!isChatPage && <Footer />}
    </div>
  );
}