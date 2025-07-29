import { Recipe } from '@/types/recipe';
import carbonaraImg from '@/assets/carbonara.jpg';
import caesarSaladImg from '@/assets/caesar-salad.jpg';
import beefWellingtonImg from '@/assets/beef-wellington.jpg';
import lavaCakeImg from '@/assets/lava-cake.jpg';

export const recipes: Recipe[] = [
  {
    id: 1,
    title: "Classic Spaghetti Carbonara",
    description: "Creamy, indulgent pasta with crispy pancetta and parmesan cheese",
    image: carbonaraImg,
    cookTime: "20 min",
    difficulty: "Medium",
    servings: 4,
    category: "Italian",
    ingredients: [
      "400g spaghetti",
      "200g pancetta, diced",
      "4 large eggs",
      "100g Pecorino Romano cheese, grated",
      "Black pepper",
      "Salt"
    ],
    instructions: [
      "Cook spaghetti according to package instructions",
      "Fry pancetta until crispy",
      "Whisk eggs with cheese and black pepper",
      "Combine hot pasta with pancetta and egg mixture",
      "Toss quickly to create creamy sauce",
      "Serve immediately with extra cheese"
    ]
  },
  {
    id: 2,
    title: "Fresh Caesar Salad",
    description: "Crisp romaine lettuce with classic Caesar dressing and croutons",
    image: caesarSaladImg,
    cookTime: "15 min",
    difficulty: "Easy",
    servings: 2,
    category: "Salad",
    ingredients: [
      "2 heads romaine lettuce",
      "1/2 cup parmesan cheese",
      "1 cup croutons",
      "3 anchovy fillets",
      "2 garlic cloves",
      "1 egg yolk",
      "1 lemon",
      "1/4 cup olive oil"
    ],
    instructions: [
      "Wash and chop romaine lettuce",
      "Make dressing with anchovies, garlic, egg yolk, and lemon",
      "Slowly whisk in olive oil",
      "Toss lettuce with dressing",
      "Top with parmesan and croutons",
      "Serve immediately"
    ]
  },
  {
    id: 3,
    title: "Beef Wellington",
    description: "Tender beef fillet wrapped in flaky pastry with mushroom duxelles",
    image: beefWellingtonImg,
    cookTime: "2 hours",
    difficulty: "Hard",
    servings: 6,
    category: "British",
    ingredients: [
      "1kg beef fillet",
      "500g puff pastry",
      "500g mushrooms",
      "200g pâté",
      "6 slices prosciutto",
      "2 egg yolks",
      "Fresh thyme",
      "Salt and pepper"
    ],
    instructions: [
      "Sear beef fillet on all sides",
      "Prepare mushroom duxelles",
      "Wrap beef in prosciutto and pâté",
      "Encase in puff pastry",
      "Brush with egg wash",
      "Bake at 200°C for 25-30 minutes",
      "Rest before slicing"
    ]
  },
  {
    id: 4,
    title: "Chocolate Lava Cake",
    description: "Decadent chocolate dessert with molten center",
    image: lavaCakeImg,
    cookTime: "25 min",
    difficulty: "Medium",
    servings: 4,
    category: "Dessert",
    ingredients: [
      "200g dark chocolate",
      "200g butter",
      "4 eggs",
      "4 egg yolks",
      "100g sugar",
      "60g flour",
      "Butter for ramekins",
      "Cocoa powder"
    ],
    instructions: [
      "Melt chocolate and butter together",
      "Whisk eggs, yolks, and sugar until pale",
      "Combine chocolate mixture with egg mixture",
      "Fold in flour",
      "Fill buttered ramekins",
      "Bake at 220°C for 12 minutes",
      "Serve immediately with ice cream"
    ]
  },
  {
    id: 5,
    title: "Homemade Pizza Margherita",
    description: "Classic Italian pizza with tomato, mozzarella, and fresh basil",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
    cookTime: "30 min",
    difficulty: "Medium",
    servings: 2,
    category: "Italian",
    ingredients: [
      "Pizza dough",
      "400g canned tomatoes",
      "250g fresh mozzarella",
      "Fresh basil leaves",
      "Olive oil",
      "Salt",
      "Garlic"
    ],
    instructions: [
      "Prepare pizza dough",
      "Make tomato sauce with garlic",
      "Roll out dough",
      "Spread sauce on dough",
      "Add torn mozzarella",
      "Bake at 250°C for 10-12 minutes",
      "Top with fresh basil"
    ]
  },
  {
    id: 6,
    title: "Grilled Salmon with Herbs",
    description: "Perfectly grilled salmon with fresh herbs and lemon",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
    cookTime: "20 min",
    difficulty: "Easy",
    servings: 4,
    category: "Seafood",
    ingredients: [
      "4 salmon fillets",
      "Fresh dill",
      "Fresh parsley",
      "2 lemons",
      "Olive oil",
      "Salt and pepper",
      "Garlic"
    ],
    instructions: [
      "Season salmon with salt and pepper",
      "Mix herbs with olive oil and garlic",
      "Marinate salmon for 15 minutes",
      "Preheat grill to medium-high",
      "Grill salmon 4-5 minutes per side",
      "Serve with lemon wedges"
    ]
  },
  {
    id: 7,
    title: "Thai Green Curry",
    description: "Aromatic coconut curry with vegetables and herbs",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=800&h=600&fit=crop",
    cookTime: "35 min",
    difficulty: "Medium",
    servings: 4,
    category: "Thai",
    ingredients: [
      "400ml coconut milk",
      "3 tbsp green curry paste",
      "Chicken or tofu",
      "Thai eggplant",
      "Bell peppers",
      "Thai basil",
      "Fish sauce",
      "Palm sugar"
    ],
    instructions: [
      "Heat thick coconut milk in pan",
      "Add curry paste and cook until fragrant",
      "Add protein and cook through",
      "Add vegetables and remaining coconut milk",
      "Season with fish sauce and sugar",
      "Simmer until vegetables are tender",
      "Garnish with Thai basil"
    ]
  },
  {
    id: 8,
    title: "French Onion Soup",
    description: "Classic French soup with caramelized onions and cheese",
    image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop",
    cookTime: "1 hour",
    difficulty: "Medium",
    servings: 4,
    category: "French",
    ingredients: [
      "6 large onions",
      "1L beef stock",
      "1/2 cup white wine",
      "Gruyère cheese",
      "French bread",
      "Butter",
      "Fresh thyme",
      "Bay leaves"
    ],
    instructions: [
      "Slice onions thinly",
      "Caramelize onions slowly in butter",
      "Add wine and cook until reduced",
      "Add stock, thyme, and bay leaves",
      "Simmer for 30 minutes",
      "Top with bread and cheese",
      "Broil until golden and bubbling"
    ]
  }
];