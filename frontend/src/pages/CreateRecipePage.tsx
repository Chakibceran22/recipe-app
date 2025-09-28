import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecipeFormData } from '@/types/Recipe';
import CreatePageHeader from '@/components/CreatePageHeader';
import CreateRecipeForm from '@/components/CreateRecipeForm';
import toast, { Toaster } from 'react-hot-toast';
import { createRecipe } from '@/services/RecipeServices';
import { QueryClient, useMutation } from '@tanstack/react-query';
// Create Recipe Form Component
const CreateRecipePage = ({ queryClient} : {queryClient: QueryClient}) => {
  const [formData, setFormData] = useState<RecipeFormData>({
    title: '',
    description: '',
    image: '',
    cookTime: 30,
    difficulty: {
      level: 'Easy'
    },
    servings: 4,
    category: '',
    ingredients: [''],
    instructions: ['']
  });
  const mutation = useMutation({
    mutationFn: createRecipe,
    onSuccess: () => {
      toast.success('Recipe created successfully!');
      queryClient.invalidateQueries({ queryKey: ['users'] });

      setTimeout(() => {
        navigate(-1);
      }, 2000);
    },
    onError: (error: any) => {
      console.error('Error creating recipe:', error);
      toast.error('Failed to create recipe. Please try again.');
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  }
  const onSave = ( data: RecipeFormData) => {
    mutation.mutate(data);
  }

  const categories = ['Italian', 'Thai', 'French', 'Japanese', 'British', 'Mediterranean', 'Mexican', 'Indian', 'Chinese', 'American'];
  const difficulties: Array<'Easy' | 'Medium' | 'Hard'> = ['Easy', 'Medium', 'Hard'];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (formData.cookTime <= 0) newErrors.cookTime = 'Cook time must be greater than 0';
    if (formData.servings <= 0) newErrors.servings = 'Servings must be greater than 0';
    
    const validIngredients = formData.ingredients.filter(ing => ing.trim());
    if (validIngredients.length === 0) newErrors.ingredients = 'At least one ingredient is required';
    
    const validInstructions = formData.instructions.filter(inst => inst.trim());
    if (validInstructions.length === 0) newErrors.instructions = 'At least one instruction is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const cleanedFormData = {
        ...formData,
        ingredients: formData.ingredients.filter(ing => ing.trim()),
        instructions: formData.instructions.filter(inst => inst.trim())
      };
      onSave(cleanedFormData);
      
    }
  };

  const addIngredient = () => {
    setFormData(prev => ({ ...prev, ingredients: [...prev.ingredients, ''] }));
  };

  const removeIngredient = (index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const updateIngredient = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? value : ing)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({ ...prev, instructions: [...prev.instructions, ''] }));
  };

  const removeInstruction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const updateInstruction = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => i === index ? value : inst)
    }));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Medium': return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Hard': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CreatePageHeader onBack={onBack} />

      {/* Form */}
      <CreateRecipeForm
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        difficulties={difficulties}
        errors={errors}
        addIngredient={addIngredient}
        updateIngredient={updateIngredient}
        removeIngredient={removeIngredient}
        addInstruction={addInstruction}
        updateInstruction={updateInstruction}
        removeInstruction={removeInstruction}
        getDifficultyColor={getDifficultyColor}
        handleSubmit={handleSubmit}
        onBack={onBack}
        />
        <Toaster position="bottom-right" />
    </div>
  );
};

export default CreateRecipePage;