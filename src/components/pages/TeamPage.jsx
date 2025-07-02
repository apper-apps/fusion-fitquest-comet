import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import LeaderboardItem from '@/components/molecules/LeaderboardItem';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { teamService } from '@/services/api/teamService';
import { challengesService } from '@/services/api/challengesService';

const TeamPage = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [teamStats, setTeamStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('leaderboard');

  const loadData = async () => {
    try {
      setError('');
      setLoading(true);
      
      const [leaderboardData, challengeData, statsData] = await Promise.all([
        teamService.getLeaderboard(),
        challengesService.getActive(),
        teamService.getStats()
      ]);
      
      setLeaderboard(leaderboardData);
      setCurrentChallenge(challengeData.length > 0 ? challengeData[0] : null);
      setTeamStats(statsData);
    } catch (err) {
      setError('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading type="list" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const currentUserId = 2; // Mock current user ID
  const tabs = [
    { id: 'leaderboard', label: 'Leaderboard', icon: 'Trophy' },
    { id: 'chat', label: 'Team Chat', icon: 'MessageSquare' },
    { id: 'achievements', label: 'Achievements', icon: 'Award' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              Team Challenge
            </h1>
            {currentChallenge ? (
              <p className="text-white/80">
                {currentChallenge.name} • {currentChallenge.participants?.length || 0} players
              </p>
            ) : (
              <p className="text-white/80">Join a challenge to compete with others</p>
            )}
          </div>

          {/* Challenge Info */}
          {currentChallenge && (
            <Card gradient className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 gradient-accent rounded-xl flex items-center justify-center">
                    <ApperIcon name="Trophy" size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{currentChallenge.name}</h3>
                    <p className="text-xs text-slate-400">{currentChallenge.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white">5 days left</div>
                  <div className="text-xs text-slate-400">Time remaining</div>
                </div>
              </div>
            </Card>
          )}
        </motion.div>
      </div>

      <div className="px-6 -mt-4 space-y-6 pb-8">
        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-2"
        >
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <ApperIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Team Stats */}
        {teamStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4"
          >
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-primary mb-1">
                {teamStats.totalMembers || 0}
              </div>
              <div className="text-xs text-slate-400">Members</div>
            </Card>
            
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-accent mb-1">
                {teamStats.totalPoints?.toLocaleString() || '0'}
              </div>
              <div className="text-xs text-slate-400">Team Points</div>
            </Card>
            
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-success mb-1">
                #{teamStats.ranking || '—'}
              </div>
              <div className="text-xs text-slate-400">Team Rank</div>
            </Card>
          </motion.div>
        )}

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {activeTab === 'leaderboard' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Leaderboard</h2>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="RotateCcw" size={14} className="mr-1" />
                  Refresh
                </Button>
              </div>

              {leaderboard.length === 0 ? (
                <Empty
                  type="team"
                  title="No team members yet"
                  description="Invite friends to join your challenge and start competing!"
                  actionLabel="Invite Friends"
                />
              ) : (
                <div className="space-y-3">
                  {leaderboard.map((player, index) => (
                    <motion.div
                      key={player.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                    >
                      <LeaderboardItem
                        player={player}
                        rank={index + 1}
                        isCurrentUser={player.Id === currentUserId}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}

          {activeTab === 'chat' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Team Chat</h2>
                <Button variant="ghost" size="sm">
                  <ApperIcon name="Settings" size={14} />
                </Button>
              </div>

              <div className="space-y-3 min-h-96">
                {/* Mock Chat Messages */}
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white font-bold text-xs">J</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white text-sm">John</span>
                        <span className="text-xs text-slate-500">2 hours ago</span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1">
                        Just hit 12,000 steps today! 💪
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                      <span className="text-white font-bold text-xs">S</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-white text-sm">Sarah</span>
                        <span className="text-xs text-slate-500">4 hours ago</span>
                      </div>
                      <p className="text-sm text-slate-300 mt-1">
                        Amazing! I'm at 9,500 steps. Let's keep pushing! 🔥
                      </p>
                    </div>
                  </div>

                  {/* Achievement Message */}
                  <div className="bg-success/10 border border-success/20 rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-success text-sm">
                      <ApperIcon name="Trophy" size={16} />
                      <span className="font-medium">Team Achievement Unlocked!</span>
                    </div>
                    <p className="text-sm text-slate-300 mt-1">
                      "Step Squad" - Team completed 50,000 steps in one day
                    </p>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="sticky bottom-0 pt-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="text"
                      placeholder="Send a message..."
                      className="flex-1 px-4 py-3 bg-surface border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <Button variant="primary" size="sm">
                      <ApperIcon name="Send" size={16} />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'achievements' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Team Achievements</h2>
                <div className="text-sm text-slate-400">
                  12 unlocked
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Mock Achievements */}
                <Card className="text-center p-4">
                  <div className="w-12 h-12 gradient-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="Trophy" size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">First Steps</h3>
                  <p className="text-xs text-slate-400">Complete first challenge</p>
                  <div className="mt-2 text-xs text-success">Unlocked</div>
                </Card>

                <Card className="text-center p-4">
                  <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="Users" size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">Team Player</h3>
                  <p className="text-xs text-slate-400">Join 5 challenges</p>
                  <div className="mt-2 text-xs text-success">Unlocked</div>
                </Card>

                <Card className="text-center p-4 opacity-50">
                  <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="Crown" size={24} className="text-slate-500" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">Champion</h3>
                  <p className="text-xs text-slate-400">Win 10 challenges</p>
                  <div className="mt-2 text-xs text-slate-500">Locked</div>
                </Card>

                <Card className="text-center p-4 opacity-50">
                  <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <ApperIcon name="Flame" size={24} className="text-slate-500" />
                  </div>
                  <h3 className="font-semibold text-white text-sm mb-1">Streak Master</h3>
                  <p className="text-xs text-slate-400">30-day logging streak</p>
                  <div className="mt-2 text-xs text-slate-500">Locked</div>
                </Card>
              </div>
            </>
          )}
        </motion.div>

        {/* Join Challenge CTA */}
        {!currentChallenge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-xl p-6 text-center"
          >
            <ApperIcon name="Users" size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Join a Team Challenge</h3>
            <p className="text-slate-400 mb-4">
              Connect with friends and compete together to reach your fitness goals
            </p>
            <Button variant="primary">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Browse Challenges
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;