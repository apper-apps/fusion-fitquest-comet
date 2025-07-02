import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'default' }) => {
  if (type === 'cards') {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="glass-effect rounded-xl p-4 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-slate-700 rounded-xl animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-700 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-slate-700 rounded animate-pulse w-1/2" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="h-8 bg-slate-700 rounded animate-pulse" />
              <div className="h-8 bg-slate-700 rounded animate-pulse" />
              <div className="h-8 bg-slate-700 rounded animate-pulse" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <motion.div
            key={index}
            className="flex items-center space-x-3 p-3 glass-effect rounded-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="w-10 h-10 bg-slate-700 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-slate-700 rounded animate-pulse w-2/3" />
              <div className="h-3 bg-slate-700 rounded animate-pulse w-1/3" />
            </div>
            <div className="w-16 h-8 bg-slate-700 rounded animate-pulse" />
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-96">
      <motion.div
        className="flex space-x-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {[...Array(3)].map((_, index) => (
          <motion.div
            key={index}
            className="w-4 h-4 bg-primary rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Loading;