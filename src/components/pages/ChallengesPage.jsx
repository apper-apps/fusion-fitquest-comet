import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import ChallengeCard from '@/components/molecules/ChallengeCard';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { challengesService } from '@/services/api/challengesService';

const ChallengesPage = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, upcoming, completed
  const [joinedChallenges, setJoinedChallenges] = useState(new Set());

  const loadChallenges = async () => {
    try {
      setError('');
      setLoading(true);
      
      const data = await challengesService.getAll();
      setChallenges(data);
      
      // Mock joined challenges (in real app, this would come from user data)
      setJoinedChallenges(new Set([1, 3]));
    } catch (err) {
      setError('Failed to load challenges');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const handleJoinChallenge = async (challenge) => {
    try {
      // Mock join challenge API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setJoinedChallenges(prev => new Set([...prev, challenge.Id]));
      toast.success(`Successfully joined "${challenge.name}"!`);
    } catch (err) {
      toast.error('Failed to join challenge');
    }
  };

  const getFilteredChallenges = () => {
    const now = new Date();
    
    return challenges.filter(challenge => {
      const startDate = new Date(challenge.startDate);
      const endDate = new Date(challenge.endDate);
      
switch (filter) {
        case 'active':
          return startDate <= now && endDate >= now;
        case 'weekly':
          return challenge.type === 'Weekly Mini-Challenge';
        case 'upcoming':
          return startDate > now;
        case 'completed':
          return endDate < now;
        case 'joined':
          return joinedChallenges.has(challenge.Id);
        default:
          return true;
      }
    });
  };

  const filteredChallenges = getFilteredChallenges();

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadChallenges} />;

  const filterOptions = [
    { value: 'all', label: 'All', icon: 'List' },
    { value: 'active', label: 'Active', icon: 'Play' },
    { value: 'upcoming', label: 'Upcoming', icon: 'Clock' },
    { value: 'joined', label: 'Joined', icon: 'Check' },
    { value: 'completed', label: 'Completed', icon: 'Archive' },
  ];

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
            Challenges
          </h1>
          <p className="text-white/80">
            Join competitions and earn rewards
          </p>
        </motion.div>
      </div>

      <div className="px-6 -mt-4 space-y-6 pb-8">
        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-2"
        >
          <div className="flex space-x-1 overflow-x-auto">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  filter === option.value
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <ApperIcon name={option.icon} size={16} />
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="glass-effect rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {challenges.filter(c => new Date(c.endDate) >= new Date()).length}
            </div>
            <div className="text-xs text-slate-400">Available</div>
          </div>
          
          <div className="glass-effect rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {joinedChallenges.size}
            </div>
            <div className="text-xs text-slate-400">Joined</div>
          </div>
          
          <div className="glass-effect rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {Array.from(joinedChallenges).filter(id => {
                const challenge = challenges.find(c => c.Id === id);
                return challenge && new Date(challenge.endDate) < new Date();
              }).length}
            </div>
            <div className="text-xs text-slate-400">Completed</div>
          </div>
        </motion.div>

        {/* Challenges List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {filteredChallenges.length === 0 ? (
            <Empty
              type="challenges"
              onAction={() => setFilter('all')}
            />
          ) : (
            filteredChallenges.map((challenge, index) => (
              <motion.div
                key={challenge.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <ChallengeCard
                  challenge={challenge}
                  onJoin={handleJoinChallenge}
                  isJoined={joinedChallenges.has(challenge.Id)}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Create Challenge CTA */}
        {filter === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-effect rounded-xl p-6 text-center"
          >
            <ApperIcon name="Plus" size={48} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Create Your Own Challenge</h3>
            <p className="text-slate-400 mb-4">
              Start a custom challenge and invite your friends to compete
            </p>
            <Button variant="outline">
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Create Challenge
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ChallengesPage;