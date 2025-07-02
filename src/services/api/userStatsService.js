class UserStatsService {
  constructor() {
    this.delay = () => new Promise(resolve => setTimeout(resolve, 300));
  }

  async getToday() {
    await this.delay();
    // Mock today's stats
    return {
      steps: 8743,
      waterGlasses: 6,
      weight: 165.2,
      points: 95,
      totalPoints: 2847,
      streak: 5,
      rank: 12,
      recentAchievements: [
        {
          Id: 1,
          name: "Hydration Hero",
          description: "Drank 8 glasses of water",
          icon: "Droplets",
          unlockedDate: new Date().toISOString()
        },
        {
          Id: 2,
          name: "Step Champion",
          description: "Reached 10,000 steps",
          icon: "Footprints",
          unlockedDate: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    };
  }

  async getWeekly() {
    await this.delay();
    // Mock weekly stats
    const weekData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      weekData.push({
        date: date.toISOString().split('T')[0],
        steps: Math.floor(Math.random() * 5000) + 7000,
        waterGlasses: Math.floor(Math.random() * 4) + 6,
        points: Math.floor(Math.random() * 50) + 50,
      });
    }
    return weekData;
  }

  async getMonthly() {
    await this.delay();
    // Mock monthly stats
    return {
      totalSteps: 285430,
      avgDailySteps: 9201,
      totalPoints: 8745,
      challengesCompleted: 3,
      streakBest: 12,
    };
  }

  async updateStats(statsData) {
    await this.delay();
    // Mock update - in real app this would update the backend
    return {
      success: true,
      updatedStats: statsData
    };
  }
}

export const userStatsService = new UserStatsService();