import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = false, 
  gradient = false,
  ...props 
}) => {
  const baseClasses = `
    rounded-xl p-4 
    transition-all duration-200
    ${gradient ? 'glass-effect border border-slate-700/50' : 'bg-surface'}
    ${hover ? 'hover:shadow-lg hover:shadow-primary/10 cursor-pointer' : ''}
    ${className}
  `;

  if (hover) {
    return (
      <motion.div
        className={baseClasses}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
};

export default Card;