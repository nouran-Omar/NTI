// مصفوفة المنتجات الأساسية
const staticProducts = [
    {
        id: "premium-hoodie",
        name: "Premium Hoodie",
        price: 185.00,
        category: "clothing",
        image: "https://i.etsystatic.com/59708286/r/il/b04f25/7004589553/il_600x600.7004589553_2a8p.jpg",
        badge: "New",
        rating: 5,
        description: ""
    },
    {
        id: "designer-sneakers",
        name: "Designer Sneakers",
        price: 350.00,
        category: "clothing",
        image: "https://i.etsystatic.com/53865371/r/il/d0675e/7089420878/il_600x600.7089420878_nvzf.jpg",
        badge: "Best Seller",
        rating: 5,
        description: ""
    },
    {
        id: "swiss-watch",
        name: "Swiss Timepiece",
        price: 1250.00,
        category: "luxury",
        image: "https://i.etsystatic.com/60344941/r/il/bfc0ac/7096534851/il_600x600.7096534851_jes8.jpg",
        badge: "Limited",
        rating: 5,
        description: ""
    },
    {
        id: "cashmere-scarf",
        name: "Cashmere Scarf",
        price: 130.00,
        category: "accessories",
        image: "https://i.etsystatic.com/17149872/r/il/2aaddf/5660277014/il_600x600.5660277014_j2tm.jpg",
        badge: "",
        rating: 4,
        description: ""
    },
    {
        id: "wireless-headphones",
        name: "Wireless Headphones",
        price: 399.00,
        category: "electronics",
        image: "https://i.etsystatic.com/23157179/r/il/846b70/6430569209/il_600x600.6430569209_jaup.jpg",
        badge: "Premium",
        rating: 5,
        description: ""
    },
    {
        id: "italian-leather-gloves",
        name: "Italian Leather Gloves",
        price: 155.00,
        category: "accessories",
        image: "https://i.etsystatic.com/20809271/r/il/59b6af/2268269851/il_600x600.2268269851_smj6.jpg",
        badge: "Handcrafted",
        rating: 5,
        description: ""
    }
];
function initializeProducts() {
    const savedProducts = localStorage.getItem('luxeProducts');
    if (!savedProducts) {
        localStorage.setItem('luxeProducts', JSON.stringify(staticProducts));
      
    }
}
function addAdditionalProducts() {
    const additionalProducts = [
        {
            id: "leather-wallet",
            name: "Genuine Leather Wallet",
            price: 89.99,
            category: "accessories",
            image: "https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=1000",
            badge: "Popular",
            rating: 4.5,
            description: ""
        },
        {
            id: "smart-watch",
            name: "Smart Watch Pro",
            price: 299.99,
            category: "electronics",
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000",
            badge: "New",
            rating: 4.8,
            description: ""
        }
    ];

    const savedProducts = JSON.parse(localStorage.getItem('luxeProducts')) || [];
    additionalProducts.forEach(newProduct => {
        const exists = savedProducts.some(product => product.id === newProduct.id);
        if (!exists) {
            savedProducts.push(newProduct);
        }
    });
    
    localStorage.setItem('luxeProducts', JSON.stringify(savedProducts));
    return savedProducts;
}
function getImagePath(imagePath) {
    // إذا كان المسار يحتوي على http أو data: (base64) فهو مسار صحيح
    if (imagePath && (imagePath.startsWith('http') || imagePath.startsWith('data:'))) {
        return imagePath;
    }
    
    // إذا كان اسم ملف فقط، أضف مجلد images
    if (imagePath && !imagePath.includes('/') && !imagePath.startsWith('http')) {
        return `${imagePath}`;
    }
    
    // إذا كان المسار يحتوي على مجلد بالفعل
    if (imagePath && imagePath.includes('/') && !imagePath.startsWith('http')) {
        return imagePath;
    }
    // return 'https://placehold.co/600x400/1a1a1a/d4af37?text=Product';
}

