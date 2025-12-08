import React, { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { getRecipes } from "@/services/RecipeServices"; 
import { Recipe } from "@/types/Recipe";
import { RecipeCardSkeleton } from "@/components/RecipeCardSkeleton";
import { LoadingSpinner } from "../components/LoadingSpinner";
import RecipeError from "../components/ErrorSction";
import { Header } from "../components/Header";
import CategoryFilter from "../components/CategoryFilter";
import SelectedRecipe from "../components/SelectedRecipe";
import MainConten from "../components/MainConten";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RecipeShowcase: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const navigate = useNavigate();

  const RECIPES_PER_PAGE = 12;

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

  // Reset to page 1 when search term or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

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

  // Calculate pagination
  const totalPages = Math.ceil(filteredRecipes.length / RECIPES_PER_PAGE);
  const startIndex = (currentPage - 1) * RECIPES_PER_PAGE;
  const endIndex = startIndex + RECIPES_PER_PAGE;
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

  const goCreateRecipe = () => {
    navigate("/create-recipe");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100";
      case "medium":
        return "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100";
      case "hard":
        return "text-red-700 bg-red-50 border-red-200 hover:bg-red-100";
      default:
        return "text-gray-700 bg-gray-50 border-gray-200 hover:bg-gray-100";
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
    );

    // Page number buttons
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
            i === currentPage
              ? "z-10 bg-orange-50 border-orange-500 text-orange-600"
              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    );

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        goCreateRecipe={goCreateRecipe}
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
          <>
            {/* Results summary */}
            {filteredRecipes.length > 0 && (
              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredRecipes.length)} of {filteredRecipes.length} recipes
                </p>
              </div>
            )}

            <MainConten
              filteredRecipes={currentRecipes} // Pass only current page recipes
              setSelectedRecipe={setSelectedRecipe}
              getDifficultyColor={getDifficultyColor}
            />

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center">
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {renderPaginationButtons()}
                </nav>
              </div>
            )}
          </>
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