console.log('LogIn test');

// Select the form
const loginForm = document.getElementById('login-form');

// Add eventListener to handle login process
loginForm.addEventListener('submit', handleLogin);

function handleLogin(event) {
    event.preventDefault();
    const userData = {};

    const formInputs = [...loginForm.elements];
    formInputs.forEach((input) => {
        userData[input.name] = input.value;
        input.value = "";
    });

    fetch('/api/v1/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'credentials': 'include',
        },
        body: JSON.stringify(userData),
    })
        .then((res) => res.json())
        .then((data) => {
            if (data.status === 200) {
                window.location = '/profile';
            }

            console.log(data);
        })
        .catch((err) => console.log(err));
};