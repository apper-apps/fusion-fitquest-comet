import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';

const TrackingForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    steps: initialData.steps || '',
    weight: initialData.weight || '',
    waterGlasses: initialData.waterGlasses || 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleWaterChange = (increment) => {
    const newValue = Math.max(0, Math.min(15, formData.waterGlasses + increment));
    handleInputChange('waterGlasses', newValue);
  };

  const calculatePoints = () => {
    let points = 0;
    
    // Steps points (1 point per 1000 steps)
    if (formData.steps) {
      points += Math.floor(parseInt(formData.steps) / 1000);
    }
    
    // Weight logging bonus
    if (formData.weight) {
      points += 10;
    }
    
    // Water points (5 points per glass)
    points += formData.waterGlasses * 5;
    
    return points;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.steps && !formData.weight && formData.waterGlasses === 0) {
      toast.error('Please log at least one activity');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const dataToSubmit = {
        ...formData,
        steps: formData.steps ? parseInt(formData.steps) : 0,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        points: calculatePoints(),
        date: new Date().toISOString().split('T')[0],
      };

      await onSubmit(dataToSubmit);
      toast.success(`Great job! You earned ${calculatePoints()} points!`);
      
      // Reset form
      setFormData({
        steps: '',
        weight: '',
        waterGlasses: 0,
      });
    } catch (error) {
      toast.error('Failed to save your progress');
    } finally {
      setIsSubmitting(false);
    }
  };

  const estimatedPoints = calculatePoints();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Steps Input */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <ApperIcon name="Footprints" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Steps</h3>
            <p className="text-xs text-slate-400">1 point per 1,000 steps</p>
          </div>
        </div>
        
        <Input
          type="number"
          placeholder="Enter your steps"
          value={formData.steps}
          onChange={(e) => handleInputChange('steps', e.target.value)}
          min="0"
          max="100000"
        />
      </Card>

      {/* Weight Input */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-secondary/10 rounded-lg">
            <ApperIcon name="Scale" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Weight</h3>
            <p className="text-xs text-slate-400">10 point bonus for logging</p>
          </div>
        </div>
        
        <Input
          type="number"
          placeholder="Enter your weight (lbs)"
          value={formData.weight}
          onChange={(e) => handleInputChange('weight', e.target.value)}
          min="50"
          max="500"
          step="0.1"
        />
      </Card>

      {/* Water Tracker */}
      <Card>
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-info/10 rounded-lg">
            <ApperIcon name="Droplets" size={20} className="text-info" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Water Intake</h3>
            <p className="text-xs text-slate-400">5 points per glass</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleWaterChange(-1)}
            disabled={formData.waterGlasses === 0}
          >
            <ApperIcon name="Minus" size={16} />
          </Button>

          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-white">{formData.waterGlasses}</span>
            <span className="text-slate-400">glasses</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleWaterChange(1)}
            disabled={formData.waterGlasses >= 15}
          >
            <ApperIcon name="Plus" size={16} />
          </Button>
        </div>

        {/* Water glasses visual */}
        <div className="grid grid-cols-8 gap-2 mt-4">
          {[...Array(8)].map((_, index) => (
            <motion.div
              key={index}
              className={`w-6 h-8 rounded-b-full border-2 transition-all duration-200 ${
                index < formData.waterGlasses
                  ? 'border-info bg-info/20'
                  : 'border-slate-600'
              }`}
              whileHover={{ scale: 1.1 }}
              onClick={() => handleInputChange('waterGlasses', index + 1)}
            />
          ))}
        </div>
      </Card>

      {/* Points Preview */}
      {estimatedPoints > 0 && (
        <motion.div
          className="p-4 gradient-accent rounded-lg text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-center space-x-2 text-white">
            <ApperIcon name="Star" size={20} />
            <span className="text-lg font-bold">+{estimatedPoints} Points</span>
          </div>
          <p className="text-sm text-white/80 mt-1">Keep up the great work!</p>
        </motion.div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isSubmitting || estimatedPoints === 0}
      >
        {isSubmitting ? (
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Saving...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <ApperIcon name="Check" size={16} />
            <span>Log Progress</span>
          </div>
        )}
      </Button>
    </form>
  );
};

export default TrackingForm;