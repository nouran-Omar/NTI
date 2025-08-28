const navbarHTML = `
    <nav class="navbar navbar-expand-lg fixed-top">
        <div class="container">
            <a class="navbar-brand" href="index.html">LUXE</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"><i class="fas fa-bars text-light"></i></span>
            </button>

            <div class="collapse navbar-collapse justify-content-between" id="navbarNav">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    
                </ul>

                <ul class="navbar-nav mx-auto mb-2 mb-lg-0">
                    <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="products.html">Products</a></li>
                    <li class="nav-item"><a class="nav-link" href="about.html">About Us</a></li>
                    <li class="nav-item"><a class="nav-link" href="#foot">Queries</a></li>
                </ul>

                <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
                    <li class="nav-item d-flex align-items-center">
                        <a class="nav-link" href="addcard.html">
                            <i class="fas fa-plus me-1"></i>
                            <span id="userName">Guest</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="cart.html">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-count">0</span>
                        </a>
                    </li>
                    <li class="nav-item" id="loginBtnContainer">
                        <a class="nav-link" href="login.html">Login</a>
                    </li>
                    <li class="nav-item d-none" id="logoutBtnContainer">
                        <a class="nav-link" href="#" id="logoutBtn">Logout</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>
`;

const footerHTML = `
    <footer class="footer" id ="foot">
        <div class="container">
            <div class="row">
                <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                    <h5>LUXE FASHION</h5>
                    <p>We offer you the latest global fashion trends with exceptional quality and elegant designs that suit your refined taste.</p>
                    <div class="social-links mt-3">
                        <a href="#" class="me-2"><i class="fab fa-instagram fa-lg"></i></a>
                        <a href="#" class="me-2"><i class="fab fa-facebook fa-lg"></i></a>
                        <a href="#" class="me-2"><i class="fab fa-twitter fa-lg"></i></a>
                        <a href="#"><i class="fab fa-tiktok fa-lg"></i></a>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                    <h5>Links</h5>
                    <ul class="footer-links">
                        <li><a href="index.html"><i class="fas fa-angle-left me-2"></i>Home</a></li>
                        <li><a href="products.html"><i class="fas fa-angle-left me-2"></i>Products</a></li>
                        <li><a href="about.html"><i class="fas fa-angle-left me-2"></i>About Us</a></li>
                        <li><a href="contact.html"><i class="fas fa-angle-left me-2"></i>Contact</a></li>
                        <li><a href="cart.html"><i class="fas fa-angle-left me-2"></i>cart</a></li>
                    </ul>
                </div>

                <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                    <h5>Contact information</h5>
                    <div class="footer-contact">
                        <i class="fas fa-map-marker-alt"></i>
                        <div>monfia</div>
                    </div>
                    <div class="footer-contact">
                        <i class="fas fa-phone"></i>
                        <div>+20 114 183 1449</div>
                    </div>
                    <div class="footer-contact">
                        <i class="fas fa-envelope"></i>
                        <div>info@luxe-fashion.com</div>
                    </div>
                    <div class="footer-contact">
                        <i class="fas fa-clock"></i>
                        <div>Tuesday , Monday 9Am- 10Am</div>
                    </div>
                </div>

                <div class="col-lg-3 col-md-6">
                  <h5>NEWSLETTER</h5>
                  <p>Subscribe to our newsletter to receive the latest offers and discounts first</p>
                    <div class="footer-newsletter">
                        <div class="input-group mb-3">
                            <input type="email" class="form-control" placeholder="Email">
                            <button class= "btn" type="button"> Supscripe</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="footer-bottom text-center mt-5 pt-4">
                <div class="row align-items-center">
                    <div class="col-md-6 text-md-start">
                        <p class="mb-0">&copy; 2025 LUXE</p>
                    </div>
                    <div class="col-md-6 text-md-end payment-methods">
                        <i class="fab fa-cc-visa"></i>
                        <i class="fab fa-cc-mastercard"></i>
                        <i class="fab fa-cc-amex"></i>
                        <i class="fab fa-cc-paypal"></i>
                        <i class="fab fa-apple-pay"></i>
                    </div>
                </div>
            </div>
        </div>
    </footer>
`;

