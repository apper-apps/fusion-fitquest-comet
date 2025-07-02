import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  type = 'text',
  ...props 
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-slate-300">
          {label}
        </label>
      )}
      <input
        type={type}
        className={`
          w-full px-4 py-3 
          bg-surface border border-slate-600 
          rounded-lg text-white placeholder-slate-400
          focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary
          transition-colors duration-200
          ${error ? 'border-error focus:ring-error/50 focus:border-error' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default Input;