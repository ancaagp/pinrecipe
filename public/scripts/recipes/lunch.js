// getting recipe container for adding the recipe card
const card = document.querySelector('#recipe')
fetch('/api/v1/recipes')
    .then((buffer) => buffer.json())
    .then((data) => {
        render(data);
    })
    .catch((err) => console.log(err));

// for each recipe create recipe card and insert in container
function render(recipesArray) {
    const recipeTemplate = recipesArray.map((recipe) => {        
        if (recipe.category.indexOf('Lunch') !== -1) {
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
}
