import { challenges } from '@/services/mockData/challenges.json';

class ChallengesService {
  constructor() {
    this.challenges = [...challenges];
    this.delay = () => new Promise(resolve => setTimeout(resolve, 300));
  }

  async getAll() {
    await this.delay();
    return [...this.challenges];
  }

  async getById(id) {
    await this.delay();
    const challenge = this.challenges.find(item => item.Id === parseInt(id));
    if (!challenge) {
      throw new Error('Challenge not found');
    }
    return { ...challenge };
  }

  async getActive() {
    await this.delay();
    const now = new Date();
    return this.challenges.filter(challenge => {
      const startDate = new Date(challenge.startDate);
      const endDate = new Date(challenge.endDate);
      return startDate <= now && endDate >= now;
    });
  }

  async create(challengeData) {
    await this.delay();
    const maxId = Math.max(...this.challenges.map(item => item.Id), 0);
    const newChallenge = {
      ...challengeData,
      Id: maxId + 1,
      participants: challengeData.participants || [],
      createdAt: new Date().toISOString()
    };
    this.challenges.push(newChallenge);
    return { ...newChallenge };
  }

  async update(id, challengeData) {
    await this.delay();
    const index = this.challenges.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Challenge not found');
    }
    this.challenges[index] = { ...this.challenges[index], ...challengeData };
    return { ...this.challenges[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.challenges.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Challenge not found');
    }
    this.challenges.splice(index, 1);
    return true;
  }
}

export const challengesService = new ChallengesService();