function loadDynamicProducts() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) {
        console.error('Products container not found');
        return;
    }
    
    const savedProducts = JSON.parse(localStorage.getItem('luxeProducts')) || [];
        productsContainer.innerHTML = '';
    if (savedProducts.length === 0) {
        productsContainer.innerHTML = `
            <div class="col-12 text-center py-5">
                <h4>No products available</h4>
                <p>Please check back later.</p>
            </div>
        `;
        return;
    }

    savedProducts.forEach((product, index) => {
        const delay = 100 + (index * 100);
        
        const productElement = document.createElement('div');
        productElement.className = 'col-lg-4 col-md-6';
        productElement.setAttribute('data-category', product.category);
        productElement.setAttribute('data-aos', 'fade-up');
        productElement.setAttribute('data-aos-duration', '800');
        productElement.setAttribute('data-aos-delay', delay);
        
        let starsHtml = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= Math.floor(product.rating)) {
                starsHtml += '<i class="fas fa-star star"></i>';
            } else if (i === Math.ceil(product.rating) && !Number.isInteger(product.rating)) {
                starsHtml += '<i class="fas fa-star-half-alt star"></i>';
            } else {
                starsHtml += '<i class="far fa-star star"></i>';
            }
        }
        
        const imageUrl = getImagePath(product.image);
        
        productElement.innerHTML = `
            <div class="product-card glow-effect" data-id="${product.id}">
                ${product.badge ? `<div class="product-badge">${product.badge}</div>` : ''}
                <button class="btn-wishlist">
                    <i class="fas fa-heart"></i>
                </button>
                <div class="product-image-container">
                    <img src="${imageUrl}" alt="${product.name}" class="product-image">
                </div>
                <button class="quick-view-btn">Quick View</button>
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-rating">
                        ${starsHtml}
                    </div>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="btn btn-luxury add-to-cart" data-product-id="${product.id}">
                        ADD TO CART
                    </button>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productElement);
    });
    
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}
function setupProductFiltering() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    const applyFilter = (filter) => {
        const products = document.querySelectorAll('[data-category]');
        products.forEach(product => {
            if (filter === 'all' || product.getAttribute('data-category') === filter) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            applyFilter(filter);
        });
    });
    
    // تطبيق الفلتر الافتراضي
    applyFilter('all');
}
function setupAddToCartButtons() {
    const productsContainer = document.getElementById('products-container');
    if (!productsContainer) return;
 
    productsContainer.addEventListener('click', (e) => {
        const button = e.target.closest('.add-to-cart');
        if (button) {
            e.preventDefault();
            const user = JSON.parse(localStorage.getItem('luxeUser'));
            
            if (!user || !user.loggedIn) {
                Swal.fire({
                    title: 'Login Required',
                    text: 'You need to login to add products to cart',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Go to Login',
                    cancelButtonText: 'Cancel',
                    confirmButtonColor: '#d4af37',
                    cancelButtonColor: '#6c757d',
                    background: 'var(--secondary-dark)',
                    color: 'var(--text-light)'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = 'login.html';
                    }
                });
                return;
            }
            
            const productId = button.getAttribute('data-product-id');
            
            if (!productId) {
                console.error('Product ID not found');
                return;
            }

            const savedProducts = JSON.parse(localStorage.getItem('luxeProducts')) || [];
            const product = savedProducts.find(p => p.id === productId);
            

            if (product) {
                if (typeof window.addToCart === 'function') {
                    window.addToCart(product);
                } else {
                    console.error('addToCart function not found on window object');
                    if (typeof addToCart === 'function') {

                        addToCart(product);
                    } else {
                        console.error('No addToCart function available');
                        Swal.fire({
                            title: 'Error!',
                            text: 'Unable to add product to cart. Please try again.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                }
            } else {
                console.error('Product not found with ID:', productId);
            }
        }
    });
}

// دالة عرض الإشعارات
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <i class="fas fa-check-circle me-2"></i>
        ${message}
    `;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 10px;
        z-index: 9999;
        animation: slideIn 0.4s ease;
    `;
    
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideIn 0.4s ease reverse';
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, 2500);
}

// تهيئة الصفحة عند التحميل
document.addEventListener('DOMContentLoaded', function() {

    
    // تهيئة AOS
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    }
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 300);


    initializeProducts();
    addAdditionalProducts();
    loadDynamicProducts();
    setupProductFiltering();
    setupAddToCartButtons();
    
    if (typeof window.updateCartCount === 'function') {
        window.updateCartCount();
    }
    
});


