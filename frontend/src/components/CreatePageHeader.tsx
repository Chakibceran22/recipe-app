import { Button } from "./ui/button"
import { ArrowLeft, ChefHat, Plus } from "lucide-react"
const CreatePageHeader = ({onBack} : { onBack: () => void;}) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={onBack}
                className="p-2 hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Create New Recipe</h1>
                  <p className="text-xs text-gray-500">Share your culinary creation</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
  )
}

export default CreatePageHeader