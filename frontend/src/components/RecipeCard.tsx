import { Recipe } from '@/types/recipe';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, ChefHat } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onViewRecipe: (recipe: Recipe) => void;
}

export const RecipeCard = ({ recipe, onViewRecipe }: RecipeCardProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-recipe-sage';
      case 'Medium': return 'bg-recipe-warm';
      case 'Hard': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <Card className="group overflow-hidden border-border hover:shadow-[var(--shadow-recipe-hover)] transition-all duration-300 bg-card">
      <div className="relative overflow-hidden">
        <img 
          src={recipe.image} 
          alt={recipe.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-background/90 text-foreground">
            {recipe.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-recipe-warm transition-colors">
          {recipe.title}
        </h3>
        <p className="text-recipe-text-light text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.cookTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="w-4 h-4" />
            <span>{recipe.ingredients.length} ingredients</span>
          </div>
        </div>
        
        <Button 
          variant="recipe" 
          className="w-full"
          onClick={() => onViewRecipe(recipe)}
        >
          View Recipe
        </Button>
      </div>
    </Card>
  );
};