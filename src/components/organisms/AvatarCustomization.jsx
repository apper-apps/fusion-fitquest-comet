import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import { 
  getAllUnlockables, 
  getUserProgress, 
  checkRequirements, 
  unlockItem, 
  equipItem, 
  unequipItem,
  updateAvatarColors 
} from '@/services/api/avatarService';

const AvatarCustomization = ({ currentAvatar, onAvatarUpdate }) => {
  const [activeTab, setActiveTab] = useState('gear');
  const [unlockables, setUnlockables] = useState({ gear: [], backgrounds: [], badges: [] });
  const [userProgress, setUserProgress] = useState({ points: 0, achievements: [] });
  const [loading, setLoading] = useState(true);
  const [selectedGearType, setSelectedGearType] = useState('helmet');

  const tabs = [
    { id: 'gear', label: 'Gear', icon: 'Shirt' },
    { id: 'backgrounds', label: 'Backgrounds', icon: 'Mountain' },
    { id: 'badges', label: 'Badges', icon: 'Award' }
  ];

  const gearTypes = [
    { id: 'helmet', label: 'Head', icon: 'HardHat' },
    { id: 'shirt', label: 'Shirt', icon: 'Shirt' },
    { id: 'pants', label: 'Pants', icon: 'Footprints' },
    { id: 'shoes', label: 'Shoes', icon: 'ShoppingBag' },
    { id: 'accessory', label: 'Accessory', icon: 'Watch' }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [unlockablesData, progressData] = await Promise.all([
        getAllUnlockables(),
        getUserProgress()
      ]);
      setUnlockables(unlockablesData);
      setUserProgress(progressData);
    } catch (error) {
      toast.error('Failed to load customization data');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockItem = async (itemId, itemType) => {
    try {
      await unlockItem(itemId, itemType);
      await loadData(); // Refresh data
      toast.success('Item unlocked successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to unlock item');
    }
  };

  const handleEquipItem = async (itemId, itemType, slotType = null) => {
    try {
      const updatedAvatar = await equipItem(itemId, itemType, slotType);
      onAvatarUpdate(updatedAvatar);
      toast.success('Item equipped!');
    } catch (error) {
      toast.error(error.message || 'Failed to equip item');
    }
  };

  const handleUnequipItem = async (itemType, slotType = null) => {
    try {
      const updatedAvatar = await unequipItem(itemType, slotType);
      onAvatarUpdate(updatedAvatar);
      toast.success('Item unequipped!');
    } catch (error) {
      toast.error(error.message || 'Failed to unequip item');
    }
  };

  const isItemEquipped = (item, itemType) => {
    if (!currentAvatar?.equippedItems) return false;
    
    switch (itemType) {
      case 'gear':
        return currentAvatar.equippedItems.gear[item.type] === item.itemId;
      case 'background':
        return currentAvatar.equippedItems.background === item.backgroundId;
      case 'badge':
        return currentAvatar.equippedItems.badge === item.badgeId;
      default:
        return false;
    }
  };

  const renderRequirements = (requirements) => {
    const meetsRequirements = checkRequirements(requirements, userProgress);
    
    return (
      <div className="text-xs text-slate-400 mt-2">
        {requirements.points && (
          <div className={`flex items-center gap-1 ${userProgress.points >= requirements.points ? 'text-green-400' : 'text-red-400'}`}>
            <ApperIcon name="Zap" size={12} />
            <span>{requirements.points} points</span>
            {userProgress.points >= requirements.points && <ApperIcon name="Check" size={12} />}
          </div>
        )}
        {requirements.achievements && requirements.achievements.map(achievement => (
          <div key={achievement} className={`flex items-center gap-1 ${userProgress.achievements.includes(achievement) ? 'text-green-400' : 'text-red-400'}`}>
            <ApperIcon name="Trophy" size={12} />
            <span>{achievement}</span>
            {userProgress.achievements.includes(achievement) && <ApperIcon name="Check" size={12} />}
          </div>
        ))}
      </div>
    );
  };

  const renderGearItems = () => {
    const gearItems = unlockables.gear.filter(item => item.type === selectedGearType);
    
    return (
      <div className="space-y-4">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {gearTypes.map(type => (
            <button
              key={type.id}
              onClick={() => setSelectedGearType(type.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                selectedGearType === type.id 
                  ? 'bg-primary text-white' 
                  : 'bg-surface text-slate-400 hover:text-white'
              }`}
            >
              <ApperIcon name={type.icon} size={16} />
              <span className="text-sm">{type.label}</span>
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {gearItems.map(item => (
            <Card key={item.Id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-medium text-white">{item.name}</h4>
                  <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                  {renderRequirements(item.requirements)}
                </div>
                <div className="flex flex-col gap-2 ml-4">
                  {item.unlocked ? (
                    isItemEquipped(item, 'gear') ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleUnequipItem('gear', item.type)}
                      >
                        Unequip
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleEquipItem(item.Id, 'gear', item.type)}
                      >
                        Equip
                      </Button>
                    )
                  ) : checkRequirements(item.requirements, userProgress) ? (
                    <Button
                      size="sm"
                      variant="accent"
                      onClick={() => handleUnlockItem(item.Id, 'gear')}
                    >
                      Unlock
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" disabled>
                      Locked
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderBackgroundItems = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {unlockables.backgrounds.map(item => (
          <Card key={item.Id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-white">{item.name}</h4>
                <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                {renderRequirements(item.requirements)}
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {item.unlocked ? (
                  isItemEquipped(item, 'background') ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleUnequipItem('background')}
                    >
                      Current
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleEquipItem(item.Id, 'background')}
                    >
                      Select
                    </Button>
                  )
                ) : checkRequirements(item.requirements, userProgress) ? (
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => handleUnlockItem(item.Id, 'background')}
                  >
                    Unlock
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" disabled>
                    Locked
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderBadgeItems = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {unlockables.badges.map(item => (
          <Card key={item.Id} className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-white">{item.name}</h4>
                <p className="text-sm text-slate-400 mt-1">{item.description}</p>
                {renderRequirements(item.requirements)}
              </div>
              <div className="flex flex-col gap-2 ml-4">
                {item.unlocked ? (
                  isItemEquipped(item, 'badge') ? (
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => handleUnequipItem('badge')}
                    >
                      Active
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleEquipItem(item.Id, 'badge')}
                    >
                      Select
                    </Button>
                  )
                ) : checkRequirements(item.requirements, userProgress) ? (
                  <Button
                    size="sm"
                    variant="accent"
                    onClick={() => handleUnlockItem(item.Id, 'badge')}
                  >
                    Unlock
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" disabled>
                    Locked
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Progress */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-white">Your Progress</h3>
            <p className="text-slate-400 text-sm">Points and achievements unlock new items</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{userProgress.points}</div>
            <div className="text-xs text-slate-400">Points</div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ApperIcon name={tab.icon} size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'gear' && renderGearItems()}
          {activeTab === 'backgrounds' && renderBackgroundItems()}
          {activeTab === 'badges' && renderBadgeItems()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AvatarCustomization;