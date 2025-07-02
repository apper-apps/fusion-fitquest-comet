import React from 'react';
import { motion } from 'framer-motion';
import { format, differenceInDays } from 'date-fns';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';

const ChallengeCard = ({ challenge, onJoin, isJoined = false }) => {
  const daysLeft = differenceInDays(new Date(challenge.endDate), new Date());
  const isActive = daysLeft > 0;

  return (
    <Card hover className="relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-5" />
      
      <div className="relative space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-white text-lg mb-1">{challenge.name}</h3>
            <p className="text-slate-400 text-sm">{challenge.type}</p>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive ? 'bg-success/20 text-success' : 'bg-slate-600 text-slate-400'
          }`}>
            {isActive ? `${daysLeft} days left` : 'Ended'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-slate-400">
              <ApperIcon name="Users" size={14} />
              <span className="text-xs">Participants</span>
            </div>
            <p className="text-white font-semibold">{challenge.participants?.length || 0}</p>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-slate-400">
              <ApperIcon name="Calendar" size={14} />
              <span className="text-xs">Duration</span>
            </div>
            <p className="text-white font-semibold">
              {differenceInDays(new Date(challenge.endDate), new Date(challenge.startDate))} days
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300">Challenge Rules</h4>
          <div className="space-y-1">
            {challenge.rules?.steps && (
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <ApperIcon name="Footprints" size={12} />
                <span>{challenge.rules.steps.toLocaleString()} steps daily</span>
              </div>
            )}
            {challenge.rules?.water && (
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <ApperIcon name="Droplets" size={12} />
                <span>{challenge.rules.water} glasses of water daily</span>
              </div>
            )}
            {challenge.rules?.points && (
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <ApperIcon name="Star" size={12} />
                <span>{challenge.rules.points} points to win</span>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          {isJoined ? (
            <div className="flex items-center justify-center space-x-2 py-2 text-success">
              <ApperIcon name="CheckCircle" size={16} />
              <span className="font-medium">Joined</span>
            </div>
          ) : (
            <Button
              onClick={() => onJoin(challenge)}
              variant="primary"
              className="w-full"
              disabled={!isActive}
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              {isActive ? 'Join Challenge' : 'Challenge Ended'}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ChallengeCard;