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

    // setTimeout(() => {
    //     if (userEmail === "fzbatshon@gmail.com") {
    //         window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/your-portal";
    //     } else {
    //         window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/members-dashboard";
    //     }
    // }, 2000);

        // Public URL of the Google Sheet as CSV
    const sheetURL = "https://docs.google.com/spreadsheets/d/1xsinmzQkO-_fRAmX7-ewWuBf95alMpBFWQfx1Zh5UmI/edit?gid=1237977068#gid=1237977068";

    // Function to fetch and parse CSV using PapaParse
    function fetchEmailListAndRedirect() {
        Papa.parse(sheetURL, {
            download: true,          // Tells PapaParse to fetch the CSV from URL
            header: true,            // Automatically use the first row as keys: "Full Name", "Emails"
            skipEmptyLines: true,    // Ignores empty rows
            complete: function(results) {
                // Extract only the "Emails" column into a list
                const emailList = results.data.map(row => row["Emails"]?.trim());

                // Check if the current user's email exists in the list
                if (emailList.includes(userEmail)) {
                    // Redirect to the private portal
                    window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/your-portal";
                } else {
                    // Redirect to the general members dashboard
                    window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/members-dashboard";
                }
            },
            error: function(error) {
                // Log parsing or network errors
                console.error("PapaParse error:", error);

                // Fallback redirect
                window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/members-dashboard";
            }
        });
    }

    // Wait 2 seconds before executing
    setTimeout(fetchEmailListAndRedirect, 2000);
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
                if (userEmail === "fzbatshon@gmail.com") {
                    window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/your-portal";
                } else {
                    window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/members-dashboard";
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
