import { Recipe } from '@/types/recipe';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Clock, Users, ChefHat } from 'lucide-react';

interface RecipeModalProps {
  recipe: Recipe | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RecipeModal = ({ recipe, isOpen, onClose }: RecipeModalProps) => {
  if (!recipe) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-recipe-sage';
      case 'Medium': return 'bg-recipe-warm';
      case 'Hard': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {recipe.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Image and basic info */}
          <div>
            <img 
              src={recipe.image} 
              alt={recipe.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
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
                <span className={`px-2 py-1 rounded text-white ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
              </div>
            </div>
            
            <p className="text-recipe-text-light mt-4">
              {recipe.description}
            </p>
            
            <Badge variant="outline" className="mt-2">
              {recipe.category}
            </Badge>
          </div>
          
          {/* Ingredients and instructions */}
          <div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-foreground mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <span className="w-2 h-2 bg-recipe-warm rounded-full mt-2 flex-shrink-0"></span>
                    <span className="text-foreground">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Instructions</h3>
              <ol className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-3 text-sm">
                    <span className="flex-shrink-0 w-6 h-6 bg-recipe-warm text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-foreground">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};