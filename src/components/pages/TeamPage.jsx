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
  const [availableRoles, setAvailableRoles] = useState([]);
  const [teamComposition, setTeamComposition] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

const loadData = async () => {
    try {
      setError('');
      setLoading(true);
      
      const [leaderboardData, challengeData, statsData, rolesData, compositionData] = await Promise.all([
        teamService.getLeaderboard(),
        challengesService.getActive(),
        teamService.getStats(),
        teamService.getAvailableRoles(),
        teamService.getTeamComposition()
      ]);
      
      setLeaderboard(leaderboardData);
      setCurrentChallenge(challengeData.length > 0 ? challengeData[0] : null);
      setTeamStats(statsData);
      setAvailableRoles(rolesData);
      setTeamComposition(compositionData);
    } catch (err) {
      setError('Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleAssignment = async () => {
    if (!selectedMember || !selectedRole) return;
    
    try {
      await teamService.assignRole(selectedMember, selectedRole);
      await loadData(); // Refresh data
      setSelectedMember(null);
      setSelectedRole('');
    } catch (err) {
      setError('Failed to assign role');
    }
  };

  const handleFormTeam = async () => {
    try {
      await teamService.formTeam();
      await loadData(); // Refresh data
    } catch (err) {
      setError('Failed to form team');
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'motivator': return 'Zap';
      case 'recipe-sharer': return 'ChefHat';
      case 'check-in-leader': return 'CheckCircle';
      default: return 'User';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'motivator': return 'text-yellow-400';
      case 'recipe-sharer': return 'text-green-400';
      case 'check-in-leader': return 'text-blue-400';
      default: return 'text-slate-400';
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
    { id: 'formation', label: 'Formation', icon: 'Users' },
    { id: 'chat', label: 'Team Chat', icon: 'MessageSquare' },
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
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <div className={`text-lg font-bold ${index < 3 ? 'text-accent' : 'text-slate-400'}`}>
                                #{index + 1}
                              </div>
                              {player.role && (
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${getRoleColor(player.role)}`}>
                                  <ApperIcon name={getRoleIcon(player.role)} size={14} />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h3 className="font-semibold text-white">{player.name}</h3>
                                {player.Id === currentUserId && (
                                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">You</span>
                                )}
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-slate-400">
                                <span>{player.points?.toLocaleString()} points</span>
                                {player.role && (
                                  <span className={getRoleColor(player.role)}>
                                    • {player.role.replace('-', ' ')}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`text-sm font-bold ${player.trend?.direction === 'up' ? 'text-success' : 'text-warning'}`}>
                              {player.trend?.value}
                            </div>
                            <div className="text-xs text-slate-400">{player.lastActive}</div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
)}

          {activeTab === 'formation' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white">Team Formation</h2>
                <Button variant="primary" size="sm" onClick={handleFormTeam}>
                  <ApperIcon name="Users" size={14} className="mr-1" />
                  Form Team
                </Button>
              </div>

              {/* Team Composition Overview */}
              {teamComposition && (
                <Card className="p-4 mb-4">
                  <h3 className="font-semibold text-white mb-3">Current Team Roles</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <ApperIcon name="Zap" size={24} className="text-yellow-400" />
                      </div>
                      <div className="text-sm font-medium text-white">Step Motivator</div>
                      <div className="text-xs text-slate-400">
                        {teamComposition.motivator || 'Unassigned'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <ApperIcon name="ChefHat" size={24} className="text-green-400" />
                      </div>
                      <div className="text-sm font-medium text-white">Recipe Sharer</div>
                      <div className="text-xs text-slate-400">
                        {teamComposition.recipeSharer || 'Unassigned'}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-2">
                        <ApperIcon name="CheckCircle" size={24} className="text-blue-400" />
                      </div>
                      <div className="text-sm font-medium text-white">Check-in Leader</div>
                      <div className="text-xs text-slate-400">
                        {teamComposition.checkInLeader || 'Unassigned'}
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Role Assignment Interface */}
              <Card className="p-4 mb-4">
                <h3 className="font-semibold text-white mb-3">Assign Roles</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Select Team Member
                    </label>
                    <select
                      value={selectedMember || ''}
                      onChange={(e) => setSelectedMember(parseInt(e.target.value) || null)}
                      className="w-full px-3 py-2 bg-surface border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Choose a member...</option>
                      {leaderboard.map((member) => (
                        <option key={member.Id} value={member.Id}>
                          {member.name} {member.role ? `(${member.role.replace('-', ' ')})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                      Select Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-3 py-2 bg-surface border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Choose a role...</option>
                      {availableRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name} - {role.description}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Button
                    variant="primary"
                    onClick={handleRoleAssignment}
                    disabled={!selectedMember || !selectedRole}
                    className="w-full"
                  >
                    <ApperIcon name="UserCheck" size={16} className="mr-2" />
                    Assign Role
                  </Button>
                </div>
              </Card>

              {/* Role Descriptions */}
              <Card className="p-4">
                <h3 className="font-semibold text-white mb-3">Role Descriptions</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                      <ApperIcon name="Zap" size={16} className="text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Step Motivator</h4>
                      <p className="text-sm text-slate-400">
                        Encourages team members to reach their daily step goals and maintains team motivation.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                      <ApperIcon name="ChefHat" size={16} className="text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Recipe Sharer</h4>
                      <p className="text-sm text-slate-400">
                        Shares healthy recipes and nutrition tips to support team's dietary goals.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <ApperIcon name="CheckCircle" size={16} className="text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Check-in Leader</h4>
                      <p className="text-sm text-slate-400">
                        Coordinates daily check-ins and ensures all team members stay on track.
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
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