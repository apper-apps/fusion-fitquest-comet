import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const StatCard = ({ 
  icon, 
  title, 
  value, 
  subtitle, 
  color = 'primary',
  progress,
  trend,
  className = ''
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'primary':
        return 'text-primary bg-primary/10';
      case 'secondary':
        return 'text-secondary bg-secondary/10';
      case 'accent':
        return 'text-accent bg-accent/10';
      case 'success':
        return 'text-success bg-success/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  return (
    <Card hover className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`p-2 rounded-lg ${getColorClasses()}`}>
              <ApperIcon name={icon} size={16} />
            </div>
            <h3 className="text-sm font-medium text-slate-400">{title}</h3>
          </div>
          
          <motion.div
            className="text-2xl font-bold text-white mb-1"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {value}
          </motion.div>
          
          {subtitle && (
            <p className="text-xs text-slate-500">{subtitle}</p>
          )}
        </div>

        {trend && (
          <div className={`flex items-center space-x-1 ${
            trend.direction === 'up' ? 'text-success' : 'text-error'
          }`}>
            <ApperIcon 
              name={trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
              size={14} 
            />
            <span className="text-xs font-medium">{trend.value}</span>
          </div>
        )}
      </div>

      {progress !== undefined && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5">
            <motion.div
              className={`h-1.5 rounded-full ${
                color === 'primary' ? 'gradient-primary' :
                color === 'secondary' ? 'gradient-secondary' :
                color === 'accent' ? 'gradient-accent' :
                'bg-success'
              }`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      )}
    </Card>
  );
};

export default StatCard;