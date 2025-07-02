import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Error = ({ 
  message = "Something went wrong", 
  onRetry,
  type = 'general'
}) => {
  const getErrorConfig = () => {
    switch (type) {
      case 'network':
        return {
          icon: 'WifiOff',
          title: 'Connection Error',
          description: 'Please check your internet connection and try again.',
        };
      case 'notFound':
        return {
          icon: 'Search',
          title: 'No Results Found',
          description: 'We couldn\'t find what you\'re looking for.',
        };
      default:
        return {
          icon: 'AlertTriangle',
          title: 'Oops!',
          description: message,
        };
    }
  };

  const config = getErrorConfig();

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-96 p-6 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-20 h-20 bg-error/20 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
      >
        <ApperIcon 
          name={config.icon} 
          size={40} 
          className="text-error" 
        />
      </motion.div>

      <motion.h3
        className="text-xl font-bold text-white mb-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {config.title}
      </motion.h3>

      <motion.p
        className="text-slate-400 mb-6 max-w-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {config.description}
      </motion.p>

      {onRetry && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={onRetry}
            variant="primary"
            className="px-6"
          >
            <ApperIcon name="RotateCcw" size={16} className="mr-2" />
            Try Again
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Error;