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

    // Fixed: Use the correct URL format for CSV and proper redirection logic
    redirectUserBasedOnEmail(userEmail);
}

// Function to redirect user based on email access level
function redirectUserBasedOnEmail(userEmail) {
    // IMPORTANT: Change the URL format from pubhtml to pub?output=csv
    const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTlMoOn8NXcQgIrzDq-MAbQBMIQkIKeOCXo4TvSsPfevN3iMwIGiHWjcCxpLVZnyRelW1WICD6nfFGL/pub?output=csv";
    
    console.log("Checking access for email:", userEmail);
    
    Papa.parse(sheetURL, {
        download: true,
        header: true,
        skipEmptyLines: true,
        complete: function(results) {
            console.log("CSV Data loaded:", results.data);
            
            // Check if we have valid data
            if (!results.data || results.data.length === 0) {
                console.error("No data found in the CSV");
                fallbackRedirect();
                return;
            }
            
            // Find the correct column name (case insensitive)
            const emailColumnName = Object.keys(results.data[0]).find(
                key => key.toLowerCase().includes('email')
            );
            
            if (!emailColumnName) {
                console.error("No email column found in the CSV");
                fallbackRedirect();
                return;
            }
            
            console.log("Using email column:", emailColumnName);
            
            // Extract emails, clean them and convert to lowercase
            const emailList = results.data
                .map(row => row[emailColumnName]?.trim().toLowerCase())
                .filter(email => !!email);
                
            console.log("Authorized emails:", emailList);
            console.log("User email to check:", userEmail);
            
            // Check if userEmail is in the list
            if (emailList.includes(userEmail)) {
                console.log("Email found! Redirecting to leader portal");
                setTimeout(() => {
                    window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/your-portal";
                }, 2000);
            } else {
                console.log("Email not found. Redirecting to members dashboard");
                setTimeout(() => {
                    window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/members-dashboard";
                }, 2000);
            }
        },
        error: function(error) {
            console.error("Error loading or parsing CSV:", error);
            fallbackRedirect();
        }
    });
}

// Fallback redirect function
function fallbackRedirect() {
    console.log("Using fallback redirect to members dashboard");
    setTimeout(() => {
        window.location.href = "https://sites.google.com/view/swefiehorthodoxscout/members-dashboard";
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
        
        // Also check redirection for already logged in users
        redirectUserBasedOnEmail(user.email.toLowerCase());
    }

    // Regular login button click handler
    document.querySelector('.login-btn').addEventListener('click', () => {
        const email = document.getElementById('email').value.toLowerCase();
        const password = document.getElementById('password').value;

        if (email && password) {
            document.getElementById('success-message').style.display = 'block';
            document.getElementById('login-form').style.display = 'none';

            // Use the same redirection function for consistency
            redirectUserBasedOnEmail(email);
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