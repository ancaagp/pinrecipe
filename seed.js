/* I am not sure we need to pre-create seed for reviews. 
   They will be connected with recipesId. Before that, our recipes should get ids.
   I believe, we will create reviews to existing recipes from HTML page */

const db = require('./models');
console.log(db);

const recipes = [
    {
        name: "Mushroom soup",
        description: "Use porcini and wild mushrooms to make this rich and creamy soup that makes a filling yet light supper for cold nights.",
        calories: 347,
        ingredients: [
            "25g dried porcini", 
            "50g butter", 
            "1 onion", 
            "1 garlic clove", 
            "thyme", 
            "400g mixed wild mushrooms",       
            "850ml vegetable stock",
            "200ml tub crème fraîche",
            "truffle oil",
        ],
        cookingTime: "1h 10min",
        image: "https://www.bbcgoodfood.com/sites/default/files/styles/recipe/public/recipe_images/recipe-image-legacy-id--458510_12.jpg?itok=EF_1bnMj",
        link: "https://www.bbcgoodfood.com/recipes/creamy-mushroom-soup",
        reviews: "",
    },
    {
        name: "Almond meal cookies",
        description: "A healthy and tasty treat - almond cookies with chocolate chips and coconut. A simple recipe.",
        calories: 120,
        ingredients: [
            "1 1/4 cups almond meal",
            "1/4 cup chopped dairy-free dark chocolate (Sara used cacao nibs)",
            "1/2 cup shredded unsweetened coconut",
            "1/2 tsp baking powder",
            "1/4 tsp salt (Sara used sea salt)",
            "1/3 cup brown sugar (Sara used muscovado)",
            "1 large egg",
            "3 Tbsp coconut oil (melted)",
            "1/2 tsp vanilla extract",
        ],
        cookingTime: "55min",
        image: "https://minimalistbaker.com/wp-content/uploads/2012/11/chewy-gluten-free-choc-chip-cookies.jpg",
        link: "https://minimalistbaker.com/coconut-chocolate-chip-almond-meal-cookies/",
        reviews: "",
    },
    {
        name: "Eggs Benedict",
        description: "Eggs Benedict, poached eggs over bacon and buttered toasted English muffin, topped with Hollandaise sauce.",
        calories: 728,
        ingredients: [
            "8 pieces of bacon or 4 pieces of Canadian bacon",
            "2 tablespoons chopped parsley, for garnish",
            "4 eggs",
            "2 teaspoons white or rice vinegar",
            "2 English muffins",
            "Butter",
        ],
        cookingTime: "25min",
        image: "https://www.simplyrecipes.com/wp-content/uploads/2010/04/eggs-benedict-vertical-a-1600-809x1024.jpg",
        link: "https://www.simplyrecipes.com/recipes/eggs_benedict/",
        reviews: "",
    }
];


db.Recipe.deleteMany({}, (err, result) => {
    if (err) {
        console.log(err);
        process.exit();
    }
    console.log(`Deleted ${result.deletedCount} recipes.`);
    console.log("Creating new recipes.");
    db.Recipe.create(recipes, (err, newRecipes) => {
        if (err) {
            console.log(err);
            process.exit();
        } 
        console.log(`Created ${newRecipes.length} recipes.`);
        process.exit();
    });
});
