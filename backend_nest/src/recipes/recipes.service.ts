import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Recipe } from './entities/recipe.entity';
import { CreateRecipeDto } from './dto/create-recipe/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto/update-recipe.dto';
@Injectable()
export class RecipesService {
    private recipes: Recipe[] = [{
        id: '1',
        title: 'Recipe 1',
        description: 'Description 1',
        image: 'image1.jpg',
        cookTime: 30,
        difficulty: 'Easy',
        servings: 4,
        category: 'Category 1',
        ingredients: ['Ingredient 1', 'Ingredient 2'],
        instructions: ['Instruction 1', 'Instruction 2'],
        createdAt: new Date(),
        updatedAt: new Date(),
    },
     {
    id: '2',
    title: 'Chicken Curry',
    description: 'A flavorful curry with tender chicken pieces and spices.',
    image: 'chicken-curry.jpg',
    cookTime: 60,
    difficulty: 'Hard',
    servings: 6,
    category: 'Curry',
    ingredients: ['Chicken', 'Coconut Milk', 'Curry Paste', 'Onion', 'Spices'],
    instructions: [
      'Sauté onion and spices.',
      'Add chicken and brown.',
      'Stir in curry paste and coconut milk.',
      'Simmer until chicken is cooked through.'
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Pancakes',
    description: 'Fluffy pancakes perfect for breakfast.',
    image: 'pancakes.jpg',
    cookTime: 20,
    difficulty: 'Easy',
    servings: 3,
    category: 'Breakfast',
    ingredients: ['Flour', 'Eggs', 'Milk', 'Sugar', 'Butter'],
    instructions: [
      'Mix flour, eggs, milk, and sugar into a smooth batter.',
      'Heat butter in a pan.',
      'Pour batter and cook until golden brown on both sides.'
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    title: 'Caesar Salad',
    description: 'Crisp romaine lettuce with creamy Caesar dressing.',
    image: 'caesar-salad.jpg',
    cookTime: 15,
    difficulty: 'Easy',
    servings: 2,
    category: 'Salad',
    ingredients: ['Romaine Lettuce', 'Croutons', 'Parmesan', 'Caesar Dressing'],
    instructions: [
      'Wash and chop lettuce.',
      'Toss lettuce with dressing.',
      'Top with croutons and parmesan.'
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    title: 'Beef Tacos',
    description: 'Mexican-style tacos with seasoned beef and toppings.',
    image: 'tacos.jpg',
    cookTime: 25,
    difficulty: 'Medium',
    servings: 4,
    category: 'Mexican',
    ingredients: ['Taco Shells', 'Ground Beef', 'Cheese', 'Lettuce', 'Tomato'],
    instructions: [
      'Cook ground beef with taco seasoning.',
      'Fill taco shells with beef.',
      'Add cheese, lettuce, and tomato on top.'
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
    }]
    async getRecipeById( id: string) : Promise<Recipe> {
        const result = this.recipes.find(recipe => recipe.id === id);
        if(!result) {
            throw new NotFoundException('Recipe not found');
        }
        return result;
    }

    async getAllRecipes() : Promise<Recipe[]> {
        return this.recipes;
    }

    async createRecipe(data: CreateRecipeDto) : Promise<CreateRecipeDto>{
        this.recipes.push({
            id: (this.recipes.length + 1).toString(),
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        } as Recipe);
        return data;;
    }

    async updateRecipe(id: string, data:UpdateRecipeDto) : Promise<string>{
        const index =  this.recipes.findIndex(recipe => recipe.id === id);
        if( index === -1) {
            throw new Error('Recipe not found');
        }
        this.recipes[index] = {...this.recipes[index], ...data};
        return 'Recipe updated successfully';
    }

    async deleteRecipe(id: string) : Promise<string>{
        const index = this.recipes.findIndex(recipe => recipe.id === id);
        if( index === -1) {
            throw new Error('Recipe not found');
        }
        this.recipes.splice(index, 1);
        return 'Recipe deleted successfully';
    }
}
