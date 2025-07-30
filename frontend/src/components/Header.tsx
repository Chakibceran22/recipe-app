import { ChefHat, Search } from "lucide-react"

export const Header = ({ searchTerm, setSearchTerm, isLoading} : { searchTerm: string, setSearchTerm: (value: string) => void ,isLoading: boolean}) => {
    return(
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RecipeHub</h1>
                <p className="text-xs text-gray-500">Discover & Share</p>
              </div>
            </div>
            
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search recipes, ingredients, cuisines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all bg-gray-50 focus:bg-white hover:border-orange-300"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          {/* Mobile Header */}
          <div className="lg:hidden">
            <div className="flex items-center justify-between h-14">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-orange-500 rounded-md flex items-center justify-center">
                  <ChefHat className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-lg font-bold text-gray-900">RecipeHub</h1>
              </div>
            </div>
            
            {/* Mobile Search */}
            <div className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-orange-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search recipes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all text-sm hover:border-orange-300"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </header>
    )
}