import React from 'react';
import { motion } from 'framer-motion';

/**
 * A reusable, professional Button component.
 * It supports different variants (colors) and a loading state.
 * Colors are based on Digitancy brand palette.
 */
export default function Button({
  children,
  type = 'button',
  variant = 'primary', // 'primary', 'accent', or 'secondary'
  isLoading = false,
  className = '',
  disabled = false,
  ...props
}) {
  const baseStyle =
    'relative inline-flex justify-center items-center rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg';

  const variantStyles = {
    primary:
      'bg-[#008C9E] hover:bg-[#008C9E]/90 text-white focus:ring-[#008C9E]/50',
    accent:
      'bg-[#008C9E] hover:bg-[#008C9E]/90 text-white focus:ring-[#008C9E]/50',
    secondary:
      'bg-white hover:bg-gray-50 text-[#343A40] border border-gray-300 focus:ring-gray-300',
  };

  return (
    <motion.button
      type={type}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      disabled={isLoading || disabled}
      whileHover={!isLoading && !disabled ? { scale: 1.02 } : {}}
      whileTap={!isLoading && !disabled ? { scale: 0.98 } : {}}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="absolute left-4 inset-y-0 flex items-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          </div>
          <span className="ml-4">Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}

