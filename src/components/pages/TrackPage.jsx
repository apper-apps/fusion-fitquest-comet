import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Chart from 'react-apexcharts';
import ApperIcon from '@/components/ApperIcon';
import TrackingForm from '@/components/organisms/TrackingForm';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import { userStatsService } from '@/services/api/userStatsService';
import { dailyLogsService } from '@/services/api/dailyLogsService';

const TrackPage = () => {
  const [todayLog, setTodayLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [chartPeriod, setChartPeriod] = useState('weekly');
  const [chartsLoading, setChartsLoading] = useState(false);
const loadData = async () => {
    try {
      setError('');
      setLoading(true);
      
      const today = format(new Date(), 'yyyy-MM-dd');
      const [todayData, weeklyData, monthlyData] = await Promise.all([
        dailyLogsService.getByDate(today),
        dailyLogsService.getWeekly(),
        dailyLogsService.getMonthly()
      ]);
      
      setTodayLog(todayData);
      setWeeklyStats(weeklyData);
      setMonthlyStats(monthlyData);
    } catch (err) {
      setError('Failed to load tracking data');
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async (period) => {
    try {
      setChartsLoading(true);
      if (period === 'monthly') {
        const monthlyData = await dailyLogsService.getMonthly();
        setMonthlyStats(monthlyData);
      } else {
        const weeklyData = await dailyLogsService.getWeekly();
        setWeeklyStats(weeklyData);
      }
    } catch (err) {
      // Charts loading error handling
    } finally {
      setChartsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

const handleSubmit = async (formData) => {
    try {
      const result = await dailyLogsService.create(formData);
      setTodayLog(result);
      
      // Reload stats for charts
      const [weeklyData, monthlyData] = await Promise.all([
        dailyLogsService.getWeekly(),
        chartPeriod === 'monthly' ? dailyLogsService.getMonthly() : Promise.resolve(monthlyStats)
      ]);
      setWeeklyStats(weeklyData);
      if (chartPeriod === 'monthly') {
        setMonthlyStats(monthlyData);
      }
      
      return result;
    } catch (error) {
      throw new Error('Failed to save progress');
    }
  };

  const handleChartPeriodChange = async (period) => {
    setChartPeriod(period);
    await loadChartData(period);
  };

  const getChartData = () => {
    const data = chartPeriod === 'weekly' ? weeklyStats : monthlyStats;
    
    return {
      steps: data.map(log => ({ x: log.date, y: log.steps || 0 })),
      water: data.map(log => ({ x: log.date, y: log.waterGlasses || 0 })),
      weight: data.map(log => ({ x: log.date, y: log.weight || 0 })).filter(item => item.y > 0)
    };
  };

  const renderChartsSection = () => {
    const chartData = getChartData();
    
    const chartOptions = {
      chart: {
        type: 'line',
        height: 300,
        background: 'transparent',
        toolbar: { show: false },
        zoom: { enabled: true }
      },
      theme: { mode: 'dark' },
      grid: {
        borderColor: '#374151',
        strokeDashArray: 3
      },
      xaxis: {
        type: 'datetime',
        labels: { 
          style: { colors: '#9CA3AF' },
          format: chartPeriod === 'weekly' ? 'dd MMM' : 'dd MMM'
        }
      },
      yaxis: {
        labels: { style: { colors: '#9CA3AF' } }
      },
      legend: {
        labels: { colors: '#9CA3AF' }
      },
      tooltip: {
        theme: 'dark',
        style: { fontSize: '12px' }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Progress Trends</h2>
          <div className="flex bg-slate-800 rounded-lg p-1">
            {['weekly', 'monthly'].map((period) => (
              <button
                key={period}
                onClick={() => handleChartPeriodChange(period)}
                disabled={chartsLoading}
                className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                  chartPeriod === period
                    ? 'bg-primary text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {chartsLoading ? (
          <Card className="p-6">
            <div className="flex items-center justify-center h-64">
              <Loading type="spinner" />
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Steps Chart */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Footprints" size={20} className="text-primary" />
                <h3 className="font-semibold text-white">Steps</h3>
              </div>
              <Chart
                options={{
                  ...chartOptions,
                  colors: ['#3B82F6'],
                  yaxis: {
                    ...chartOptions.yaxis,
                    title: { text: 'Steps', style: { color: '#9CA3AF' } }
                  }
                }}
                series={[{ name: 'Steps', data: chartData.steps }]}
                type="line"
                height={250}
              />
            </Card>

            {/* Water Intake Chart */}
            <Card className="p-4">
              <div className="flex items-center space-x-2 mb-4">
                <ApperIcon name="Droplets" size={20} className="text-info" />
                <h3 className="font-semibold text-white">Water Intake</h3>
              </div>
              <Chart
                options={{
                  ...chartOptions,
                  colors: ['#06B6D4'],
                  yaxis: {
                    ...chartOptions.yaxis,
                    title: { text: 'Glasses', style: { color: '#9CA3AF' } }
                  }
                }}
                series={[{ name: 'Water Glasses', data: chartData.water }]}
                type="line"
                height={250}
              />
            </Card>

            {/* Weight Chart */}
            {chartData.weight.length > 0 && (
              <Card className="p-4 lg:col-span-2">
                <div className="flex items-center space-x-2 mb-4">
                  <ApperIcon name="Scale" size={20} className="text-secondary" />
                  <h3 className="font-semibold text-white">Weight Progress</h3>
                </div>
                <Chart
                  options={{
                    ...chartOptions,
                    colors: ['#F59E0B'],
                    yaxis: {
                      ...chartOptions.yaxis,
                      title: { text: 'Weight (lbs)', style: { color: '#9CA3AF' } }
                    }
                  }}
                  series={[{ name: 'Weight', data: chartData.weight }]}
                  type="line"
                  height={250}
                />
              </Card>
            )}
          </div>
        )}
      </motion.div>
    );
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const totalWeeklyPoints = weeklyStats.reduce((sum, log) => sum + (log.points || 0), 0);
  const avgDailySteps = weeklyStats.length > 0 
    ? Math.round(weeklyStats.reduce((sum, log) => sum + (log.steps || 0), 0) / weeklyStats.length)
    : 0;

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
            Track Progress
          </h1>
          <p className="text-white/80">
            {format(new Date(), 'EEEE, MMMM d')} • Log your daily activities
          </p>
        </motion.div>
      </div>

      <div className="px-6 -mt-4 space-y-6 pb-8">
        {/* Today's Summary */}
        {todayLog && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold text-white">Today's Progress</h2>
            
            <Card gradient className="p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary mb-1">
                    {todayLog.steps?.toLocaleString() || 0}
                  </div>
                  <div className="text-xs text-slate-400">Steps</div>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-info mb-1">
                    {todayLog.waterGlasses || 0}
                  </div>
                  <div className="text-xs text-slate-400">Water</div>
                </div>
                
                <div>
                  <div className="text-2xl font-bold text-accent mb-1">
                    {todayLog.points || 0}
                  </div>
                  <div className="text-xs text-slate-400">Points</div>
                </div>
              </div>
              
              {todayLog.weight && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                  <div className="flex items-center justify-center space-x-2">
                    <ApperIcon name="Scale" size={16} className="text-secondary" />
                    <span className="text-secondary font-semibold">{todayLog.weight} lbs</span>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        )}

        {/* Weekly Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-bold text-white">This Week</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <Card className="text-center p-4">
              <div className="text-xl font-bold text-accent mb-1">
                {totalWeeklyPoints}
              </div>
              <div className="text-xs text-slate-400">Total Points</div>
            </Card>
            
            <Card className="text-center p-4">
              <div className="text-xl font-bold text-primary mb-1">
                {avgDailySteps.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">Avg Steps</div>
            </Card>
          </div>

          {/* Weekly Progress Chart */}
          <Card className="p-4">
            <h3 className="font-semibold text-white mb-3">Weekly Activity</h3>
            <div className="space-y-2">
              {[...Array(7)].map((_, index) => {
                const date = new Date();
                date.setDate(date.getDate() - (6 - index));
                const dateStr = format(date, 'yyyy-MM-dd');
                const dayLog = weeklyStats.find(log => log.date === dateStr);
                const isToday = format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <div className={`w-8 text-xs ${isToday ? 'text-primary font-bold' : 'text-slate-400'}`}>
                      {format(date, 'EEE')}
                    </div>
                    
                    <div className="flex-1 bg-slate-700 rounded-full h-2 relative overflow-hidden">
                      {dayLog && (
                        <motion.div
                          className="h-full gradient-primary rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((dayLog.steps / 10000) * 100, 100)}%` }}
                          transition={{ duration: 0.8, delay: index * 0.1 }}
                        />
                      )}
                    </div>
                    
                    <div className="w-12 text-xs text-slate-400 text-right">
                      {dayLog?.points || 0}pt
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
</motion.div>

        {/* Interactive Charts Section */}
        {renderChartsSection()}

        {/* Tracking Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-lg font-bold text-white">
            {todayLog ? 'Update Today\'s Log' : 'Log Today\'s Activities'}
          </h2>
          
          <TrackingForm 
            onSubmit={handleSubmit}
            initialData={todayLog}
          />
        </motion.div>

        {/* Motivation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card gradient className="text-center p-6">
            <ApperIcon name="Target" size={48} className="text-accent mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Stay Consistent!</h3>
            <p className="text-slate-400 mb-4">
              Track daily to build your streak and climb the leaderboard
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-success">
                <ApperIcon name="Flame" size={14} />
                <span>5 day streak</span>
              </div>
              <div className="flex items-center space-x-1 text-primary">
                <ApperIcon name="Trophy" size={14} />
                <span>Rank #12</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TrackPage;