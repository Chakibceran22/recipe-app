import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface RecipeErrorProps {
  onRetry?: () => void;
  errorMessage?: string;
  errorType?: 'network' | 'server' | 'general';
}

const RecipeError: React.FC<RecipeErrorProps> = ({ 
  onRetry, 
  errorMessage = "Something went wrong while loading recipes",
  errorType = 'general'
}) => {
  const getErrorIcon = () => {
    switch (errorType) {
      case 'network':
        return <WifiOff className="w-16 h-16 text-orange-400" />;
      case 'server':
        return <AlertTriangle className="w-16 h-16 text-orange-400" />;
      default:
        return <AlertTriangle className="w-16 h-16 text-orange-400" />;
    }
  };

  const getErrorTitle = () => {
    switch (errorType) {
      case 'network':
        return "No Internet Connection";
      case 'server':
        return "Server Error";
      default:
        return "Oops! Something went wrong";
    }
  };

  const getErrorDescription = () => {
    switch (errorType) {
      case 'network':
        return "Please check your internet connection and try again.";
      case 'server':
        return "Our servers are having trouble. Please try again in a moment.";
      default:
        return "We couldn't load the recipes right now. Please try again.";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      {/* Error Icon */}
      <div className="mb-6">
        {getErrorIcon()}
      </div>

      {/* Error Alert */}
      <Alert className="max-w-md mb-6 border-orange-200 bg-orange-50">
        <AlertTriangle className="h-4 w-4 text-orange-600" />
        <AlertDescription className="text-orange-800">
          {errorMessage}
        </AlertDescription>
      </Alert>

      {/* Error Content */}
      <div className="max-w-md w-full">
        <div className="text-center bg-white rounded-lg shadow-sm p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {getErrorTitle()}
          </h3>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {getErrorDescription()}
          </p>
          
          {onRetry && (
            <Button 
              onClick={onRetry}
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg transition-all duration-200 flex items-center gap-2 mx-auto font-medium shadow-lg hover:shadow-xl hover:scale-105"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
        </div>
      </div>

      {/* Additional Help Text */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          If the problem persists, please contact support
        </p>
      </div>
    </div>
  );
};

export default RecipeError;