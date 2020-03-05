// currentUser is undefined. It is just a placeholder
let currentUser;
let logoutBtn;

// Get information if currentUser exists = someone is logged in.
fetch('/api/v1/verify')
    .then((res) => res.json())
    .then((data) => {        
        // Assign the data about currentUser to the variable
        currentUser = data.currentUser;

        // if currentUser exists (=== true), then set the information on the page
        if (currentUser) {
            renderData(currentUser)
        };
    });


// Fill user's fields with the information 
function renderData(currentUser) { 
    logoutBtn = document.getElementById('logout');
    logoutBtn.addEventListener("click", logout);
    console.log(currentUser);
      
    const firstName = document.getElementById('firstName'); 
    const lastName = document.getElementById('lastName'); 
    const email = document.getElementById('email'); 

    firstName.value = currentUser.firstName;
    lastName.value = currentUser.lastName;
    email.value = currentUser.email;
};


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
};