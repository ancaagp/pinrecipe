// getting recipe container for adding the recipe card
console.log('NEW CATEGORIES');

const card = document.querySelector('#recipe')
const categorySelected = window.location.pathname.split('/')[1];
const categoryText = document.getElementById('category');
const categoryDescription = document.getElementById('category-description');

fetch('/api/v1/recipes')
    .then((buffer) => buffer.json())
    .then((data) => {
        render(data);
    })
    .catch((err) => console.log(err));

// for each recipe create recipe card and insert in container
function render(recipesArray) {
  if (categorySelected === 'breakfast') {
    renderBreakfast(recipesArray)
  } else if (categorySelected === 'lunch') {
     renderLunch(recipesArray);
  } else if (categorySelected === 'dinner') {
    renderDinner(recipesArray);
  } else if (categorySelected === 'dessert') {
    renderDessert(recipesArray);
  };
};

// If we selected breakfast category
function renderBreakfast(recipesArray) {
  categoryText.textContent = "Breakfast";
  categoryDescription.textContent = "Best ideas for your breakfast"

  const recipeTemplate = recipesArray.map((recipe) => {
    console.log(recipe);

    if (recipe.category.indexOf('Breakfast') !== -1) {
      return getRecipeCard(recipe);
    };
  }).join('');
  card.insertAdjacentHTML('beforeend', recipeTemplate);
};

// If we selected lunch category
function renderLunch(recipesArray) {
  categoryText.textContent = "Lunch";
  categoryDescription.textContent = "Best ideas for your lunch"

  const recipeTemplate = recipesArray.map((recipe) => {
    if (recipe.category.indexOf('Lunch') !== -1) {
      return getRecipeCard(recipe);
    };
  }).join('');
  card.insertAdjacentHTML('beforeend', recipeTemplate);
};


// If we selected dinner category
function renderDinner(recipesArray) {
  categoryText.textContent = "Dinner";
  categoryDescription.textContent = "Best ideas for your dinner"

  const recipeTemplate = recipesArray.map((recipe) => {
    console.log(recipe);

    if (recipe.category.indexOf('Dinner') !== -1) {
      return getRecipeCard(recipe);
    };
  }).join('');
  card.insertAdjacentHTML('beforeend', recipeTemplate);
};


// If we selected dessert category
function renderDessert(recipesArray) {
  categoryText.textContent = "Dessert";
  categoryDescription.textContent = "Best ideas for your dessert"

  const recipeTemplate = recipesArray.map((recipe) => {
    console.log(recipe);

    if (recipe.category.indexOf('Dessert') !== -1) {
      return getRecipeCard(recipe);
    };
  }).join('');
  card.insertAdjacentHTML('beforeend', recipeTemplate);
};

// creates recipe card html
function getRecipeCard(recipe) {
  return `
  <div class="col-md-3">
  <div class="card mb-4 shadow-sm">
    <img class="bd-placeholder-img card-img-top" width="100%" height="225"
      src="${recipe.image}"></img>
    <div class="card-body">
      <p class="card-text">${recipe.name}</p>
      <div class="d-flex justify-content-between align-items-center">
        <small class="text-muted">${recipe.calories}Cal/${recipe.cookingTime}</small>

        <div class="btn-group">
          <a href="/recipes/${recipe._id}" class="btn btn-sm btn-outline-secondary viewRecipe">View</a>
        </div>
      </div>
    </div>
  </div>
</div>
  `
};
