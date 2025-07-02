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