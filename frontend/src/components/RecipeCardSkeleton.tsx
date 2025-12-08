import { Card,CardContent } from "./ui/card";



export const RecipeCardSkeleton = () => (
  <Card className="overflow-hidden rounded-md border-gray-200 bg-white animate-pulse">
    <div className="relative">
      <div className="w-full h-40 sm:h-48 bg-gray-200"></div>
      <div className="absolute top-3 left-3">
        <div className="w-12 h-5 bg-gray-300 rounded-full"></div>
      </div>
      <div className="absolute bottom-3 left-3">
        <div className="w-16 h-5 bg-gray-300 rounded-full"></div>
      </div>
    </div>
    
    <CardContent className="p-4">
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-full"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <div className="w-8 h-3 bg-gray-200 rounded"></div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <div className="w-4 h-3 bg-gray-200 rounded"></div>
          </div>
          <div className="w-16 h-3 bg-gray-200 rounded"></div>
        </div>
      </div>
    </CardContent>
  </Card>
);