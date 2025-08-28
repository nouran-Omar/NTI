
if (typeof AOS !== 'undefined') {
    AOS.init();
}
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

function renderCartItems() {
    const cartContainer = document.getElementById('cart-items');
    const summaryContainer = document.getElementById('cart-total-container');
    
    if (!cartContainer) {
        console.error('Cart container not found');
        return;
    }
    const cart = window.getCart ? window.getCart() : [];
    
    console.log('Rendering cart items:', cart);
    
    cartContainer.innerHTML = ''; 

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart-message">
                <i class="fas fa-box-open fa-3x mb-3 text-muted"></i>
                <p>Your cart is empty.</p>
                <a href="products.html" class="btn btn-luxury mt-3">Start Shopping</a>
            </div>
        `;
        if (summaryContainer) summaryContainer.classList.add('d-none');
    } else {
        if (summaryContainer) summaryContainer.classList.remove('d-none');

        cart.forEach(item => {
            let imageUrl = item.image;
            if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
                if (!imageUrl.includes('/')) {
                    imageUrl = `${imageUrl}`;
                }
            }
            
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            
            itemElement.innerHTML = `
                <div class="cart-item-content">
                    <div class="cart-item-row">
                        <div class="item-info">
                            <img src="${imageUrl}" alt="${item.name}" class="item-image me-4">
                            <div class="item-details">
                                <h5 class="fw-bold mb-1">${item.name}</h5>
                                <p class="mb-0">Price: ${parseFloat(item.price).toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="cart-item-row mt-3">
                        <div class="item-controls">
                            <div class="quantity-control">
                                <button class="btn btn-sm btn-minus" data-id="${item.id}">-</button>
                                <input type="text" value="${item.quantity}" readonly>
                                <button class="btn btn-sm btn-plus" data-id="${item.id}">+</button>
                            </div>
                            <div class="item-price">${(item.price * item.quantity).toFixed(2)}</div>
                            <button class="remove-btn" data-id="${item.id}">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
            cartContainer.appendChild(itemElement);
        });
    }
    
    updateSummary();
    if (window.updateCartCount) {
        window.updateCartCount();
    }
}
function handleCartAction(e) {
    const target = e.target;
    const itemId = target.closest('[data-id]')?.getAttribute('data-id');
    if (!itemId) return;

    let cart = window.getCart ? window.getCart() : [];
    const itemIndex = cart.findIndex(item => item.id === itemId);

    if (itemIndex > -1) {
        if (target.closest('.btn-plus')) {
            cart[itemIndex].quantity++;
            showToast('Quantity increased');
        } else if (target.closest('.btn-minus')) {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity--;
                showToast('Quantity decreased');
            }
        } else if (target.closest('.remove-btn')) {
            const itemName = cart[itemIndex].name;
            cart.splice(itemIndex, 1);
            showToast(`${itemName} removed from cart`);
        }

        if (window.saveCart) {
            window.saveCart(cart);
        }

        renderCartItems();
    }
}

function updateSummary() {
    const cart = window.getCart ? window.getCart() : [];
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total-price');
    
    if (subtotalElement && taxElement && shippingElement && totalElement) {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tax = subtotal * 0.1; 
        const shipping = subtotal > 100 ? 0 : 15; 
        const total = subtotal + tax + shipping;
        
        subtotalElement.textContent = `${subtotal.toFixed(2)}`;
        taxElement.textContent = `${tax.toFixed(2)}`;
        shippingElement.textContent = `${shipping.toFixed(2)}`;
        totalElement.textContent = `${total.toFixed(2)}`;
    }
}
function handleClearCart() {
    if (window.handleClearCart) {
        window.handleClearCart();
    } else {
        if (confirm('Are you sure you want to clear your cart?')) {
            if (window.saveCart) {
                window.saveCart([]);
            }
            renderCartItems();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Cart page loaded');
    renderCartItems();
    const cartItemsContainer = document.getElementById('cart-items');
    if (cartItemsContainer) {
        cartItemsContainer.addEventListener('click', handleCartAction);
    }
    const clearCartBtn = document.getElementById('clear-cart-btn');
    if (clearCartBtn) {
        clearCartBtn.addEventListener('click', handleClearCart);
    }
    console.log('Cart page initialization complete');
});