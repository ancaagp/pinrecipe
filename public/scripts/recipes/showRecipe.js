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
    while (reviewUl.childNodes.length) {
        reviewUl.removeChild(reviewUl.childNodes[reviewUl.childNodes.length - 1]);
    };

    for (let i = 0; i < reviewsArray.length; i += 1) {
        let reviewLi = document.createElement('li');
        let editIcon = document.createElement('i');
        let deleteIcon = document.createElement('i');

        reviewLi.setAttribute('class', 'd-flex align-items-start m-4');
        reviewLi.setAttribute('id', reviewsArray[i]._id);

        editIcon.setAttribute('class', 'fa fa-edit edit-review');
        deleteIcon.setAttribute('class', 'fa fa-remove delete-review');
        deleteIcon.setAttribute('style', 'color: red');

        reviewLi.textContent = reviewsArray[i].body;

        reviewLi.appendChild(editIcon);
        editIcon.addEventListener('click', editReview);

        reviewLi.appendChild(deleteIcon);
        deleteIcon.addEventListener('click', deleteReview);

        reviewUl.appendChild(reviewLi);
    };
};

//-------------------------------------------------------------------------------- ADD NEW REVIEW

const reviewForm = document.getElementById('review-modal');
reviewForm.addEventListener('submit', (event) => {
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
                $('#reviewModal').modal('hide')
            });
    };
});


//------------------------------------------------------------------------------------------------- EDIT REVIEW (MODAL)

function editReview(event) {
    if (event.target.classList.contains('edit-review')) {
        const updateBody = document.getElementById('update-review-text');
        updateBody.value = event.target.parentNode.textContent;

        let reviewId = event.target.parentNode.id;
        document.getElementById("update-review-modal-review-id").setAttribute("value", reviewId);

        $('#updateReviewModal').modal('show');

        
    };
};
const updateForm = document.getElementById('update-review-modal');

updateForm.addEventListener('submit', function (event) {
    console.log('HERE');

    event.preventDefault();
    const updateBody = document.getElementById('update-review-text');
    const reviewId = document.getElementById("update-review-modal-review-id").getAttribute("value")
    let updatedReview = { body: updateBody.value };
    console.log(updatedReview);

    fetch(`/api/v1/recipes/${recipeId}/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReview)
    })
        .then((stream) => stream.json())
        .then((res) => {
            // console.log(res);
            getRecipe();
            $('#updateReviewModal').modal('hide')
        });

});

//------------------------------------------------------------------------------------------------- EDIT REVIEW (MODAL)


function deleteReview(event) {
    if (event.target.classList.contains('delete-review')) {
        let reviewId = event.target.parentNode.id;

        fetch(`/api/v1/recipes/${recipeId}/reviews/${reviewId}`, {
            method: 'DELETE'
        })
            .then((stream) => console.log(stream))
            .then((res) => {
                console.log(res);
                getRecipe();
            })
            .catch((err) => console.log(err));
    };
};

//------------------------------------------------------------------------------------------------- OPEN REVIEW MODAL

// Functionality of the modal Review
$('#reviewModal').on('show.bs.modal');

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


