import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const LeaderboardItem = ({ player, rank, isCurrentUser = false }) => {
  const getRankDisplay = () => {
    if (rank === 1) return { icon: 'Crown', color: 'text-accent', bg: 'bg-accent/10' };
    if (rank === 2) return { icon: 'Medal', color: 'text-slate-300', bg: 'bg-slate-700' };
    if (rank === 3) return { icon: 'Award', color: 'text-amber-600', bg: 'bg-amber-600/10' };
    return { icon: null, color: 'text-slate-400', bg: 'bg-slate-700' };
  };

  const rankConfig = getRankDisplay();

  return (
    <motion.div
      className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
        isCurrentUser 
          ? 'bg-primary/10 border border-primary/20 shadow-lg shadow-primary/10' 
          : 'bg-surface hover:bg-slate-700/50'
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Rank */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${rankConfig.bg}`}>
        {rankConfig.icon ? (
          <ApperIcon name={rankConfig.icon} size={14} className={rankConfig.color} />
        ) : (
          <span className={`text-sm font-bold ${rankConfig.color}`}>{rank}</span>
        )}
      </div>

      {/* Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
        <span className="text-white font-bold text-sm">
          {player.name?.charAt(0).toUpperCase() || '?'}
        </span>
      </div>

      {/* Player Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <h3 className={`font-medium truncate ${isCurrentUser ? 'text-white' : 'text-slate-200'}`}>
            {player.name}
            {isCurrentUser && <span className="text-primary ml-1">(You)</span>}
          </h3>
          {player.streak && player.streak > 0 && (
            <div className="flex items-center space-x-1 text-accent">
              <ApperIcon name="Flame" size={12} />
              <span className="text-xs font-medium">{player.streak}</span>
            </div>
          )}
        </div>
        <p className="text-xs text-slate-400">
          Last active: {player.lastActive || 'Today'}
        </p>
      </div>

      {/* Points */}
      <div className="text-right">
        <div className={`text-lg font-bold ${isCurrentUser ? 'text-primary' : 'text-white'}`}>
          {player.points?.toLocaleString() || 0}
        </div>
        <div className="text-xs text-slate-400">points</div>
      </div>

      {/* Trend */}
      {player.trend && (
        <div className={`flex items-center space-x-1 ${
          player.trend.direction === 'up' ? 'text-success' : 'text-error'
        }`}>
          <ApperIcon 
            name={player.trend.direction === 'up' ? 'TrendingUp' : 'TrendingDown'} 
            size={14} 
          />
          <span className="text-xs font-medium">{player.trend.value}</span>
        </div>
      )}
    </motion.div>
  );
};

export default LeaderboardItem;