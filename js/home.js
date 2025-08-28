
         document.addEventListener('DOMContentLoaded', function() {
            const sleeperOverlay = document.querySelector('.sleeper-overlay');
            const body = document.body;
            setTimeout(() => {
                sleeperOverlay.classList.add('animate');
                
                setTimeout(() => {
                    sleeperOverlay.classList.add('hidden');
                    body.classList.add('loaded');

                    document.querySelectorAll('.navbar, .hero-section, .hero-title, .hero-subtitle, .btn-luxury, .stats-section, .stat-item, .featured-products, .section-title, .product-card, .testimonials, .testimonial-card, .footer, .add-product-btn').forEach(el => {
                        el.classList.add('loaded');
                    });

                    setTimeout(() => {
                        sleeperOverlay.style.display = 'none';
                    }, 1000);
                }, 1200);
            }, 200);
            var swiper = new Swiper(".mySwiper", {
                spaceBetween: 30,
                effect: "fade",
                loop: true,
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                },
                navigation: {
                    nextEl: ".swiper-button-next",
                    prevEl: ".swiper-button-prev",
                },
            });
            
            setTimeout(() => {
                document.querySelector('.swiper-section').classList.add('loaded');
            }, 2100);
            
            // Check admin status
            const userSession = JSON.parse(localStorage.getItem('luxeUser') || '{}');
            const addProductBtn = document.getElementById('addProductBtn');

            if (userSession.loggedIn && userSession.isAdmin) {
                addProductBtn.classList.remove('d-none');
            }
            addProductBtn.addEventListener('click', function(e) {
                e.preventDefault();
                window.location.href = 'addcard.html';
            });

            checkLoginStatus();
        });

        let cart = JSON.parse(localStorage.getItem('luxeCart')) || [];

function setupHomeAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.getAttribute('data-product-id');
            const products = {
                'premium-shoes': {
                    id: 'premium-shoes',
                    name: 'Premium Shoes',
                    price: 299.00,
                    image: 'https://images.unsplash.com/photo-1608667508764-33cf0726b13a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fHNob2VzfGVufDB8fDB8fHww'
                },
                'luxury-watch': {
                    id: 'luxury-watch',
                    name: 'Luxury Timepiece',
                    price: 899.00,
                    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0Y2h8ZW58MHx8MHx8fDA%3D'
                },
                'designer-bag': {
                    id: 'designer-bag',
                    name: 'Designer Handbag',
                    price: 459.00,
                    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmFnfGVufDB8fDB8fHww'
                }
            };
            
            if (products[productId]) {
                if (typeof addToCart === 'function') {
                    addToCart(products[productId]);
                } else {
                    console.error('addToCart function not found');
                    if (typeof fallbackAddToCart === 'function') {
                        fallbackAddToCart(products[productId]);
                    }
                }
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupHomeAddToCartButtons();
});
        
        function updateCartCount() {
            const cartCount = document.querySelector('.cart-count');
            cartCount.textContent = cart.length;
        }
        
        function showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                z-index: 9999;
                animation: slideIn 0.3s ease;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        
        // Create floating particles
        function createParticles() {
            const particlesContainer = document.querySelector('.hero-particles');
            for (let i = 0; i < 20; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.top = Math.random() * 100 + '%';
                particle.style.width = particle.style.height = (Math.random() * 6 + 2) + 'px';
                particle.style.animationDelay = Math.random() * 6 + 's';
                particle.style.animationDuration = (Math.random() * 4 + 4) + 's';
                particlesContainer.appendChild(particle);
            }
        }
        
        // Smooth scroll to products
        function scrollToProducts() {
            document.getElementById('products').scrollIntoView({
                behavior: 'smooth'
            });
        }
        
        // Intersection Observer for fade-in animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);
        
        // Animate numbers
        function animateNumbers() {
            const numbers = document.querySelectorAll('.stat-number');
            numbers.forEach(number => {
                const target = parseInt(number.textContent.replace(/[^0-9]/g, ''));
                let current = 0;
                const increment = target / 50;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    number.textContent = number.textContent.replace(/\d+/, Math.floor(current));
                }, 50);
            });
        }
        
        function logout() {
            Swal.fire({
                title: 'Are you sure?',
                text: 'You will be logged out from your account',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, logout!',
                background: 'var(--secondary-dark)',
                color: 'var(--text-light)'
            }).then((result) => {
                if (result.isConfirmed) {
                    localStorage.removeItem('luxeUser');
                    Swal.fire({
                        title: 'Logged out!',
                        text: 'You have been successfully logged out.',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        background: 'var(--secondary-dark)',
                        color: 'var(--text-light)'
                    }).then(() => {
                        window.location.href = 'login.html';
                    });
                }
            });
        }
        
        function checkLoginStatus() {
            const userData = JSON.parse(localStorage.getItem('luxeUser') || '{}');
            const userNameElement = document.getElementById('userName');
            const logoutBtnContainer = document.getElementById('logoutBtnContainer');
            const loginBtnContainer = document.getElementById('loginBtnContainer');
            
            if (userData.loggedIn) {
                userNameElement.textContent = userData.name || 'User';
                logoutBtnContainer.classList.remove('d-none');
                loginBtnContainer.classList.add('d-none');
            } else {
                userNameElement.textContent = 'Guest';
                logoutBtnContainer.classList.add('d-none');
                loginBtnContainer.classList.remove('d-none');
            }
        }
        
        document.addEventListener('DOMContentLoaded', () => {
            createParticles();
            updateCartCount();
            document.querySelectorAll('.fade-in').forEach(el => {
                observer.observe(el);
            });
            const statsSection = document.querySelector('.stats-section');
            const statsObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateNumbers();
                    statsObserver.unobserve(statsSection);
                }
            });
            statsObserver.observe(statsSection);
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                logout();
            });
        });
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
            }
        });
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);