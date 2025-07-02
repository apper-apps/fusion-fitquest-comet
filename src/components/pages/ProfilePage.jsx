import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import AvatarDisplay from '@/components/molecules/AvatarDisplay';
import AvatarCustomization from '@/components/organisms/AvatarCustomization';
import { getAvatar, updateAvatar, getUserProgress } from '@/services/api/avatarService';

const ProfilePage = () => {
  const [currentAvatar, setCurrentAvatar] = useState(null);
  const [userProgress, setUserProgress] = useState({ points: 0, achievements: [] });
  const [activeView, setActiveView] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const [avatarData, progressData] = await Promise.all([
        getAvatar(),
        getUserProgress()
      ]);
      setCurrentAvatar(avatarData);
      setUserProgress(progressData);
    } catch (error) {
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpdate = async (updatedAvatar) => {
    try {
      const savedAvatar = await updateAvatar(updatedAvatar);
      setCurrentAvatar(savedAvatar);
    } catch (error) {
      toast.error('Failed to update avatar');
    }
  };

  const viewTabs = [
    { id: 'overview', label: 'Overview', icon: 'User' },
    { id: 'customize', label: 'Customize', icon: 'Palette' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 pb-24">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold gradient-text mb-2">Your Profile</h1>
          <p className="text-slate-400">Customize your avatar and track your progress</p>
        </motion.div>

        {/* View Tabs */}
        <div className="flex justify-center">
          <div className="flex bg-surface rounded-lg p-1">
            {viewTabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                  activeView === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ApperIcon name={tab.icon} size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeView}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeView === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Avatar Preview */}
              <div className="lg:col-span-1">
                <Card className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <AvatarDisplay avatar={currentAvatar} size="xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Your Avatar</h3>
                  <p className="text-slate-400 text-sm mb-4">
                    Customize your appearance and unlock new items
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => setActiveView('customize')}
                    className="w-full"
                  >
                    <ApperIcon name="Palette" size={16} className="mr-2" />
                    Customize Avatar
                  </Button>
                </Card>
              </div>

              {/* Stats & Progress */}
              <div className="lg:col-span-2 space-y-4">
                
                {/* Points Card */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-white">Your Progress</h3>
                    <div className="flex items-center gap-2 text-primary">
                      <ApperIcon name="Zap" size={20} />
                      <span className="text-2xl font-bold">{userProgress.points}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-surface rounded-lg">
                      <ApperIcon name="Trophy" size={24} className="text-accent mx-auto mb-2" />
                      <div className="text-lg font-semibold text-white">{userProgress.achievements?.length || 0}</div>
                      <div className="text-xs text-slate-400">Achievements</div>
                    </div>
                    <div className="text-center p-3 bg-surface rounded-lg">
                      <ApperIcon name="Target" size={24} className="text-primary mx-auto mb-2" />
                      <div className="text-lg font-semibold text-white">5</div>
                      <div className="text-xs text-slate-400">Goals</div>
                    </div>
                    <div className="text-center p-3 bg-surface rounded-lg">
                      <ApperIcon name="Calendar" size={24} className="text-secondary mx-auto mb-2" />
                      <div className="text-lg font-semibold text-white">12</div>
                      <div className="text-xs text-slate-400">Day Streak</div>
                    </div>
                    <div className="text-center p-3 bg-surface rounded-lg">
                      <ApperIcon name="Users" size={24} className="text-purple-400 mx-auto mb-2" />
                      <div className="text-lg font-semibold text-white">3rd</div>
                      <div className="text-xs text-slate-400">Team Rank</div>
                    </div>
                  </div>
                </Card>

                {/* Achievements */}
                <Card className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">Recent Achievements</h3>
                  {userProgress.achievements && userProgress.achievements.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {userProgress.achievements.slice(0, 4).map((achievement, index) => (
                        <motion.div
                          key={achievement}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-3 p-3 bg-surface rounded-lg"
                        >
                          <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                            <ApperIcon name="Award" size={20} className="text-accent" />
                          </div>
                          <div>
                            <div className="font-medium text-white">{achievement}</div>
                            <div className="text-xs text-slate-400">Unlocked</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-slate-400">
                      <ApperIcon name="Award" size={48} className="mx-auto mb-4 opacity-50" />
                      <p>Complete challenges to earn achievements!</p>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          )}

          {activeView === 'customize' && (
            <AvatarCustomization 
              currentAvatar={currentAvatar}
              onAvatarUpdate={handleAvatarUpdate}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;