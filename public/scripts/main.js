
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
    // resets recipe page
    const recipeCard = document.getElementById("recipe");
    // alternative to while: recipeCard.innerHTML=" "; 
    while (recipeCard.childNodes.length) {
        recipeCard.removeChild(recipeCard.childNodes[recipeCard.childNodes.length - 1]);
    };
    // resets add new recipe form
    document.getElementById('recipeName').value = "";
    document.getElementById('recipeDesc').value="";
    document.getElementById('ingredients').value="";
    document.getElementById('linkImg').value="";
    document.getElementById('linkMethod').value="";
    document.getElementById('calories').value="";
    document.getElementById('cookingTime').value="";
    // resets category checkboxes
    $("input[name='categoryGroup[]']:checked").each(function () {
        this.checked = false;
    });
};

// creates recipe card html
function getRecipeCard(recipe) {
    // ternary operator: if condition is true ? add recipe.image, otherwise : add link
    let image = recipe.image ? recipe.image : "https://blog.myfitnesspal.com/wp-content/uploads/2018/01/UACF_EG_Hero_NoBadge_Healthy-Eating-752x472.jpg";
    return `
    <div id="recipeCard" class="col-md-3">
    <div class="card mb-4 shadow-sm">
      <img class="bd-placeholder-img card-img-top" width="100%" height="225"
        src="${image}"></img>
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
    const ingredients = document.getElementById('ingredients');
    const linkImage = document.getElementById('linkImg');
    const linkMethod = document.getElementById('linkMethod');
    const calories = document.getElementById('calories');
    const cookingTime = document.getElementById('cookingTime');
    
    // category is a group of checkboxes and needs to be handled separately
    // added name 'categoryGroup[]' to every checkbox and selected only the checked ones
    let categories = [];
    $("input[name='categoryGroup[]']:checked").each(function () {
        // push the value of the checked boxes into categories array
        categories.push($(this).val());
    });

    const newRecipe = {
        name: name.value, 
        description: description.value,
        image: linkImage.value,
        calories: calories.value,
        link: linkMethod.value,
        cookingTime: cookingTime.value,
        ingredients: ingredients.value.split(','),
        category: categories,
    }

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
});

// --------------------- LOGOUT

// gets data of the current user from verify route
let currentUser

fetch('/api/v1/verify')
.then((res) => res.json())
.then((data) => {
    currentUser = data.currentUser;
});

console.log(currentUser);


