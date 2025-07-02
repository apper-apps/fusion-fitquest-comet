import React from 'react';
import { motion } from 'framer-motion';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  disabled = false,
  ...props 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'gradient-primary text-white shadow-lg hover:shadow-primary/25';
      case 'secondary':
        return 'gradient-secondary text-white shadow-lg hover:shadow-secondary/25';
      case 'accent':
        return 'gradient-accent text-white shadow-lg hover:shadow-accent/25';
      case 'outline':
        return 'border-2 border-primary text-primary hover:bg-primary hover:text-white';
      case 'ghost':
        return 'text-primary hover:bg-primary/10';
      case 'danger':
        return 'bg-error text-white hover:bg-error/90';
      default:
        return 'gradient-primary text-white shadow-lg hover:shadow-primary/25';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      case 'xl':
        return 'px-8 py-4 text-lg';
      default:
        return 'px-4 py-2 text-sm';
    }
  };

  return (
    <motion.button
      className={`
        inline-flex items-center justify-center
        font-medium rounded-lg
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-primary/50
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export default Button;