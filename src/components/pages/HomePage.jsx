import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import DashboardStats from '@/components/organisms/DashboardStats';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { userStatsService } from '@/services/api/userStatsService';
import { challengesService } from '@/services/api/challengesService';

const HomePage = () => {
  const [stats, setStats] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadData = async () => {
    try {
      setError('');
      setLoading(true);
      
      const [statsData, challengesData] = await Promise.all([
        userStatsService.getToday(),
        challengesService.getActive()
      ]);
      
      setStats(statsData);
      setCurrentChallenge(challengesData.length > 0 ? challengesData[0] : null);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const goals = {
    steps: 10000,
    water: 8,
    points: 100,
  };

  const todayStats = {
    steps: stats.steps || 0,
    water: stats.waterGlasses || 0,
    points: stats.totalPoints || 0,
    dailyPoints: stats.points || 0,
    streak: stats.streak || 0,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-display font-bold text-white">
            Welcome Back, Champion!
          </h1>
          <p className="text-white/80">
            {format(new Date(), 'EEEE, MMMM d')} • Ready to crush your goals?
          </p>
        </motion.div>
      </div>

      <div className="px-6 -mt-4 space-y-6 pb-8">
        {/* Current Challenge Banner */}
        {currentChallenge ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card gradient className="relative overflow-hidden">
              <div className="absolute inset-0 gradient-secondary opacity-10" />
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <ApperIcon name="Trophy" size={20} className="text-accent" />
                    <span className="text-sm font-medium text-slate-300">Active Challenge</span>
                  </div>
                  <div className="px-2 py-1 bg-success/20 rounded-full">
                    <span className="text-xs font-medium text-success">Live</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2">{currentChallenge.name}</h3>
                <p className="text-sm text-slate-400 mb-4">{currentChallenge.type}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1 text-slate-300">
                      <ApperIcon name="Users" size={14} />
                      <span>{currentChallenge.participants?.length || 0} players</span>
                    </div>
                    <div className="flex items-center space-x-1 text-slate-300">
                      <ApperIcon name="Star" size={14} />
                      <span>#{stats.rank || 'Unranked'}</span>
                    </div>
                  </div>
                  
                  <Button variant="accent" size="sm">
                    <ApperIcon name="Eye" size={14} className="mr-1" />
                    View Challenge
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="text-center py-6">
              <ApperIcon name="Trophy" size={48} className="text-slate-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">No Active Challenge</h3>
              <p className="text-slate-400 mb-4">Join a challenge to compete with friends!</p>
              <Button variant="primary">
                <ApperIcon name="Plus" size={16} className="mr-2" />
                Browse Challenges
              </Button>
            </Card>
          </motion.div>
        )}

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DashboardStats stats={todayStats} goals={goals} />
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-bold text-white">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Card hover className="text-center py-6">
              <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Plus" size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1">Log Progress</h3>
              <p className="text-xs text-slate-400">Track your daily activities</p>
            </Card>
            
            <Card hover className="text-center py-6">
              <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="ChefHat" size={24} className="text-white" />
              </div>
              <h3 className="font-semibold text-white mb-1">Find Recipes</h3>
              <p className="text-xs text-slate-400">Healthy meal suggestions</p>
            </Card>
          </div>
        </motion.div>

        {/* Recent Achievements */}
        {stats.recentAchievements && stats.recentAchievements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold text-white">Recent Achievements</h2>
            
            <div className="space-y-3">
              {stats.recentAchievements.slice(0, 3).map((achievement, index) => (
                <Card key={achievement.Id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-secondary rounded-xl flex items-center justify-center">
                    <ApperIcon name={achievement.icon || 'Award'} size={20} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{achievement.name}</h4>
                    <p className="text-xs text-slate-400">{achievement.description}</p>
                  </div>
                  <div className="text-xs text-slate-500">
                    {format(new Date(achievement.unlockedDate), 'MMM d')}
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;