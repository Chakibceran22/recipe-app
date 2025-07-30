
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Clock, Users } from "lucide-react"
import { Recipe } from "@/types/Recipe"
const MainConten = ({filteredRecipes, setSelectedRecipe, getDifficultyColor}:{
    filteredRecipes: Recipe[],
    setSelectedRecipe: (recipe: Recipe) => void,
    getDifficultyColor: (difficulty: string) => string
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
            {filteredRecipes.map((recipe) => (
              <Card
                key={recipe.id}
                className="overflow-hidden rounded-md cursor-pointer group hover:shadow-xl transition-all duration-300 border-gray-200 hover:border-orange-200 bg-white"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div className="relative">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs font-medium border ${getDifficultyColor(recipe.difficulty)}`}
                    >
                      {recipe.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-orange-500/90 backdrop-blur-sm text-white hover:bg-orange-600 text-xs border-0">
                      {recipe.category}
                    </Badge>
                  </div>
                </div>
                
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 text-sm lg:text-base group-hover:text-orange-600 transition-colors">
                    {recipe.title}
                  </h3>
                  
                  <p className="text-gray-600 text-xs lg:text-sm mb-4 line-clamp-2">
                    {recipe.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{recipe.cookTime} mins</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{recipe.servings}</span>
                    </div>
                    <div className="text-orange-500 font-medium group-hover:text-orange-600 transition-colors">
                      View Recipe →
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
  )
}

export default MainConten