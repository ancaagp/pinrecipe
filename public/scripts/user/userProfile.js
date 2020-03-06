// If user is in the localStorage - take it
let currentUser = JSON.parse(localStorage.getItem('currentUser'));

let logoutBtn;
let userUpdated;

// Get information if currentUser exists = someone is logged in.
fetch('/api/v1/verify')
    .then((res) => res.json())
    .then((data) => {        
        // if we don't have a currentUser in localStorage - use one from session
        if (!currentUser) {
            currentUser = data.currentUser;
        };

        renderData(currentUser);
    });


const logout = () => {
    fetch('/api/v1/logout', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'credentials': 'include', 
        },
    })
    .then((res) => res.json())
    .then((data) => {
        if (data.status === 200) {
            window.location='/';
        }
    });

    // Remove currentUser from localStorage
    localStorage.removeItem("currentUser");
};

// Fill user's fields with the information 
function renderData(currentUser) { 
    logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener("click", logout);

    const firstName = document.getElementById('firstName'); 
    const lastName = document.getElementById('lastName'); 
    const email = document.getElementById('email'); 

    firstName.value = currentUser.firstName;
    lastName.value = currentUser.lastName;
    email.value = currentUser.email;
};
// -------------------- Update user profile

const updateProfileBtn = document.getElementById("updateProfile");

updateProfileBtn.addEventListener('click', (event) => {
    const firstName = document.getElementById("firstName");
    const lastName = document.getElementById("lastName");
    const email = document.getElementById("email");
    userUpdated = {firstName: firstName.value, lastName: lastName.value, email: email.value};

    // Save updated user to localStorage for being able to display changes on front-end
    localStorage.setItem("currentUser", JSON.stringify(userUpdated));
    
    fetch(`/api/v1/user/${currentUser._id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'credentials': 'include',
        },
        body: JSON.stringify(userUpdated)
    })
        .then((stream) => stream.json())
        .then((res) => {            
            renderData(userUpdated);
            showMsg()
        })
    })

const showMsg = () => {
    let form = document.getElementById('profileForm');
    let successUpdate = document.querySelector('.successMsg');
    if (!successUpdate) {
        form.insertAdjacentHTML('beforebegin', `
    <div class="successMsg">
    Your information has been successfully updated.
    </div>
    `);
    };
}
