import React from 'react';
import { motion } from 'framer-motion';
import StatCard from '@/components/molecules/StatCard';
import ProgressRing from '@/components/molecules/ProgressRing';

const DashboardStats = ({ stats, goals }) => {
  const calculateProgress = (current, goal) => {
    if (!goal) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const stepsProgress = calculateProgress(stats.steps, goals.steps);
  const waterProgress = calculateProgress(stats.water, goals.water);
  const pointsProgress = calculateProgress(stats.points, goals.points);

  return (
    <div className="space-y-6">
      {/* Main Progress Rings */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <ProgressRing
            progress={stepsProgress}
            size={80}
            color="#6366F1"
            className="mx-auto mb-2"
          >
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {Math.round(stepsProgress)}%
              </div>
            </div>
          </ProgressRing>
          <div className="text-xs text-slate-400">Steps</div>
          <div className="text-sm font-semibold text-white">
            {stats.steps?.toLocaleString() || 0}
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <ProgressRing
            progress={waterProgress}
            size={80}
            color="#3B82F6"
            className="mx-auto mb-2"
          >
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {Math.round(waterProgress)}%
              </div>
            </div>
          </ProgressRing>
          <div className="text-xs text-slate-400">Water</div>
          <div className="text-sm font-semibold text-white">
            {stats.water || 0} glasses
          </div>
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProgressRing
            progress={pointsProgress}
            size={80}
            color="#F59E0B"
            className="mx-auto mb-2"
          >
            <div className="text-center">
              <div className="text-lg font-bold text-white">
                {Math.round(pointsProgress)}%
              </div>
            </div>
          </ProgressRing>
          <div className="text-xs text-slate-400">Points</div>
          <div className="text-sm font-semibold text-white">
            {stats.points?.toLocaleString() || 0}
          </div>
        </motion.div>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon="Footprints"
          title="Steps Today"
          value={stats.steps?.toLocaleString() || '0'}
          subtitle={`Goal: ${goals.steps?.toLocaleString() || '10,000'}`}
          color="primary"
          progress={stepsProgress}
        />
        
        <StatCard
          icon="Droplets"
          title="Water Intake"
          value={`${stats.water || 0} glasses`}
          subtitle={`Goal: ${goals.water || 8} glasses`}
          color="info"
          progress={waterProgress}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon="Star"
          title="Points Today"
          value={stats.dailyPoints?.toLocaleString() || '0'}
          subtitle="Keep it up!"
          color="accent"
        />
        
        <StatCard
          icon="Flame"
          title="Streak"
          value={`${stats.streak || 0} days`}
          subtitle="Amazing consistency!"
          color="secondary"
          trend={stats.streak > 0 ? { direction: 'up', value: '+1' } : null}
        />
      </div>
    </div>
  );
};

export default DashboardStats;