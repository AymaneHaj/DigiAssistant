import { Outlet } from 'react-router-dom';
import logo from '../assets/logo.png'; // Make sure this path is correct

/**
 * AuthLayout
 * Renders a simple, centered layout for authentication pages.
 * It has no Header/Footer.
 */
export default function AuthLayout() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-xl rounded-2xl">
                <div className="flex justify-center">
                    <img className="h-16 w-auto" src={logo} alt="DigiAssistant" />
                </div>
                {/* Login/Register forms will render here */}
                <Outlet />
            </div>
        </div>
    );
}