import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register as registerAction } from '../store/authSlice';
import { AlertCircle, UserPlus, Mail, Lock, CheckCircle, Building2, Briefcase, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm();

  // Watch the password field to validate confirm password
  const password = watch('password');

  useEffect(() => {
    if (error) {
      setError('root.apiError', { type: 'manual', message: error });
    }
  }, [error, setError]);

  const onSubmit = async (data) => {
    try {
      await dispatch(registerAction({ 
        email: data.email, 
        password: data.password,
        company_name: data.company_name,
        sector: data.sector,
        company_size: data.company_size
      })).unwrap();
      navigate('/chat'); // Navigate to chat on successful registration
    } catch (rejectedValueOrSerializedError) {
      console.error('Registration failed:', rejectedValueOrSerializedError);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-2xl mx-auto"
    >
      <div className="text-center mb-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="inline-block mb-4"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-[#008C9E] to-[#006b7a] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </motion.div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#343A40] mb-2">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-[#5A5A5A]">
          Or{' '}
          <Link
            to="/login"
            className="font-medium text-[#008C9E] hover:text-[#008C9E]/80 transition-colors"
          >
            sign in to your existing account
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

        {/* Company Name Field */}
        <div>
          <label htmlFor="company-name" className="block text-sm font-medium text-[#343A40] mb-2">
            Nom de l'entreprise <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="h-5 w-5 text-[#5A5A5A]" />
            </div>
            <input
              id="company-name"
              name="company_name"
              type="text"
              {...register('company_name', {
                required: 'Le nom de l\'entreprise est requis',
              })}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-[#343A40] placeholder-[#5A5A5A]/50 focus:outline-none focus:ring-2 transition-all ${errors.company_name
                  ? 'border-[#008C9E] focus:border-[#008C9E] focus:ring-[#008C9E]/20'
                  : 'border-gray-300 focus:border-[#008C9E] focus:ring-[#008C9E]/20'
                }`}
              placeholder="Ex: Acme Corporation"
            />
          </div>
          {errors.company_name && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-[#008C9E]"
            >
              {errors.company_name.message}
            </motion.p>
          )}
        </div>

        {/* Sector Field */}
        <div>
          <label htmlFor="sector" className="block text-sm font-medium text-[#343A40] mb-2">
            Secteur d'activité <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Briefcase className="h-5 w-5 text-[#5A5A5A]" />
            </div>
            <select
              id="sector"
              name="sector"
              {...register('sector', {
                required: 'Veuillez sélectionner un secteur',
              })}
              className={`block w-full pl-10 pr-10 py-3 border rounded-lg text-[#343A40] focus:outline-none focus:ring-2 transition-all appearance-none bg-white bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")] bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-no-repeat ${errors.sector
                  ? 'border-[#008C9E] focus:border-[#008C9E] focus:ring-[#008C9E]/20'
                  : 'border-gray-300 focus:border-[#008C9E] focus:ring-[#008C9E]/20'
                }`}
            >
              <option value="">Sélectionnez un secteur</option>
              <option value="Technologie">Technologie</option>
              <option value="Commerce">Commerce</option>
              <option value="Services">Services</option>
              <option value="Industrie">Industrie</option>
              <option value="Santé">Santé</option>
              <option value="Éducation">Éducation</option>
              <option value="Finance">Finance</option>
              <option value="Immobilier">Immobilier</option>
              <option value="Transport">Transport</option>
              <option value="Tourisme">Tourisme</option>
              <option value="Agriculture">Agriculture</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
          {errors.sector && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-[#008C9E]"
            >
              {errors.sector.message}
            </motion.p>
          )}
        </div>

        {/* Company Size Field */}
        <div>
          <label htmlFor="company-size" className="block text-sm font-medium text-[#343A40] mb-2">
            Taille de l'entreprise <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Users className="h-5 w-5 text-[#5A5A5A]" />
            </div>
            <select
              id="company-size"
              name="company_size"
              {...register('company_size', {
                required: 'Veuillez sélectionner la taille de l\'entreprise',
              })}
              className={`block w-full pl-10 pr-10 py-3 border rounded-lg text-[#343A40] focus:outline-none focus:ring-2 transition-all appearance-none bg-white bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")] bg-[length:1.5em_1.5em] bg-[right_0.75rem_center] bg-no-repeat ${errors.company_size
                  ? 'border-[#008C9E] focus:border-[#008C9E] focus:ring-[#008C9E]/20'
                  : 'border-gray-300 focus:border-[#008C9E] focus:ring-[#008C9E]/20'
                }`}
            >
              <option value="">Sélectionnez la taille</option>
              <option value="Micro (1-5 employés)">Micro (1-5 employés)</option>
              <option value="Petite (6-20 employés)">Petite (6-20 employés)</option>
              <option value="Moyenne (21-50 employés)">Moyenne (21-50 employés)</option>
              <option value="Grande (51-200 employés)">Grande (51-200 employés)</option>
              <option value="Très grande (201+ employés)">Très grande (201+ employés)</option>
            </select>
          </div>
          {errors.company_size && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-[#008C9E]"
            >
              {errors.company_size.message}
            </motion.p>
          )}
        </div>

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
              autoComplete="new-password"
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
              placeholder="At least 6 characters"
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

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="passwordConfirm" className="block text-sm font-medium text-[#343A40] mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CheckCircle className="h-5 w-5 text-[#5A5A5A]" />
            </div>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              autoComplete="new-password"
              {...register('passwordConfirm', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'The passwords do not match',
              })}
              className={`block w-full pl-10 pr-3 py-3 border rounded-lg text-[#343A40] placeholder-[#5A5A5A]/50 focus:outline-none focus:ring-2 transition-all ${errors.passwordConfirm
                  ? 'border-[#008C9E] focus:border-[#008C9E] focus:ring-[#008C9E]/20'
                  : 'border-gray-300 focus:border-[#008C9E] focus:ring-[#008C9E]/20'
                }`}
              placeholder="Repeat your password"
            />
          </div>
          {errors.passwordConfirm && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-[#008C9E]"
            >
              {errors.passwordConfirm.message}
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
                <span>Creating account...</span>
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                <span>Create Account</span>
              </>
            )}
          </motion.button>
        </div>
      </form>
      </div>

      {/* Terms and Privacy */}
      <div className="mt-6 text-center">
        <p className="text-xs text-[#5A5A5A]">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-[#008C9E] hover:text-[#008C9E]/80">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-[#008C9E] hover:text-[#008C9E]/80">
            Privacy Policy
          </Link>
        </p>
      </div>
    </motion.div>
  );
}