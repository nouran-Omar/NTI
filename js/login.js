document.querySelector('.toggle-password').addEventListener('click', function() {
    const passwordInput = document.getElementById('password');
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
    } else {
        passwordInput.type = 'password';
    }
});

function initializeUsers() {
    if (!localStorage.getItem('luxeUsers')) {
        const defaultUsers = [
            {
                email: 'user@example.com',
                password: 'password123',
                name: 'Demo User'
            },
            {
                email: 'admin@luxe.com',
                password: 'admin123',
                name: 'Admin User',
                isAdmin: true
            }
        ];
        localStorage.setItem('luxeUsers', JSON.stringify(defaultUsers));
    }
}

// Form validation and submission
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginBtn = document.getElementById('loginBtn');
    const spinner = loginBtn.querySelector('.spinner-border');
    
    spinner.classList.remove('d-none');
    loginBtn.disabled = true;
    
    if (!email || !password) {
        spinner.classList.add('d-none');
        loginBtn.disabled = false;
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all fields',
            icon: 'error',
            confirmButtonText: 'OK',
            background: 'var(--secondary-dark)',
            color: 'var(--text-light)'
        });
        return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        spinner.classList.add('d-none');
        loginBtn.disabled = false;
        Swal.fire({
            title: 'Error!',
            text: 'Please enter a valid email address',
            icon: 'error',
            confirmButtonText: 'OK',
            background: 'var(--secondary-dark)',
            color: 'var(--text-light)'
        });
        return;
    }
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check user credentials
    const users = JSON.parse(localStorage.getItem('luxeUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        const userSession = {
            email: user.email,
            name: user.name,
            isAdmin: user.isAdmin || false,
            loggedIn: true,
            rememberMe: rememberMe
        };
        
        localStorage.setItem('luxeUser', JSON.stringify(userSession));
        
        Swal.fire({
            title: 'Success!',
            text: 'Login successful!',
            icon: 'success',
            confirmButtonText: 'Continue',
            background: 'var(--secondary-dark)',
            color: 'var(--text-light)'
        }).then(() => {
            window.location.href = 'index.html';
        });
    } else {
        spinner.classList.add('d-none');
        loginBtn.disabled = false;
        Swal.fire({
            title: 'Error!',
            text: 'Invalid email or password',
            icon: 'error',
            confirmButtonText: 'OK',
            background: 'var(--secondary-dark)',
            color: 'var(--text-light)'
        });
    }
});

document.getElementById('forgotPassword').addEventListener('click', function(e) {
    e.preventDefault();
    Swal.fire({
        title: 'Reset Password',
        input: 'email',
        inputLabel: 'Enter your email address',
        inputPlaceholder: 'Your registered email',
        showCancelButton: true,
        confirmButtonText: 'Send Reset Link',
        showLoaderOnConfirm: true,
        background: 'var(--secondary-dark)',
        color: 'var(--text-light)',
        preConfirm: (email) => {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const users = JSON.parse(localStorage.getItem('luxeUsers') || '[]');
                    const userExists = users.some(u => u.email === email);
                    
                    if (!userExists) {
                        Swal.showValidationMessage('Email not found');
                        resolve(false);
                    } else {
                        resolve(email);
                    }
                }, 1000);
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Success!',
                text: 'Password reset link has been sent to your email',
                icon: 'success',
                confirmButtonText: 'OK',
                background: 'var(--secondary-dark)',
                color: 'var(--text-light)'
            });
        }
    });
});

document.getElementById('registerLink').addEventListener('click', function(e) {
    e.preventDefault();
    
    Swal.fire({
        title: 'Create Account',
        html:
            '<input id="swal-name" class="swal2-input" placeholder="Full Name">' +
            '<input id="swal-email" class="swal2-input" placeholder="Email" type="email">' +
            '<input id="swal-password" class="swal2-input" placeholder="Password" type="password">' +
            '<input id="swal-confirm" class="swal2-input" placeholder="Confirm Password" type="password">',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Register',
        showLoaderOnConfirm: true,
        background: 'var(--secondary-dark)',
        color: 'var(--text-light)',
        preConfirm: () => {
            const name = document.getElementById('swal-name').value;
            const email = document.getElementById('swal-email').value;
            const password = document.getElementById('swal-password').value;
            const confirm = document.getElementById('swal-confirm').value;
            
            if (!name || !email || !password || !confirm) {
                Swal.showValidationMessage('Please fill all fields');
                return false;
            }
            
            if (password !== confirm) {
                Swal.showValidationMessage('Passwords do not match');
                return false;
            }
            
            if (password.length < 6) {
                Swal.showValidationMessage('Password must be at least 6 characters');
                return false;
            }
            
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                Swal.showValidationMessage('Please enter a valid email address');
                return false;
            }
            
            return new Promise((resolve) => {
                setTimeout(() => {
                    const users = JSON.parse(localStorage.getItem('luxeUsers') || '[]');
                    const userExists = users.some(u => u.email === email);
                    
                    if (userExists) {
                        Swal.showValidationMessage('Email already registered');
                        resolve(false);
                    } else {
                        const newUser = {
                            email,
                            password,
                            name
                        };
                        users.push(newUser);
                        localStorage.setItem('luxeUsers', JSON.stringify(users));
                        resolve(true);
                    }
                }, 1000);
            });
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire({
                title: 'Success!',
                text: 'Account created successfully. You can now login.',
                icon: 'success',
                confirmButtonText: 'OK',
                background: 'var(--secondary-dark)',
                color: 'var(--text-light)'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    initializeUsers();
    const userSession = JSON.parse(localStorage.getItem('luxeUser') || '{}');
    if (userSession.loggedIn) {
        window.location.href = 'index.html';
    }
    
    if (userSession.rememberMe && userSession.email) {
        document.getElementById('email').value = userSession.email;
        document.getElementById('rememberMe').checked = true;
    }
});
