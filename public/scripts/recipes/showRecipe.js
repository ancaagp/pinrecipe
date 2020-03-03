const API_BASE = '/api/v1';
const photoPlaceholder = document.getElementById('photo');

const recipeId = window.location.pathname.split('/')[2];
const cookingTimePlaceholder = document.getElementById('time');
const caloriesPlaceholder = document.getElementById('calories');
const popoverPlaceholder = document.getElementById('popover');


function getRecipe() {
    fetch(`${API_BASE}/recipes/${recipeId}`)
        .then((stream) => stream.json())
        .then((res) => render(res))
        .catch((err) => console.log(err))
};

getRecipe();

//-------------------------------------------------------------------------------- RENDER PAGE

function render(recipeObj) {
    setPhotoColumn(recipeObj);
    setIngredients(recipeObj.ingredients);
    setDescription(recipeObj.description);
    provideHowToCookLink(recipeObj.link);
    renderReviews(recipeObj.reviews)
}

//-------------------------------------------------------------------------------- SET PHOTO

function setPhotoColumn(recipeObj) {
    console.log(recipeObj);

    photoPlaceholder.setAttribute('src', recipeObj.image);
    cookingTimePlaceholder.textContent = `Time: ${recipeObj.cookingTime}`
    caloriesPlaceholder.textContent = `Calories: ${recipeObj.calories}`
    // popoverPlaceholder.data-content;
    // console.log(popoverPlaceholder);  
};

//-------------------------------------------------------------------------------- SET INGREDIENTS

function setIngredients(array) {
    const ingredientsUl = document.getElementById('ingredients');
    if (ingredientsUl.childNodes.length === 0) {
        for (let i = 0; i < array.length; i += 1) {
            let li = document.createElement('li');
            li.textContent = array[i];
            ingredientsUl.appendChild(li);
        };
    };
};

//-------------------------------------------------------------------------------- SET DESCRIPTION

function setDescription(description) {
    const descriptionPlaceholder = document.getElementById('description')
    descriptionPlaceholder.textContent = description;
};

//-------------------------------------------------------------------------------- SET LINK


function provideHowToCookLink(strLink) {
    const howToCook = document.getElementById('link');
    howToCook.setAttribute('href', strLink);
    howToCook.setAttribute('target', '_blank');
};

//-------------------------------------------------------------------------------- DISPLAY REVIEWS

function renderReviews(reviewsArray) {
    let reviewUl = document.getElementById('reviewsUl');
    while(reviewUl.childNodes.length) {
        reviewUl.removeChild(reviewUl.childNodes[reviewUl.childNodes.length - 1]);
    };    

    for (let i = 0; i < reviewsArray.length; i += 1) {
        let review = `
        <li class="d-flex align-items-start m-4">
            <i class="fa fa-edit"></i>
            ${reviewsArray[i].body}
            <i class="fa fa-remove" style="color: red"></i>
        </li>
        `
        reviewUl.insertAdjacentHTML('afterbegin', review);
    };
};

//-------------------------------------------------------------------------------- ADD NEW REVIEW

const reviewForm = document.getElementById('review-modal');
reviewForm.addEventListener('submit', (event) => {
    console.log(event);

    event.preventDefault();

    const body = document.getElementById('review-text');

    if (body.value.length > 0) {
        const newReview = { body: body.value };
        document.getElementById('review-text').value = "";
        // console.log(newReview);

        fetch(`/api/v1/recipes/${recipeId}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newReview)
        })
            .then((stream) => stream.json())
            .then((res) => {
                // console.log(res);
                getRecipe();
                $('#exampleModal').modal('hide')
            });
    };
});

//------------------------------------------------------------------------------------------------- OPEN REVIEW MODAL

// Functionality of the modal Review
$('#exampleModal').on('show.bs.modal', function (event) {
    var button = $(event.relatedTarget) // Button that triggered the modal
    var recipient = button.data('whatever') // Extract info from data-* attributes
    // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
    // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
    var modal = $(this)
    modal.find('.modal-title').text('New message to ' + recipient)
    modal.find('.modal-body input').val(recipient)
});

//------------------------------------------------------------------------------------------------- Show message "Share..." on click
$('#popover').on('click', function () {
    $('#popover').popover('show');
    let message = $('#popover')[0].dataset.content;

    copyToClipboard(message);
});

//------------------------------------------------------------------------------------------------- Automatically copy message to clipboard
function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};


