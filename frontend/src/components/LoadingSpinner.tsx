
import { ChefHat, Loader2 } from "lucide-react";

export const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center py-16">
    <div className="relative mb-6">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
        <ChefHat className="w-8 h-8 text-orange-500" />
      </div>
      <Loader2 className="w-20 h-20 text-orange-500 animate-spin absolute -top-2 -left-2" />
    </div>
    <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading delicious recipes...</h3>
    <p className="text-gray-500 text-sm">Fetching the best recipes for you</p>
  </div>
);


