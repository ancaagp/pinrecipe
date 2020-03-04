
// ------------------------------- SHOW RECIPE

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
        return getRecipeCard(recipe);
    }).join('');

    card.insertAdjacentHTML('beforeend', recipeTemplate);

};


function reset() {
    const recipeCard = document.getElementById("recipe");
    // alternative to while
   // recipeCard.innerHTML=" "; 
    while (recipeCard.childNodes.length) {
        recipeCard.removeChild(recipeCard.childNodes[recipeCard.childNodes.length - 1]);
    };
};


// creates recipe card html
function getRecipeCard(recipe) {
    return `
    <div id="recipeCard" class="col-md-3">
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


// ---------------------------- POST NEW RECIPE

const postRecipe = document.getElementById("createRecipe");

// gets added recipe
function getRecipes () {
    fetch('/api/v1/recipes/')
    .then((stream) => stream.json())
    .then(res => render(res))
    .catch((err) => console.log(err));
}


postRecipe.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('recipeName');
    const description = document.getElementById('recipeDesc');
    // const ingredients = ;
    // const linkImage = ;
    // const linkMethod = ;
    // const category =[];
    
    const newRecipe = {name: recipeName.value, description: recipeDesc.value}
    // console.log(newRecipe);

    // Posting the new recipe
    fetch('/api/v1/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRecipe),
    })
    .then((stream) => stream.json())
    .then((res) => {

        // reset page
        reset();

        // Updates the pages with the new recipe
        getRecipes();

        // Hides the model on submit
        $('.recipeModal').modal('hide')
    })
    .catch((err) => console.log(err));
})