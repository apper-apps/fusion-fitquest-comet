import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const AvatarDisplay = ({ avatar, size = 'md', showBadge = true, className = '' }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48'
  };

  const iconSizes = {
    sm: 8,
    md: 12,
    lg: 20,
    xl: 32
  };

  const badgeSizes = {
    sm: 12,
    md: 16,
    lg: 24,
    xl: 32
  };

  const getBackgroundStyle = (backgroundId) => {
    const backgrounds = {
      'default-gym': 'bg-gradient-to-br from-slate-700 to-slate-800',
      'outdoor-park': 'bg-gradient-to-br from-green-600 to-green-800',
      'modern-studio': 'bg-gradient-to-br from-blue-600 to-blue-800',
      'beach-workout': 'bg-gradient-to-br from-yellow-500 to-orange-600',
      'mountain-peak': 'bg-gradient-to-br from-purple-600 to-indigo-800',
      'elite-facility': 'bg-gradient-to-br from-gray-800 to-black'
    };
    return backgrounds[backgroundId] || backgrounds['default-gym'];
  };

  const getGearIcon = (gearType, itemId) => {
    const gearIcons = {
      helmet: {
        'basic-cap': 'HardHat',
        'pro-headband': 'Crown',
        'champion-crown': 'Crown'
      },
      shirt: {
        'basic-tshirt': 'Shirt',
        'tank-top': 'Shirt',
        'compression-shirt': 'Shirt',
        'champion-jersey': 'Shirt'
      },
      pants: {
        'basic-shorts': 'Footprints',
        'athletic-leggings': 'Footprints',
        'pro-joggers': 'Footprints'
      },
      shoes: {
        'basic-sneakers': 'ShoppingBag',
        'running-shoes': 'ShoppingBag',
        'cross-trainers': 'ShoppingBag'
      },
      accessory: {
        'fitness-watch': 'Watch',
        'wireless-earbuds': 'Headphones'
      }
    };
    
    return gearIcons[gearType]?.[itemId] || null;
  };

  const getBadgeIcon = (badgeId) => {
    const badgeIcons = {
      'newcomer': 'Star',
      'first-steps': 'Footprints',
      'dedicated': 'Calendar',
      'achiever': 'Target',
      'team-player': 'Users',
      'hydration-master': 'Droplets',
      'step-champion': 'Trophy',
      'elite-athlete': 'Crown'
    };
    return badgeIcons[badgeId] || 'Star';
  };

  if (!avatar) {
    return (
      <div className={`${sizeClasses[size]} rounded-full bg-slate-700 flex items-center justify-center ${className}`}>
        <ApperIcon name="User" size={iconSizes[size]} className="text-slate-400" />
      </div>
    );
  }

  const backgroundClass = getBackgroundStyle(avatar.equippedItems?.background);
  const primaryColor = avatar.colors?.primary || '#3B82F6';

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Background */}
      <div className={`w-full h-full rounded-full ${backgroundClass} flex items-center justify-center overflow-hidden relative`}>
        
        {/* Base Avatar */}
        <div 
          className="w-4/5 h-4/5 rounded-full flex items-center justify-center relative"
          style={{ backgroundColor: primaryColor + '20', border: `2px solid ${primaryColor}` }}
        >
          <ApperIcon name="User" size={iconSizes[size]} style={{ color: primaryColor }} />
          
          {/* Gear Items */}
          {avatar.equippedItems?.gear && Object.entries(avatar.equippedItems.gear).map(([gearType, itemId]) => {
            if (!itemId) return null;
            const iconName = getGearIcon(gearType, itemId);
            if (!iconName) return null;
            
            const positions = {
              helmet: 'absolute -top-1 left-1/2 transform -translate-x-1/2',
              shirt: 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
              pants: 'absolute bottom-1 left-1/2 transform -translate-x-1/2',
              shoes: 'absolute -bottom-1 left-1/2 transform -translate-x-1/2',
              accessory: 'absolute top-1 right-1'
            };
            
            return (
              <motion.div
                key={gearType}
                className={positions[gearType] || ''}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
              >
                <ApperIcon 
                  name={iconName} 
                  size={Math.max(iconSizes[size] / 3, 8)} 
                  className="text-white drop-shadow-md" 
                />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Badge */}
      {showBadge && avatar.equippedItems?.badge && (
        <motion.div
          className="absolute -bottom-1 -right-1 rounded-full bg-accent p-1"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.4, type: "spring", bounce: 0.6 }}
        >
          <ApperIcon 
            name={getBadgeIcon(avatar.equippedItems.badge)} 
            size={badgeSizes[size]} 
            className="text-white" 
          />
        </motion.div>
      )}

      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-30"
        style={{ 
          background: `radial-gradient(circle, ${primaryColor}20 0%, transparent 70%)`,
          filter: 'blur(4px)'
        }}
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default AvatarDisplay;