function addNavbar() {
    document.body.insertAdjacentHTML('afterbegin', navbarHTML);
}

function addFooter() {
    document.body.insertAdjacentHTML('beforeend', footerHTML);
}
function getCart() {
    const user = JSON.parse(localStorage.getItem('luxeUser'));
    let cartKey = user ? `luxeCart_${user.email}` : 'luxeCart_guest';
    return JSON.parse(localStorage.getItem(cartKey)) || [];
}
function saveCart(cart) {
    const user = JSON.parse(localStorage.getItem('luxeUser'));
    let cartKey = user ? `luxeCart_${user.email}` : 'luxeCart_guest';
    localStorage.setItem(cartKey, JSON.stringify(cart));
    updateCartCount();
}
function updateCartCount() {
    const cart = getCart();
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
    const cartItemCount = document.getElementById('cart-item-count');
    if (cartItemCount) {
        cartItemCount.textContent = totalItems;
    }
}

function addToCart(product) {
    
    const user = JSON.parse(localStorage.getItem('luxeUser'));
    
    if (!user) {
        Swal.fire({
            title: 'Login Required',
            text: 'You need to login to add products to cart',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Go to Login',
            cancelButtonText: 'Cancel',
            background: 'var(--secondary-dark)',
            color: 'var(--text-light)'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'login.html';
            }
        });
        return;
    }

    let cart = getCart();
    const existingProduct = cart.find(item => item.id === product.id);

    if (existingProduct) {
        existingProduct.quantity += 1;
        
    } else {
        
        let productImage = product.image;
        const newCartItem = { 
            ...product, 
            quantity: 1,
            image: productImage || 'https://placehold.co/600x400/1a1a1a/d4af37?text=Product'
        };
        cart.push(newCartItem);
        
    }

    saveCart(cart);
    Swal.fire({
        icon: 'success',
        title: 'Added to Cart!',
        text: `${product.name} has been added to your cart`,
        showConfirmButton: false,
        timer: 1500,
        background: 'var(--secondary-dark)',
        color: 'var(--text-light)'
    });
}
function checkAuthState() {
    const user = JSON.parse(localStorage.getItem('luxeUser'));
    const userName = document.getElementById('userName');
    const logoutBtnContainer = document.getElementById('logoutBtnContainer');
    const loginBtnContainer = document.getElementById('loginBtnContainer');
    
    if (userName && logoutBtnContainer && loginBtnContainer) {
        if (user) {
            userName.textContent = user.name;
            logoutBtnContainer.classList.remove('d-none');
            loginBtnContainer.classList.add('d-none');
        } else {
            userName.textContent = 'Guest';
            logoutBtnContainer.classList.add('d-none');
            loginBtnContainer.classList.remove('d-none');
        }
    }
}
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();

            Swal.fire({
                title: 'Are you sure?',
                text: "Do you really want to log out?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Yes, Log out',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('luxeUser');
                    checkAuthState();
                    updateCartCount();
                    Swal.fire({
                        icon: 'success',
                        title: 'Logged out successfully',
                        showConfirmButton: false,
                        timer: 1500
                    });
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                }
            });
        });
    }
}

function updateSummary() {
    const cart = getCart();
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total-price');
    
    if (subtotalElement && taxElement && shippingElement && totalElement) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1;
        const shipping = subtotal > 100 ? 0 : 15; 
        const total = subtotal + tax + shipping;
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        taxElement.textContent = `$${tax.toFixed(2)}`;
        shippingElement.textContent = `$${shipping.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
}

function handleClearCart() {
    Swal.fire({
        title: 'Clear Cart?',
        text: 'Are you sure you want to remove all items from your cart?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, clear it!'
    }).then((result) => {
        if (result.isConfirmed) {
            saveCart([]);
            if (typeof renderCartItems === 'function') {
                renderCartItems();
            }
            Swal.fire(
                'Cleared!',
                'Your cart has been cleared.',
                'success'
            );
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
    addNavbar();
    addFooter();
    updateCartCount();
    checkAuthState();
    setupLogout();
});
window.addToCart = addToCart;
window.getCart = getCart;
window.saveCart = saveCart;
window.updateCartCount = updateCartCount;
window.updateSummary = updateSummary;
window.handleClearCart = handleClearCart;