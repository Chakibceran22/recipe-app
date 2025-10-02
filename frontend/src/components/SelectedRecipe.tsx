import { Button } from './ui/button'
import { Badge } from './ui/badge';
import { Clock, X, Users, ChefHat, ThumbsUp } from 'lucide-react';
import { Recipe } from '@/types/Recipe';
import { useState, useEffect } from 'react';
import axios from 'axios';
const SelectedRecipe = ({selectedRecipe, setSelectedRecipe, getDifficultyColor}:{
    selectedRecipe: Recipe | null,
    setSelectedRecipe: (recipe: Recipe | null) => void,
    getDifficultyColor: (difficulty: string) => string
}) => {
    const [hasRecommended, setHasRecommended] = useState(false);
    const [recommendCount, setRecommendCount] = useState(0);
    const [isRecommending, setIsRecommending] = useState(false);

    useEffect(() => {
        if (selectedRecipe) {
            // Check if user has already recommended this recipe
            const recommendedRecipes = localStorage.getItem('recommended_recipes');
            const recommended = recommendedRecipes ? JSON.parse(recommendedRecipes) : [];
            setHasRecommended(recommended.includes(selectedRecipe.id));
            setRecommendCount(selectedRecipe.recomendations || 0);
        }
    }, [selectedRecipe]);

    const handleRecommend = async () => {
        if (!selectedRecipe || hasRecommended || isRecommending) return;

        setIsRecommending(true);
        console.log('Recommend button clicked for recipe ID:', selectedRecipe.id);
        try {
            const response = await axios.post('http://localhost:3000/recipes/recomend', {
                id: selectedRecipe.id
            });

            if (response.status === 200) {
                // Update localStorage
                const recommendedRecipes = localStorage.getItem('recommended_recipes');
                const recommended = recommendedRecipes ? JSON.parse(recommendedRecipes) : [];
                recommended.push(selectedRecipe.id);
                localStorage.setItem('recommended_recipes', JSON.stringify(recommended));

                // Update state
                setHasRecommended(true);
                setRecommendCount(prev => prev + 1);
            }
        } catch (error) {
            console.error('Error recommending recipe:', error);
        } finally {
            setIsRecommending(false);
        }
    };

    if(!selectedRecipe) return null;

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end lg:items-center justify-center">
            <div className="bg-white rounded-t-md lg:rounded-md w-full lg:max-w-4xl lg:max-h-[90vh] max-h-[95vh] overflow-y-auto">
                <div className="relative">
                    <img
                        src={selectedRecipe.image}
                        alt={selectedRecipe.title}
                        className="w-full h-48 lg:h-64 object-cover"
                    />
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedRecipe(null)}
                        className="absolute top-4 right-4 h-10 w-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white hover:text-orange-500 transition-all"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-orange-500 text-white hover:bg-orange-600 text-xs border-0">
                                {selectedRecipe.category}
                            </Badge>
                            <Badge 
                                variant="secondary" 
                                className={`text-xs font-medium border ${getDifficultyColor(selectedRecipe.difficulty.level)}`}
                            >
                                {selectedRecipe.difficulty.level}
                            </Badge>
                        </div>
                        <h2 className="text-xl lg:text-2xl font-bold text-white">{selectedRecipe.title}</h2>
                    </div>
                </div>
                
                <div className="p-4 lg:p-6">
                    <p className="text-gray-600 mb-6 text-sm lg:text-base">{selectedRecipe.description}</p>
                    
                    <div className="grid grid-cols-3 gap-4 mb-6 pb-6 border-b border-gray-200">
                        <div className="text-center">
                            <Clock className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                            <div className="text-xs text-gray-500">Cook Time</div>
                            <div className="font-semibold text-sm">{selectedRecipe.cookTime} mins</div>
                        </div>
                        <div className="text-center">
                            <Users className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                            <div className="text-xs text-gray-500">Servings</div>
                            <div className="font-semibold text-sm">{selectedRecipe.servings}</div>
                        </div>
                        <div className="text-center">
                            <ChefHat className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                            <div className="text-xs text-gray-500">Difficulty</div>
                            <div className="font-semibold text-sm">{selectedRecipe.difficulty.level}</div>
                        </div>
                    </div>

                    {/* Recommendation Section */}
                    <div className="mb-8 pb-6 border-b border-gray-200">
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2">
                                <ThumbsUp className="w-5 h-5 text-gray-600" />
                                <span className="text-sm text-gray-600">
                                    {recommendCount} {recommendCount === 1 ? 'recommendation' : 'recommendations'}
                                </span>
                            </div>
                            <Button
                                onClick={handleRecommend}
                                disabled={hasRecommended || isRecommending}
                                className={`${
                                    hasRecommended 
                                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed hover:bg-gray-200' 
                                        : 'bg-orange-500 hover:bg-orange-600 text-white'
                                } transition-all`}
                                size="sm"
                            >
                                <ThumbsUp className="w-4 h-4 mr-2" />
                                {hasRecommended ? 'Recommended' : 'Recommend'}
                            </Button>
                        </div>
                    </div>
                    
                    <div className="space-y-8">
                        <div>
                            <h3 className="text-lg lg:text-xl font-bold mb-4 text-gray-900">Ingredients</h3>
                            <ul className="space-y-2">
                                {selectedRecipe.ingredients.map((ingredient, index) => (
                                    <li key={index} className="flex items-start gap-3 text-sm lg:text-base">
                                        <div className="w-2 h-2 bg-orange-500 rounded-md mt-2 flex-shrink-0"></div>
                                        <span className="text-gray-700">{ingredient}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-lg lg:text-xl font-bold mb-4 text-gray-900">Instructions</h3>
                            <ol className="space-y-4">
                                {selectedRecipe.instructions.map((instruction, index) => (
                                    <li key={index} className="flex gap-4">
                                        <span className="bg-orange-500 text-white rounded-md w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center text-xs lg:text-sm font-semibold flex-shrink-0">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-700 pt-1 text-sm lg:text-base">{instruction}</span>
                                    </li>
                                ))}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SelectedRecipe;