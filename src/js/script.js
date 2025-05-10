       // Function to handle Google Sign-In credential response
        function handleCredentialResponse(response) {
            // Decode the JWT token to get user information
            const responsePayload = parseJwt(response.credential);
            
            // Display user information
            document.getElementById('user-image').src = responsePayload.picture;
            document.getElementById('user-name').textContent = responsePayload.name;
            document.getElementById('user-email').textContent = responsePayload.email;
            
            // Hide login form and show user info
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('user-info').style.display = 'block';
            
            // Show success message
            document.getElementById('success-message').style.display = 'block';
            
            // Store user information in session storage
            sessionStorage.setItem('user', JSON.stringify({
                name: responsePayload.name,
                email: responsePayload.email,
                picture: responsePayload.picture
            }));
            
            // Simulate redirection to dashboard after a delay
            setTimeout(() => {
                alert("In a real application, you would be redirected to the scout dashboard now.");
                // window.location.href = 'dashboard.html';
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
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                
                if (email && password) {
                    document.getElementById('success-message').style.display = 'block';
                    document.getElementById('login-form').style.display = 'none';
                    
                    // Simulate a user login (in a real app, this would verify credentials with a server)
                    setTimeout(() => {
                        alert("In a real application, credentials would be verified with your server.");
                        // window.location.href = 'dashboard.html';
                    }, 2000);
                } else {
                    alert("Please enter both email and password.");
                }
            });
            
            // Logout button click handler
            document.getElementById('logout-btn').addEventListener('click', () => {
                // Clear session storage
                sessionStorage.removeItem('user');
                
                // Hide user info and show login form
                document.getElementById('user-info').style.display = 'none';
                document.getElementById('login-form').style.display = 'block';
                document.getElementById('success-message').style.display = 'none';
                
                // Clear form fields
                document.getElementById('email').value = '';
                document.getElementById('password').value = '';
                
                // Sign out from Google
                google.accounts.id.disableAutoSelect();
            });
        });