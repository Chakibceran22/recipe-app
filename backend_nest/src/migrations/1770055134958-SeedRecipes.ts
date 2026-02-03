import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedRecipes1770055134958 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure difficulties exist
    await queryRunner.query(`
      INSERT INTO difficulties (level) 
      VALUES ('Easy'), ('Medium'), ('Hard')
      ON CONFLICT (level) DO NOTHING;
    `);

    // Get difficulty IDs
    const difficulties = await queryRunner.query(`SELECT id, level FROM difficulties`);
    const diffMap = difficulties.reduce((acc: any, d: any) => {
      acc[d.level] = d.id;
      return acc;
    }, {});

    const recipes = [
      {
        title: 'Spaghetti Carbonara',
        description: 'Classic Italian pasta with eggs, cheese, and pancetta',
        image: 'https://static01.nyt.com/images/2021/02/14/dining/carbonara-horizontal/carbonara-horizontal-threeByTwoMediumAt2X-v2.jpg',
        cookTime: 20,
        difficulty: 'Easy',
        servings: 4,
        category: 'Italian',
        ingredients: ['400g spaghetti', '200g pancetta', '4 eggs', '100g parmesan', 'black pepper', 'salt'],
        instructions: ['Boil pasta', 'Fry pancetta', 'Mix eggs and cheese', 'Combine everything', 'Serve hot']
      },
      {
        title: 'Chicken Tikka Masala',
        description: 'Creamy and spicy Indian curry with tender chicken',
        image: 'https://bellyfull.net/wp-content/uploads/2021/05/Chicken-Tikka-Masala-blog.jpg',
        cookTime: 45,
        difficulty: 'Medium',
        servings: 6,
        category: 'Indian',
        ingredients: ['800g chicken', '400ml cream', '2 onions', '4 tomatoes', 'tikka masala spice', 'garlic', 'ginger'],
        instructions: ['Marinate chicken', 'Grill chicken', 'Make sauce', 'Simmer together', 'Serve with rice']
      },
      {
        title: 'Caesar Salad',
        description: 'Fresh romaine lettuce with creamy Caesar dressing',
        image: 'https://damndelicious.net/wp-content/uploads/2023/01/220905_DD_Chx-Caesar-Salad_051.jpg.webp',
        cookTime: 15,
        difficulty: 'Easy',
        servings: 2,
        category: 'Salad',
        ingredients: ['1 romaine lettuce', '100g parmesan', 'croutons', 'Caesar dressing', 'anchovies'],
        instructions: ['Wash and chop lettuce', 'Make dressing', 'Toss salad', 'Add croutons', 'Top with parmesan']
      },
      {
        title: 'Beef Tacos',
        description: 'Mexican street-style tacos with seasoned beef',
        image: 'https://www.cookingclassy.com/wp-content/uploads/2018/01/shredded-beef-tacos-3-1460x2190.jpg',
        cookTime: 25,
        difficulty: 'Easy',
        servings: 4,
        category: 'Mexican',
        ingredients: ['500g ground beef', 'taco shells', 'lettuce', 'tomatoes', 'cheese', 'sour cream', 'taco seasoning'],
        instructions: ['Brown the beef', 'Add seasoning', 'Warm taco shells', 'Assemble tacos', 'Add toppings']
      },
      {
        title: 'Pad Thai',
        description: 'Popular Thai stir-fried noodle dish',
        image: 'https://inquiringchef.com/wp-content/uploads/2023/02/Authentic-Pad-Thai-1923-1.jpg',
        cookTime: 30,
        difficulty: 'Medium',
        servings: 4,
        category: 'Thai',
        ingredients: ['rice noodles', 'shrimp', 'eggs', 'bean sprouts', 'peanuts', 'lime', 'fish sauce', 'tamarind'],
        instructions: ['Soak noodles', 'Stir fry protein', 'Add noodles', 'Add sauce', 'Garnish and serve']
      },
      {
        title: 'Greek Moussaka',
        description: 'Layered eggplant and meat casserole',
        image: 'https://www.recipetineats.com/tachyon/2020/11/Greek-Moussaka_3-re-edited.jpg',
        cookTime: 90,
        difficulty: 'Hard',
        servings: 8,
        category: 'Greek',
        ingredients: ['3 eggplants', '500g ground lamb', 'bechamel sauce', 'tomatoes', 'onions', 'cinnamon', 'cheese'],
        instructions: ['Slice and fry eggplant', 'Make meat sauce', 'Make bechamel', 'Layer ingredients', 'Bake until golden']
      },
      {
        title: 'Margherita Pizza',
        description: 'Simple Italian pizza with tomato, mozzarella, and basil',
        image: 'https://www.vindulge.com/wp-content/uploads/2022/05/Margherita-Pizza.jpg',
        cookTime: 25,
        difficulty: 'Medium',
        servings: 2,
        category: 'Italian',
        ingredients: ['pizza dough', 'tomato sauce', '250g mozzarella', 'fresh basil', 'olive oil'],
        instructions: ['Roll out dough', 'Spread sauce', 'Add cheese', 'Bake at high heat', 'Add fresh basil']
      },
      {
        title: 'Tom Yum Soup',
        description: 'Spicy and sour Thai soup',
        image: 'https://thai-foodie.com/wp-content/uploads/2025/02/chicken-tom-yum-soup-bowl.jpg',
        cookTime: 30,
        difficulty: 'Medium',
        servings: 4,
        category: 'Thai',
        ingredients: ['shrimp', 'lemongrass', 'galangal', 'lime leaves', 'chilies', 'fish sauce', 'mushrooms'],
        instructions: ['Boil broth', 'Add aromatics', 'Add shrimp', 'Season', 'Serve hot']
      },
      {
        title: 'Beef Stroganoff',
        description: 'Creamy Russian beef dish',
        image: 'https://www.recipetineats.com/tachyon/2018/01/Beef-Stroganoff_2-1-1.jpg',
        cookTime: 40,
        difficulty: 'Medium',
        servings: 4,
        category: 'Russian',
        ingredients: ['500g beef strips', 'mushrooms', 'onions', 'sour cream', 'beef stock', 'paprika'],
        instructions: ['Sear beef', 'Cook onions and mushrooms', 'Add stock', 'Stir in sour cream', 'Serve over noodles']
      },
      {
        title: 'Shakshuka',
        description: 'Middle Eastern poached eggs in tomato sauce',
        image: 'https://i2.wp.com/www.downshiftology.com/wp-content/uploads/2023/12/Shakshuka-3-2.jpg',
        cookTime: 30,
        difficulty: 'Easy',
        servings: 4,
        category: 'Middle Eastern',
        ingredients: ['6 eggs', 'tomatoes', 'bell peppers', 'onions', 'cumin', 'paprika', 'feta cheese'],
        instructions: ['Sauté vegetables', 'Add spices', 'Make wells for eggs', 'Poach eggs', 'Serve with bread']
      },
      {
        title: 'Ramen Bowl',
        description: 'Japanese noodle soup with rich broth',
        image: 'https://thefoodiediaries.co/wp-content/uploads/2020/08/img_4288.jpg',
        cookTime: 60,
        difficulty: 'Hard',
        servings: 4,
        category: 'Japanese',
        ingredients: ['ramen noodles', 'pork belly', 'eggs', 'nori', 'green onions', 'miso paste', 'chicken stock'],
        instructions: ['Make broth', 'Cook pork', 'Boil eggs', 'Cook noodles', 'Assemble bowl']
      },
      {
        title: 'Fish and Chips',
        description: 'British classic with battered fish',
        image: 'https://dinnerthendessert.com/wp-content/uploads/2024/02/fish-and-chips-4x3-1.jpg',
        cookTime: 35,
        difficulty: 'Medium',
        servings: 4,
        category: 'British',
        ingredients: ['cod fillets', 'potatoes', 'flour', 'beer', 'baking powder', 'malt vinegar'],
        instructions: ['Cut and fry chips', 'Make batter', 'Coat fish', 'Deep fry', 'Serve with mushy peas']
      },
      {
        title: 'Chicken Parmesan',
        description: 'Breaded chicken with marinara and cheese',
        image: 'https://i0.wp.com/kristineskitchenblog.com/wp-content/uploads/2024/08/chicken-parmesan-recipe-07-2.jpg',
        cookTime: 40,
        difficulty: 'Medium',
        servings: 4,
        category: 'Italian',
        ingredients: ['chicken breasts', 'breadcrumbs', 'marinara sauce', 'mozzarella', 'parmesan', 'eggs'],
        instructions: ['Bread chicken', 'Fry chicken', 'Top with sauce and cheese', 'Bake', 'Serve with pasta']
      },
      {
        title: 'Pho',
        description: 'Vietnamese noodle soup',
        image: 'https://www.recipetineats.com/tachyon/2019/04/Beef-Pho_6.jpg',
        cookTime: 120,
        difficulty: 'Hard',
        servings: 6,
        category: 'Vietnamese',
        ingredients: ['beef bones', 'rice noodles', 'beef slices', 'star anise', 'ginger', 'onions', 'herbs'],
        instructions: ['Make broth (simmer hours)', 'Cook noodles', 'Slice beef thin', 'Assemble bowls', 'Add herbs']
      },
      {
        title: 'Falafel Wrap',
        description: 'Middle Eastern chickpea fritters in pita',
        image: 'https://beingnutritious.com/wp-content/uploads/2022/07/Baked-falafel-wrap-scaled.jpg',
        cookTime: 30,
        difficulty: 'Easy',
        servings: 4,
        category: 'Middle Eastern',
        ingredients: ['chickpeas', 'parsley', 'garlic', 'cumin', 'pita bread', 'tahini', 'vegetables'],
        instructions: ['Blend chickpeas', 'Form patties', 'Fry falafel', 'Make tahini sauce', 'Wrap in pita']
      },
      {
        title: 'Paella',
        description: 'Spanish rice dish with seafood',
        image: 'https://www.billyparisi.com/wp-content/uploads/2012/12/paella-1.jpg',
        cookTime: 50,
        difficulty: 'Hard',
        servings: 6,
        category: 'Spanish',
        ingredients: ['rice', 'shrimp', 'mussels', 'chorizo', 'saffron', 'bell peppers', 'peas'],
        instructions: ['Cook chorizo', 'Add rice and saffron', 'Add broth', 'Arrange seafood', 'Simmer until done']
      },
      {
        title: 'Pulled Pork Sandwich',
        description: 'Slow-cooked BBQ pork on a bun',
        image: 'https://www.southernliving.com/thmb/HDG_geBbTVn73uyxFr87djE3v2o=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/Carolina-Pulled-Pork-Sandwiches_Audit3624_beauty-87-4828653074324470984a1205baf0545d.jpg',
        cookTime: 480,
        difficulty: 'Easy',
        servings: 8,
        category: 'American',
        ingredients: ['pork shoulder', 'BBQ sauce', 'buns', 'coleslaw', 'brown sugar', 'spices'],
        instructions: ['Season pork', 'Slow cook 8 hours', 'Shred meat', 'Mix with sauce', 'Serve on buns']
      },
      {
        title: 'Bibimbap',
        description: 'Korean mixed rice bowl',
        image: 'https://takestwoeggs.com/wp-content/uploads/2025/05/Overhead-Bibimbap-Korean-Rice-Bowl.webp',
        cookTime: 40,
        difficulty: 'Medium',
        servings: 4,
        category: 'Korean',
        ingredients: ['rice', 'beef', 'spinach', 'carrots', 'eggs', 'gochujang', 'sesame oil'],
        instructions: ['Cook rice', 'Prepare vegetables', 'Cook beef', 'Fry eggs', 'Arrange in bowl']
      },
      {
        title: 'French Onion Soup',
        description: 'Classic soup with caramelized onions and cheese',
        image: 'https://www.cookingclassy.com/wp-content/uploads/2022/02/french-onion-soup-28.jpg',
        cookTime: 60,
        difficulty: 'Medium',
        servings: 4,
        category: 'French',
        ingredients: ['onions', 'beef stock', 'gruyere cheese', 'baguette', 'butter', 'thyme', 'wine'],
        instructions: ['Caramelize onions', 'Add stock and wine', 'Toast bread', 'Top with cheese', 'Broil until melted']
      }
    ];

    // Insert all recipes
    for (const recipe of recipes) {
      await queryRunner.query(
        `INSERT INTO recipes (title, description, image, "cookTime", servings, category, ingredients, instructions, "difficultyId")
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          recipe.title,
          recipe.description,
          recipe.image,
          recipe.cookTime,
          recipe.servings,
          recipe.category,
          recipe.ingredients,
          recipe.instructions,
          diffMap[recipe.difficulty]
        ]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM recipes WHERE title IN (
      'Spaghetti Carbonara', 'Chicken Tikka Masala', 'Caesar Salad', 
      'Beef Tacos', 'Pad Thai', 'Greek Moussaka', 'Margherita Pizza',
      'Tom Yum Soup', 'Beef Stroganoff', 'Shakshuka', 'Ramen Bowl',
      'Fish and Chips', 'Chicken Parmesan', 'Pho', 'Falafel Wrap',
      'Paella', 'Pulled Pork Sandwich', 'Bibimbap', 'French Onion Soup'
    )`);
  }
}