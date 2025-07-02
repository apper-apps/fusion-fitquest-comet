import { dailyLogs } from '@/services/mockData/dailyLogs.json';

class DailyLogsService {
  constructor() {
    this.logs = [...dailyLogs];
    this.delay = () => new Promise(resolve => setTimeout(resolve, 300));
  }

  async getAll() {
    await this.delay();
    return [...this.logs];
  }

  async getById(id) {
    await this.delay();
    const log = this.logs.find(item => item.Id === parseInt(id));
    if (!log) {
      throw new Error('Daily log not found');
    }
    return { ...log };
  }

  async getByDate(date) {
    await this.delay();
    const log = this.logs.find(item => item.date === date);
    return log ? { ...log } : null;
  }

  async getWeekly() {
    await this.delay();
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    return this.logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= weekAgo;
    });
}

  async getMonthly() {
    await this.delay();
    const monthAgo = new Date();
    monthAgo.setDate(monthAgo.getDate() - 30);
    
    const monthlyLogs = this.logs.filter(log => {
      const logDate = new Date(log.date);
      return logDate >= monthAgo;
    });
    
    // Sort by date
    return monthlyLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  async create(logData) {
    await this.delay();
    const maxId = Math.max(...this.logs.map(item => item.Id), 0);
    
    // Check if log for this date already exists
    const existingLog = this.logs.find(log => log.date === logData.date && log.userId === logData.userId);
    if (existingLog) {
      // Update existing log
      const index = this.logs.findIndex(item => item.Id === existingLog.Id);
      this.logs[index] = { ...existingLog, ...logData };
      return { ...this.logs[index] };
    }
    
    const newLog = {
      ...logData,
      Id: maxId + 1,
      userId: logData.userId || 'current-user',
      createdAt: new Date().toISOString()
    };
    this.logs.push(newLog);
    return { ...newLog };
  }

  async update(id, logData) {
    await this.delay();
    const index = this.logs.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Daily log not found');
    }
    this.logs[index] = { ...this.logs[index], ...logData };
    return { ...this.logs[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.logs.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Daily log not found');
    }
    this.logs.splice(index, 1);
    return true;
  }
}

export const dailyLogsService = new DailyLogsService();