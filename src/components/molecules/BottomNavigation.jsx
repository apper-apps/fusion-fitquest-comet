import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const BottomNavigation = () => {
  const navItems = [
    { id: 'home', path: '/', icon: 'Home', label: 'Home' },
    { id: 'challenges', path: '/challenges', icon: 'Trophy', label: 'Challenges' },
    { id: 'track', path: '/track', icon: 'Plus', label: 'Track' },
    { id: 'recipes', path: '/recipes', icon: 'ChefHat', label: 'Recipes' },
    { id: 'team', path: '/team', icon: 'Users', label: 'Team' },
    { id: 'profile', path: '/profile', icon: 'User', label: 'Profile' },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-slate-700/50 z-50">
      <div className="flex items-center justify-around py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `relative flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive ? 'text-white' : 'text-slate-400'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 gradient-primary rounded-lg opacity-20"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative">
                  <ApperIcon
                    name={item.icon}
                    size={20}
                    className={`transition-colors duration-200 ${
                      isActive ? 'text-primary' : 'text-slate-400'
                    }`}
                  />
                  {isActive && (
                    <motion.div
                      className="absolute -inset-1 rounded-full bg-primary/20 blur-sm"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                </div>
                <span className={`text-xs mt-1 font-medium transition-colors duration-200 ${
                  isActive ? 'text-white' : 'text-slate-400'
                }`}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;