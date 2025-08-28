
let products = JSON.parse(localStorage.getItem('luxeProducts')) || [];
let isAdmin = false;
let swiper = null;
    function checkStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            document.getElementById('storageWarning').style.display = 'none';
            return true;
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                document.getElementById('storageWarning').style.display = 'block';
                document.getElementById('storageWarningText').textContent = 
                    'Local storage is full. Please clear some data or use image URLs instead of uploading images.';
                return false;
            }
        }
        return true;
    }
    function checkAdminStatus() {
        Swal.fire({
            title: 'Admin Authentication',
            input: 'password',
            inputLabel: 'Enter admin password',
            inputPlaceholder: 'Enter your password',
            inputAttributes: {
                autocapitalize: 'off',
                autocorrect: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Login',
            showLoaderOnConfirm: true,
            preConfirm: (password) => {
                return password === 'admin123';
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                isAdmin = true;
                Swal.fire({
                    title: 'Success!',
                    text: 'You are now logged in as admin',
                    icon: 'success',
                    confirmButtonText: 'Continue'
                });
            } else {
                window.location.href = 'index.html';
            }
        });
    }

    // تحديث عداد السلة
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('luxeCart')) || [];
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    // معاينة الصورة
    function setupImagePreview() {
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.addEventListener('click', function() {
                document.getElementById('productImage').click();
            });
        }

        const productImage = document.getElementById('productImage');
        if (productImage) {
            productImage.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    if (file.size > 1000000) {
                        Swal.fire({
                            title: 'File too large',
                            text: 'Please select an image smaller than 1MB or use a URL instead.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                        this.value = '';
                        return;
                    }
                    
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = document.getElementById('previewImage');
                        preview.src = e.target.result;
                        document.getElementById('imagePreview').classList.add('has-image');
                    }
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    // إعداد نموذج إضافة المنتج
    function setupProductForm() {
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                if (!isAdmin) {
                    Swal.fire({
                        title: 'Access Denied',
                        text: 'You need to be an admin to add products',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    return;
                }
                
                if (!checkStorage()) {
                    Swal.fire({
                        title: 'Storage Full',
                        text: 'Please clear some data or use image URLs instead of uploading images.',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    return;
                }
                
                const name = document.getElementById('productName').value;
                const price = parseFloat(document.getElementById('productPrice').value);
                const category = document.getElementById('productCategory').value;
                const rating = parseFloat(document.getElementById('productRating').value);
                const description = document.getElementById('productDescription').value;
                const imageUrl = document.getElementById('imageUrl').value;
                const imageInput = document.getElementById('productImage');
                
                let imageData = imageUrl;
                
                if (!imageUrl && !imageInput.files[0]) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Please select an image or provide an image URL',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    return;
                }
                
                if (!imageUrl && imageInput.files[0]) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imageData = e.target.result;
                        completeProductAddition(name, price, category, rating, description, imageData);
                    };
                    reader.readAsDataURL(imageInput.files[0]);
                } else {
                    completeProductAddition(name, price, category, rating, description, imageData);
                }
            });
        }

        // إعداد أزرار المسح
        const clearForm = document.getElementById('clearForm');
        if (clearForm) {
            clearForm.addEventListener('click', function() {
                document.getElementById('productForm').reset();
                document.getElementById('imagePreview').classList.remove('has-image');
            });
        }

        const clearStorage = document.getElementById('clearStorage');
        if (clearStorage) {
            clearStorage.addEventListener('click', function() {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "This will delete all products and cart data!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, delete all!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        localStorage.removeItem('luxeProducts');
                        localStorage.removeItem('luxeCart');
                        products = [];
                        updateCartCount();
                        renderProducts();
                        
                        Swal.fire(
                            'Deleted!',
                            'All data has been deleted.',
                            'success'
                        );
                    }
                });
            });
        }
    }

    // إكمال إضافة المنتج
    function completeProductAddition(name, price, category, rating, description, imageData) {
        const newProduct = {
            id: Date.now().toString(),
            name,
            price,
            category,
            rating,
            description,
            image: imageData
        };
        
        try {
            products.push(newProduct);
            localStorage.setItem('luxeProducts', JSON.stringify(products));
            
            Swal.fire({
                title: 'Success!',
                text: 'Product added successfully',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            
            document.getElementById('productForm').reset();
            document.getElementById('imagePreview').classList.remove('has-image');
            
            renderProducts();
        } catch (e) {
            if (e.name === 'QuotaExceededError') {
                Swal.fire({
                    title: 'Storage Full',
                    text: 'Could not add product. Storage is full. Please clear some data.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } else {
                Swal.fire({
                    title: 'Error',
                    text: 'An error occurred while adding the product.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    }
function renderProducts() {
    const swiperWrapper = document.querySelector('.swiper-wrapper');
    
    if (!swiperWrapper) return;
    
    swiperWrapper.innerHTML = '';
    
    if (products.length === 0) {
        swiperWrapper.innerHTML = '<div class="text-center py-5 w-100"><p>No products found. Add some products to see them here.</p></div>';
        if (swiper) {
            swiper.destroy(true, true);
            swiper = null;
        }
        return;
    }
    
    // إذا كانت Swiper معينة بالفعل، ندمرها أولاً
    if (swiper) {
        swiper.destroy(true, true);
        swiper = null;
    }
    
    // إنشاء الشرائح يدوياً
    products.forEach(product => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <span class="product-category">${product.category}</span>
                    <div class="product-rating">
                        ${generateStarRating(product.rating)}
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-actions">
                        <button class="btn btn-luxury btn-sm edit-product" data-id="${product.id}">Edit</button>
                        <button class="btn btn-danger btn-sm delete-product" data-id="${product.id}">Delete</button>
                    </div>
                </div>
            </div>
        `;
        swiperWrapper.appendChild(slide);
    });
    
    // تهيئة Swiper
    swiper = new Swiper('#productsSwiper', {
        slidesPerView: 1,
        spaceBetween: 20,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        breakpoints: {
            640: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            },
        }
    });
    
    // إضافة معالجات الأحداث للزرين Edit و Delete
    swiperWrapper.addEventListener('click', function(e) {
        const editBtn = e.target.closest('.edit-product');
        const deleteBtn = e.target.closest('.delete-product');
        
        if (editBtn) {
            editProduct(editBtn.getAttribute('data-id'));
        }
        
        if (deleteBtn) {
            deleteProduct(deleteBtn.getAttribute('data-id'));
        }
    });
}

    // توليد تقييم النجوم
    function generateStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star text-warning"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt text-warning"></i>';
        }
        
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star text-warning"></i>';
        }
        
        return stars;
    }

    // تعديل المنتج
    function editProduct(id) {
        if (!isAdmin) {
            Swal.fire({
                title: 'Access Denied',
                text: 'You need to be an admin to edit products',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        
        const product = products.find(p => p.id === id);
        if (!product) return;
        
        Swal.fire({
            title: 'Edit Product',
            html:
                `<input id="swal-name" class="swal2-input" placeholder="Product Name" value="${product.name}">` +
                `<input id="swal-price" class="swal2-input" placeholder="Price" type="number" value="${product.price}" step="0.01">` +
                `<select id="swal-category" class="swal2-input">
                    <option value="clothing" ${product.category === 'clothing' ? 'selected' : ''}>Clothing</option>
                    <option value="accessories" ${product.category === 'accessories' ? 'selected' : ''}>Accessories</option>
                    <option value="electronics" ${product.category === 'electronics' ? 'selected' : ''}>Electronics</option>
                    <option value="luxury" ${product.category === 'luxury' ? 'selected' : ''}>Luxury Items</option>
                </select>` +
                `<input id="swal-rating" class="swal2-input" placeholder="Rating" type="number" value="${product.rating}" min="1" max="5" step="0.1">` +
                `<textarea id="swal-description" class="swal2-textarea" placeholder="Description">${product.description}</textarea>` +
                `<input id="swal-image" class="swal2-input" placeholder="Image URL" value="${product.image.startsWith('data:') ? '' : product.image}">`,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Update',
            preConfirm: () => {
                return {
                    name: document.getElementById('swal-name').value,
                    price: parseFloat(document.getElementById('swal-price').value),
                    category: document.getElementById('swal-category').value,
                    rating: parseFloat(document.getElementById('swal-rating').value),
                    description: document.getElementById('swal-description').value,
                    image: document.getElementById('swal-image').value || product.image
                };
            }
        }).then((result) => {
            if (result.isConfirmed) {
                product.name = result.value.name;
                product.price = result.value.price;
                product.category = result.value.category;
                product.rating = result.value.rating;
                product.description = result.value.description;
                
                if (result.value.image) {
                    product.image = result.value.image;
                }
                
                try {
                    localStorage.setItem('luxeProducts', JSON.stringify(products));
                    
                    Swal.fire({
                        title: 'Updated!',
                        text: 'Product has been updated.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    
                    renderProducts();
                } catch (e) {
                    if (e.name === 'QuotaExceededError') {
                        Swal.fire({
                            title: 'Storage Full',
                            text: 'Could not update product. Storage is full. Please clear some data.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                }
            }
        });
    }

    // حذف المنتج
    function deleteProduct(id) {
        if (!isAdmin) {
            Swal.fire({
                title: 'Access Denied',
                text: 'You need to be an admin to delete products',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                products = products.filter(p => p.id !== id);
                
                try {
                    localStorage.setItem('luxeProducts', JSON.stringify(products));
                    
                    Swal.fire(
                        'Deleted!',
                        'Product has been deleted.',
                        'success'
                    );
                    
                    renderProducts();
                } catch (e) {
                    if (e.name === 'QuotaExceededError') {
                        Swal.fire({
                            title: 'Error',
                            text: 'Storage is full. Could not save changes after deletion.',
                            icon: 'error',
                            confirmButtonText: 'OK'
                        });
                    }
                }
            }
        });
    }
            document.addEventListener('DOMContentLoaded', function() {
              updateCartCount();
    checkAdminStatus();
    setupImagePreview();
    setupProductForm();
    renderProducts();
    checkStorage();
        })
