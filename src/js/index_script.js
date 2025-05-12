// Function to handle Google Sign-In credential response
function handleCredentialResponse(response) {
    const responsePayload = parseJwt(response.credential);

    document.getElementById('user-image').src = responsePayload.picture;
    document.getElementById('user-name').textContent = responsePayload.name;
    document.getElementById('user-email').textContent = responsePayload.email;
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('user-info').style.display = 'block';
    document.getElementById('success-message').style.display = 'block';

    sessionStorage.setItem('user', JSON.stringify({
        name: responsePayload.name,
        email: responsePayload.email,
        picture: responsePayload.picture
    }));

    const userEmail = responsePayload.email.toLowerCase();

    setTimeout(() => {
        if (userEmail === "fzbatshon@gmail.com") {
            window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/your-portal";
        } else {
            window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/members-dashboard";
        }
    }, 2000);
}

// Function to parse JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Check if user is already logged in
document.addEventListener('DOMContentLoaded', () => {
    const storedUser = sessionStorage.getItem('user');

    if (storedUser) {
        const user = JSON.parse(storedUser);
        document.getElementById('user-image').src = user.picture;
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-email').textContent = user.email;

        document.getElementById('login-form').style.display = 'none';
        document.getElementById('user-info').style.display = 'block';
    }

    // Regular login button click handler
    document.querySelector('.login-btn').addEventListener('click', () => {
        const email = document.getElementById('email').value.toLowerCase();
        const password = document.getElementById('password').value;

        if (email && password) {
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('login-form').style.display = 'none';

            setTimeout(() => {
                if (email === "prathamaggarwal7586@gmail.com") {
                    window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/leader-portal";
                } else if (email === "fzbatshon@ucsd.edu") {
                    window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/member-portal";
                } else {
                    alert("Email not recognized. Access denied.");
                    document.getElementById('success-message').style.display = 'none';
                    document.getElementById('login-form').style.display = 'block';
                }
            }, 2000);
        } else {
            alert("Please enter both email and password.");
        }
    });

    // Logout button click handler
    document.getElementById('logout-btn').addEventListener('click', () => {
        sessionStorage.removeItem('user');

        document.getElementById('user-info').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('success-message').style.display = 'none';

        document.getElementById('email').value = '';
        document.getElementById('password').value = '';

        google.accounts.id.disableAutoSelect();
    });
});
