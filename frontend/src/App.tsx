import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { getRecipes } from "./services/RecipeServices"; // Adjust the import path as necessary
import { Recipe } from "./types/Recipe";
import { RecipeCardSkeleton } from "./components/RecipeCardSkeleton";
import { LoadingSpinner } from "./components/LoadingSpinner";
import RecipeError from "./components/ErrorSction";
import { Header } from "./components/Header";
import CategoryFilter from "./components/CategoryFilter";
import SelectedRecipe from "./components/SelectedRecipe";
import MainConten from "./components/MainConten";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

const RecipeShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const {
    data: sampleRecipes = [],
    isLoading,
    error,
    
  } = useQuery<Recipe[]>({
    queryKey: ["recipes"],
    queryFn: getRecipes,
    staleTime: 1000 * 60 * 10,
  });
  useEffect(() => {
    if (error) {
      toast.error(
        "An error occurred while fetching recipes. Please try again later."
      );
    }
  }, [error]);

  

  const categories = [
    "All",
    ...Array.from(new Set(sampleRecipes.map((recipe) => recipe.category))),
  ];

  const filteredRecipes = sampleRecipes.filter((recipe) => {
    const matchesCategory =
      selectedCategory === "All" || recipe.category === selectedCategory;
    const matchesSearch =
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.ingredients.some((ingredient) =>
        ingredient.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100";
      case "Medium":
        return "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100";
      case "Hard":
        return "text-red-700 bg-red-50 border-red-200 hover:bg-red-100";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        isLoading={isLoading}
      />

      {/* Category Filter */}
      <CategoryFilter
        isLoading={isLoading}
        setSelectedCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        categories={categories}
        filteredRecipes={filteredRecipes}
      />

      {/* Recipe Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {isLoading ? (
          <>
            <LoadingSpinner />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6">
              {Array.from({ length: 8 }).map((_, index) => (
                <RecipeCardSkeleton key={index} />
              ))}
            </div>
          </>
        ) : error ? (
          <RecipeError />
        ) : (
          <MainConten
            filteredRecipes={filteredRecipes}
            setSelectedRecipe={setSelectedRecipe}
            getDifficultyColor={getDifficultyColor}
          />
        )}
        <Toaster position="bottom-right" />

        {!isLoading && !error && filteredRecipes.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No recipes found
            </h3>
            <p className="text-gray-500 text-sm">
              Try searching for something else or browse our categories
            </p>
          </div>
        )}
      </main>

      {/* Recipe Detail Modal */}
      <SelectedRecipe
        selectedRecipe={selectedRecipe}
        setSelectedRecipe={setSelectedRecipe}
        getDifficultyColor={getDifficultyColor}
      />
    </div>
  );
};

export default RecipeShowcase;
