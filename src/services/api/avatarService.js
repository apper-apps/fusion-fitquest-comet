import avatarData from '@/services/mockData/avatarData.json';
import teamMembersData from '@/services/mockData/teamMembers.json';

let currentAvatar = { ...avatarData.currentAvatar };
let unlockableGear = [...avatarData.unlockableGear];
let unlockableBackgrounds = [...avatarData.unlockableBackgrounds];
let unlockableBadges = [...avatarData.unlockableBadges];

// Get current avatar configuration
const getAvatar = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ ...currentAvatar });
    }, 200);
  });
};

// Update avatar configuration
const updateAvatar = async (avatarConfig) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentAvatar = {
        ...currentAvatar,
        ...avatarConfig,
        equippedItems: {
          ...currentAvatar.equippedItems,
          ...avatarConfig.equippedItems
        },
        colors: {
          ...currentAvatar.colors,
          ...avatarConfig.colors
        }
      };
      resolve({ ...currentAvatar });
    }, 300);
  });
};

// Get all unlockable items
const getAllUnlockables = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        gear: [...unlockableGear],
        backgrounds: [...unlockableBackgrounds],
        badges: [...unlockableBadges]
      });
    }, 200);
  });
};

// Get user's current points and achievements
const getUserProgress = async (userId = 1) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = teamMembersData.teamMembers.find(member => member.Id === userId);
      if (user) {
        resolve({
          points: user.points,
          achievements: user.achievements || []
        });
      } else {
        resolve({ points: 0, achievements: [] });
      }
    }, 150);
  });
};

// Check if item requirements are met
const checkRequirements = (requirements, userProgress) => {
  const { points = 0, achievements = [] } = requirements;
  const userPoints = userProgress.points || 0;
  const userAchievements = userProgress.achievements || [];

  // Check points requirement
  if (points > 0 && userPoints < points) {
    return false;
  }

  // Check achievements requirement
  if (achievements && achievements.length > 0) {
    const hasRequiredAchievements = achievements.every(achievement => 
      userAchievements.includes(achievement)
    );
    if (!hasRequiredAchievements) {
      return false;
    }
  }

  return true;
};

// Unlock an item
const unlockItem = async (itemId, itemType) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const userProgress = await getUserProgress();
        let itemToUnlock = null;
        let itemArray = null;

        // Find the item in the appropriate array
        switch (itemType) {
          case 'gear':
            itemArray = unlockableGear;
            itemToUnlock = unlockableGear.find(item => item.Id === itemId);
            break;
          case 'background':
            itemArray = unlockableBackgrounds;
            itemToUnlock = unlockableBackgrounds.find(item => item.Id === itemId);
            break;
          case 'badge':
            itemArray = unlockableBadges;
            itemToUnlock = unlockableBadges.find(item => item.Id === itemId);
            break;
          default:
            reject(new Error('Invalid item type'));
            return;
        }

        if (!itemToUnlock) {
          reject(new Error('Item not found'));
          return;
        }

        if (itemToUnlock.unlocked) {
          reject(new Error('Item already unlocked'));
          return;
        }

        // Check if requirements are met
        if (!checkRequirements(itemToUnlock.requirements, userProgress)) {
          reject(new Error('Requirements not met'));
          return;
        }

        // Unlock the item
        const itemIndex = itemArray.findIndex(item => item.Id === itemId);
        if (itemIndex !== -1) {
          itemArray[itemIndex] = { ...itemToUnlock, unlocked: true };
          resolve({ ...itemArray[itemIndex] });
        } else {
          reject(new Error('Failed to unlock item'));
        }
      } catch (error) {
        reject(error);
      }
    }, 300);
  });
};

// Equip an item
const equipItem = async (itemId, itemType, slotType = null) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let item = null;
        
        switch (itemType) {
          case 'gear':
            item = unlockableGear.find(i => i.Id === itemId);
            if (item && item.unlocked) {
              currentAvatar.equippedItems.gear[slotType || item.type] = item.itemId;
            }
            break;
          case 'background':
            item = unlockableBackgrounds.find(i => i.Id === itemId);
            if (item && item.unlocked) {
              currentAvatar.equippedItems.background = item.backgroundId;
            }
            break;
          case 'badge':
            item = unlockableBadges.find(i => i.Id === itemId);
            if (item && item.unlocked) {
              currentAvatar.equippedItems.badge = item.badgeId;
            }
            break;
          default:
            reject(new Error('Invalid item type'));
            return;
        }

        if (!item) {
          reject(new Error('Item not found'));
          return;
        }

        if (!item.unlocked) {
          reject(new Error('Item not unlocked'));
          return;
        }

        resolve({ ...currentAvatar });
      } catch (error) {
        reject(error);
      }
    }, 200);
  });
};

// Unequip an item
const unequipItem = async (itemType, slotType = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      switch (itemType) {
        case 'gear':
          if (slotType) {
            currentAvatar.equippedItems.gear[slotType] = null;
          }
          break;
        case 'background':
          currentAvatar.equippedItems.background = 'default-gym';
          break;
        case 'badge':
          currentAvatar.equippedItems.badge = 'newcomer';
          break;
      }
      resolve({ ...currentAvatar });
    }, 200);
  });
};

// Update avatar colors
const updateAvatarColors = async (colors) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      currentAvatar.colors = {
        ...currentAvatar.colors,
        ...colors
      };
      resolve({ ...currentAvatar });
    }, 200);
  });
};

export {
  getAvatar,
  updateAvatar,
  getAllUnlockables,
  getUserProgress,
  checkRequirements,
  unlockItem,
  equipItem,
  unequipItem,
  updateAvatarColors
};