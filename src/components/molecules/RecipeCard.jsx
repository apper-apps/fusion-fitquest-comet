import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';

const RecipeCard = ({ recipe, onClick }) => {
  const getMealTypeColor = (mealType) => {
    switch (mealType?.toLowerCase()) {
      case 'breakfast':
        return 'text-accent bg-accent/10';
      case 'lunch':
        return 'text-primary bg-primary/10';
      case 'dinner':
        return 'text-secondary bg-secondary/10';
      default:
        return 'text-slate-400 bg-slate-700';
    }
  };

  return (
    <Card hover onClick={onClick} className="overflow-hidden">
      <div className="aspect-video bg-slate-700 rounded-lg mb-3 relative overflow-hidden">
        {recipe.imageUrl ? (
          <img 
            src={recipe.imageUrl} 
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ApperIcon name="ChefHat" size={32} className="text-slate-500" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getMealTypeColor(recipe.mealType)}`}>
            {recipe.mealType}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-white line-clamp-2">{recipe.title}</h3>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1 text-slate-400">
            <ApperIcon name="Flame" size={14} />
            <span>{recipe.calories} cal</span>
          </div>
          <div className="flex items-center space-x-1 text-slate-400">
            <ApperIcon name="List" size={14} />
            <span>{recipe.ingredients?.length || 0} ingredients</span>
          </div>
        </div>

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div className="pt-2 border-t border-slate-700">
            <p className="text-xs text-slate-500 line-clamp-2">
              {recipe.ingredients.slice(0, 3).join(', ')}
              {recipe.ingredients.length > 3 && '...'}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default RecipeCard;