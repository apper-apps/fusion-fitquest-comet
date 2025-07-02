import { recipes } from '@/services/mockData/recipes.json';

class RecipesService {
  constructor() {
    this.recipes = [...recipes];
    this.delay = () => new Promise(resolve => setTimeout(resolve, 300));
  }

  async getAll() {
    await this.delay();
    return [...this.recipes];
  }

  async getById(id) {
    await this.delay();
    const recipe = this.recipes.find(item => item.Id === parseInt(id));
    if (!recipe) {
      throw new Error('Recipe not found');
    }
    return { ...recipe };
  }

  async getByMealType(mealType) {
    await this.delay();
    return this.recipes.filter(recipe => 
      recipe.mealType?.toLowerCase() === mealType.toLowerCase()
    );
  }

  async search(query) {
    await this.delay();
    const searchTerm = query.toLowerCase();
    return this.recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.ingredients?.some(ingredient => 
        ingredient.toLowerCase().includes(searchTerm)
      )
    );
  }

  async create(recipeData) {
    await this.delay();
    const maxId = Math.max(...this.recipes.map(item => item.Id), 0);
    const newRecipe = {
      ...recipeData,
      Id: maxId + 1,
      createdAt: new Date().toISOString()
    };
    this.recipes.push(newRecipe);
    return { ...newRecipe };
  }

  async update(id, recipeData) {
    await this.delay();
    const index = this.recipes.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    this.recipes[index] = { ...this.recipes[index], ...recipeData };
    return { ...this.recipes[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.recipes.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Recipe not found');
    }
    this.recipes.splice(index, 1);
    return true;
  }
}

export const recipesService = new RecipesService();