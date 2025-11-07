import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import { AlertCircle, LogIn, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  // If the Redux state has an error, show it in the form
  useEffect(() => {
    if (error) {
      setError('root.apiError', { type: 'manual', message: error });
    }
  }, [error, setError]);

  const onSubmit = async (data) => {
    try {
      // Dispatch the login thunk
      await dispatch(login(data)).unwrap();

      // On success, navigate to chat page
      navigate('/chat');

    } catch (rejectedValueOrSerializedError) {
      console.error('Login failed:', rejectedValueOrSerializedError);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-block mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[#008C9E] to-[#006b7a] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <LogIn className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#343A40] mb-2">
          Welcome Back
        </h2>
        <p className="mt-2 text-sm text-[#5A5A5A]">
          Or{' '}
          <Link
            to="/register"
            className="font-medium text-[#008C9E] hover:text-[#008C9E]/80 transition-colors"
          >
            create a new account
          </Link>
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-gray-100/50">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        {/* API Error Message */}
        {errors.root?.apiError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-lg bg-red-50 p-4 border border-red-200"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-[#008C9E]" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-[#008C9E]">
                  {errors.root.apiError.message}
                </h3>
              </div>
            </div>
          </motion.div>
        )}

        {/* Email Field */}
        <div>
          <label htmlFor="email-address" className="block text-sm font-medium text-[#343A40] mb-2">
            Email address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-[#5A5A5A]" />
            </div>
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-[#343A40] placeholder-[#5A5A5A]/50 focus:outline-none focus:ring-2 transition-all ${errors.email
                  ? 'border-[#008C9E] focus:border-[#008C9E] focus:ring-[#008C9E]/20'
                  : 'border-gray-300 focus:border-[#008C9E] focus:ring-[#008C9E]/20'
                }`}
              placeholder="you@example.com"
            />
          </div>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-[#008C9E]"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-[#343A40] mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-[#5A5A5A]" />
            </div>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-[#343A40] placeholder-[#5A5A5A]/50 focus:outline-none focus:ring-2 transition-all ${errors.password
                  ? 'border-[#008C9E] focus:border-[#008C9E] focus:ring-[#008C9E]/20'
                  : 'border-gray-300 focus:border-[#008C9E] focus:ring-[#008C9E]/20'
                }`}
              placeholder="••••••••"
            />
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-[#008C9E]"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <div>
          <motion.button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-[#008C9E] hover:bg-[#008C9E]/90 disabled:bg-[#008C9E]/50 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
            whileHover={!isLoading ? { scale: 1.02 } : {}}
            whileTap={!isLoading ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5" />
                <span>Sign in</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
      </div>

      {/* Footer Links */}
      <div className="mt-6 text-center">
        <Link
          to="/forgot-password"
          className="text-sm text-[#5A5A5A] hover:text-[#008C9E] transition-colors"
        >
          Forgot your password?
        </Link>
      </div>
    </motion.div>
  );
}