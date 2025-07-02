import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import RecipeCard from '@/components/molecules/RecipeCard';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import { recipesService } from '@/services/api/recipesService';

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadRecipes = async () => {
    try {
      setError('');
      setLoading(true);
      
      const data = await recipesService.getAll();
      setRecipes(data);
    } catch (err) {
      setError('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const getFilteredRecipes = () => {
    let filtered = recipes;
    
    // Filter by meal type
    if (filter !== 'all') {
      filtered = filtered.filter(recipe => 
        recipe.mealType?.toLowerCase() === filter.toLowerCase()
      );
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.ingredients?.some(ingredient => 
          ingredient.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
    return filtered;
  };

  const handleRecipeClick = (recipe) => {
    // In a real app, this would open a detailed recipe modal or navigate to recipe page
    console.log('Recipe clicked:', recipe);
  };

  const filteredRecipes = getFilteredRecipes();

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadRecipes} />;

  const mealTypes = [
    { value: 'all', label: 'All Meals', icon: 'ChefHat' },
    { value: 'breakfast', label: 'Breakfast', icon: 'Sun' },
    { value: 'lunch', label: 'Lunch', icon: 'Clock' },
    { value: 'dinner', label: 'Dinner', icon: 'Moon' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="gradient-primary px-6 pt-12 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
              Healthy Recipes
            </h1>
            <p className="text-white/80">
              Fuel your fitness journey with nutritious meals
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <ApperIcon 
              name="Search" 
              size={20} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" 
            />
            <input
              type="text"
              placeholder="Search recipes or ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        </motion.div>
      </div>

      <div className="px-6 -mt-4 space-y-6 pb-8">
        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-effect rounded-xl p-2"
        >
          <div className="flex space-x-1 overflow-x-auto">
            {mealTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setFilter(type.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  filter === type.value
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <ApperIcon name={type.icon} size={16} />
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4"
        >
          <div className="glass-effect rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {recipes.length}
            </div>
            <div className="text-xs text-slate-400">Total Recipes</div>
          </div>
          
          <div className="glass-effect rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-accent mb-1">
              {Math.round(recipes.reduce((sum, r) => sum + (r.calories || 0), 0) / recipes.length || 0)}
            </div>
            <div className="text-xs text-slate-400">Avg Calories</div>
          </div>
          
          <div className="glass-effect rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {filteredRecipes.length}
            </div>
            <div className="text-xs text-slate-400">Filtered</div>
          </div>
        </motion.div>

        {/* Featured Recipe */}
        {filter === 'all' && !searchTerm && recipes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold text-white">Featured Today</h2>
            
            <div className="glass-effect rounded-xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 gradient-accent opacity-10" />
              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{recipes[0]?.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-300">
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Flame" size={14} />
                        <span>{recipes[0]?.calories} cal</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ApperIcon name="Clock" size={14} />
                        <span>20 min</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-accent/20 rounded-full">
                    <span className="text-xs font-medium text-accent">Featured</span>
                  </div>
                </div>
                
                <p className="text-slate-400 mb-4">
                  {recipes[0]?.ingredients?.slice(0, 5).join(', ')}...
                </p>
                
                <Button variant="accent" size="sm">
                  <ApperIcon name="Eye" size={14} className="mr-2" />
                  View Recipe
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Recipes Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              {filter === 'all' ? 'All Recipes' : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Recipes`}
            </h2>
            
            {filteredRecipes.length > 0 && (
              <div className="flex items-center space-x-2 text-sm text-slate-400">
                <span>{filteredRecipes.length} found</span>
              </div>
            )}
          </div>

          {filteredRecipes.length === 0 ? (
            <Empty
              type="recipes"
              title={searchTerm ? 'No recipes found' : 'No recipes available'}
              description={searchTerm ? 'Try adjusting your search terms' : 'Check back later for new recipes'}
              onAction={() => {
                setSearchTerm('');
                setFilter('all');
              }}
              actionLabel="Clear Filters"
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredRecipes.map((recipe, index) => (
                <motion.div
                  key={recipe.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <RecipeCard
                    recipe={recipe}
                    onClick={() => handleRecipeClick(recipe)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recipe Request CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-effect rounded-xl p-6 text-center"
        >
          <ApperIcon name="Plus" size={48} className="text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-2">Can't find what you're looking for?</h3>
          <p className="text-slate-400 mb-4">
            Request a specific recipe and we'll add it to our collection
          </p>
          <Button variant="outline">
            <ApperIcon name="MessageSquare" size={16} className="mr-2" />
            Request Recipe
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default RecipesPage;