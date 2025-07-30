import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { Recipe } from '@/types/Recipe';
import { Button } from '@/components/ui/button';
import { ChevronDown,Loader2 } from 'lucide-react';
const CategoryFilter = ({isLoading, selectedCategory, setSelectedCategory, categories,filteredRecipes}:
    {isLoading: boolean, selectedCategory: string, setSelectedCategory: (category: string) => void, categories: string[], filteredRecipes: Recipe[]}
) => {
  return (
    <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Filter by cuisine:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="w-48 justify-between bg-white border-orange-200 hover:bg-orange-50 hover:border-orange-300 text-gray-900"
                    disabled={isLoading}
                  >
                    <span>{selectedCategory}</span>
                    <ChevronDown className="h-4 w-4 text-orange-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  {categories.map(category => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`cursor-pointer hover:bg-orange-50 ${
                        selectedCategory === category 
                          ? 'bg-orange-100 text-orange-700 font-medium' 
                          : 'text-gray-700 hover:text-orange-700'
                      }`}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="hidden sm:flex items-center text-sm text-gray-500">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                  <span>Loading recipes...</span>
                </div>
              ) : (
                <span><span className="font-semibold text-orange-600">{filteredRecipes.length}</span> recipes found</span>
              )}
            </div>
          </div>
        </div>
      </div>
)
}

export default CategoryFilter