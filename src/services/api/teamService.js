import { teamMembers } from '@/services/mockData/teamMembers.json';

class TeamService {
  constructor() {
    this.members = [...teamMembers];
    this.delay = () => new Promise(resolve => setTimeout(resolve, 300));
  }

  async getLeaderboard() {
    await this.delay();
    // Sort by points descending
    const sorted = [...this.members].sort((a, b) => (b.points || 0) - (a.points || 0));
    return sorted;
  }

  async getStats() {
    await this.delay();
    const totalMembers = this.members.length;
    const totalPoints = this.members.reduce((sum, member) => sum + (member.points || 0), 0);
    
    return {
      totalMembers,
      totalPoints,
      ranking: 3, // Mock team ranking
      avgPoints: Math.round(totalPoints / totalMembers),
};
  }

  async getAvailableRoles() {
    await this.delay();
    return [
      {
        id: 'motivator',
        name: 'Step Motivator',
        description: 'Encourages daily step goals'
      },
      {
        id: 'recipe-sharer',
        name: 'Recipe Sharer',
        description: 'Shares healthy recipes and nutrition tips'
      },
      {
        id: 'check-in-leader',
        name: 'Check-in Leader',
        description: 'Coordinates daily check-ins'
      }
    ];
  }

  async assignRole(memberId, roleId) {
    await this.delay();
    
    // Validate role
    const availableRoles = await this.getAvailableRoles();
    const role = availableRoles.find(r => r.id === roleId);
    if (!role) {
      throw new Error('Invalid role selected');
    }

    // Find member
    const memberIndex = this.members.findIndex(m => m.Id === parseInt(memberId));
    if (memberIndex === -1) {
      throw new Error('Team member not found');
    }

    // Check if role is already assigned to another member
    const existingRoleHolder = this.members.find(m => m.role === roleId);
    if (existingRoleHolder && existingRoleHolder.Id !== parseInt(memberId)) {
      // Remove role from existing holder
      existingRoleHolder.role = null;
    }

    // Assign new role
    this.members[memberIndex].role = roleId;
    return { ...this.members[memberIndex] };
  }

  async getTeamComposition() {
    await this.delay();
    
    const composition = {
      motivator: null,
      recipeSharer: null,
      checkInLeader: null
    };

    this.members.forEach(member => {
      if (member.role === 'motivator') {
        composition.motivator = member.name;
      } else if (member.role === 'recipe-sharer') {
        composition.recipeSharer = member.name;
      } else if (member.role === 'check-in-leader') {
        composition.checkInLeader = member.name;
      }
    });

    return composition;
  }

  async formTeam() {
    await this.delay();
    
    // Validate that all essential roles are assigned
    const composition = await this.getTeamComposition();
    const missingRoles = [];
    
    if (!composition.motivator) missingRoles.push('Step Motivator');
    if (!composition.recipeSharer) missingRoles.push('Recipe Sharer');
    if (!composition.checkInLeader) missingRoles.push('Check-in Leader');

    if (missingRoles.length > 0) {
      throw new Error(`Missing roles: ${missingRoles.join(', ')}`);
    }

    return {
      success: true,
      message: 'Team formation completed successfully!',
      composition
    };
  }

  async getMemberById(id) {
    await this.delay();
    const member = this.members.find(item => item.Id === parseInt(id));
    if (!member) {
      throw new Error('Team member not found');
    }
    return { ...member };
  }

  async updateMember(id, memberData) {
    await this.delay();
    const index = this.members.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Team member not found');
    }
    this.members[index] = { ...this.members[index], ...memberData };
    return { ...this.members[index] };
  }

  async addMember(memberData) {
    await this.delay();
    const maxId = Math.max(...this.members.map(item => item.Id), 0);
    const newMember = {
      ...memberData,
      Id: maxId + 1,
      joinedAt: new Date().toISOString()
    };
    this.members.push(newMember);
    return { ...newMember };
  }
}

export const teamService = new TeamService();