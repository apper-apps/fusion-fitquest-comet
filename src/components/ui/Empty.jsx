import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const Empty = ({ 
  title = "Nothing here yet",
  description = "Get started by adding some content",
  actionLabel = "Get Started",
  onAction,
  icon = "Zap",
  type = 'default'
}) => {
  const getEmptyConfig = () => {
    switch (type) {
      case 'challenges':
        return {
          icon: 'Trophy',
          title: 'No Active Challenges',
          description: 'Join a challenge to start competing with friends and earning points!',
          actionLabel: 'Browse Challenges',
        };
      case 'recipes':
        return {
          icon: 'ChefHat',
          title: 'No Recipes Found',
          description: 'Discover healthy recipes to fuel your fitness journey.',
          actionLabel: 'Explore Recipes',
        };
      case 'team':
        return {
          icon: 'Users',
          title: 'Join a Team',
          description: 'Connect with other fitness enthusiasts and compete together!',
          actionLabel: 'Find Teams',
        };
      case 'tracking':
        return {
          icon: 'Target',
          title: 'Start Tracking',
          description: 'Log your daily activities to earn points and track progress.',
          actionLabel: 'Log Activity',
        };
      default:
        return { icon, title, description, actionLabel };
    }
  };

  const config = getEmptyConfig();

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-96 p-6 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
      >
        <div className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center">
          <ApperIcon 
            name={config.icon} 
            size={48} 
            className="text-white" 
          />
        </div>
        <motion.div
          className="absolute -inset-2 gradient-primary rounded-full opacity-20 blur-xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>

      <motion.h3
        className="text-xl font-bold text-white mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        {config.title}
      </motion.h3>

      <motion.p
        className="text-slate-400 mb-6 max-w-sm"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {config.description}
      </motion.p>

      {onAction && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button 
            onClick={onAction}
            variant="primary"
            size="lg"
            className="px-8"
          >
            <ApperIcon name="Sparkles" size={16} className="mr-2" />
            {config.actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Empty;