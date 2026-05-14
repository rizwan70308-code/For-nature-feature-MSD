let cartCount = 0;
let cartItems = [];

// Function to add item to cart
function addToCart(productName, productPrice, productImage = '') {
    const existingItem = cartItems.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cartItems.push({
            name: productName,
            price: productPrice,
            image: productImage || 'image/default-product.png',
            quantity: 1
        });
    }

    recalculateCartCount();
    alert(productName + " has been added to your cart for ₹" + productPrice);
}

// Recalculate cart count from items
function recalculateCartCount() {
    cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    updateCartCount();
    saveCartToStorage();
}

// Update cart count display
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('#cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
}

// Save cart to browser storage
function saveCartToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartCount', cartCount.toString());
}

// Load cart from browser storage
function loadCartFromStorage() {
    const storedItems = localStorage.getItem('cartItems');

    if (storedItems) {
        cartItems = JSON.parse(storedItems);
    }

    recalculateCartCount();
}

// Load cart items on cart page
function loadCartItems() {
    loadCartFromStorage();
    
    const cartItemsContainer = document.getElementById('cart-items');
    if (!cartItemsContainer) return;
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        updateCartSummary();
        return;
    }
    
    let itemsHTML = '';
    let subtotal = 0;
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        itemsHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p>₹${item.price} x ${item.quantity}</p>
                    <p class="item-total">₹${itemTotal}</p>
                </div>
                <div class="item-actions">
                    <button onclick="changeQuantity('${item.name}', -1)">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="changeQuantity('${item.name}', 1)">+</button>
                    <button class="remove-btn" onclick="removeItem('${item.name}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = itemsHTML;
    updateCartSummary(subtotal);
}

// Update cart summary
function updateCartSummary(subtotal = 0) {
    const delivery = subtotal > 0 ? 40 : 0; // ₹40 delivery charge
    const total = subtotal + delivery;
    
    if (document.getElementById('subtotal')) {
        document.getElementById('subtotal').textContent = `₹${subtotal}`;
        document.getElementById('delivery').textContent = `₹${delivery}`;
        document.getElementById('total').textContent = `₹${total}`;
    }

    localStorage.setItem('cartTotal', total.toString());  // <-- Yeh line add karo
}


// Change item quantity
function changeQuantity(productName, change) {
    const item = cartItems.find(item => item.name === productName);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeItem(productName);
    } else {
        recalculateCartCount();
        loadCartItems();
    }
}

// Remove item from cart
function removeItem(productName) {
    const itemIndex = cartItems.findIndex(item => item.name === productName);
    if (itemIndex === -1) return;

    cartItems.splice(itemIndex, 1);

    recalculateCartCount();
    loadCartItems();
}

// Proceed to checkout
function proceedToCheckout() {
    if (cartItems.length === 0) {
        alert('Your cart is empty. Please add items to proceed.');
        return;
    }
    
    window.location.href = 'checkout.html';
}

// Banner functionality
let bannerIndex = 0;

function moveBanner(direction) {
    const slides = document.querySelector('.banner-slides');
    const banners = document.querySelectorAll('.banner-image');
    
    bannerIndex = (bannerIndex + direction + banners.length) % banners.length;
    slides.style.transform = `translateX(-${bannerIndex * 100}%)`;
}

// Initialize cart when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCartFromStorage();
    updateCartCount();

    if (document.getElementById('cart-items')) {
        loadCartItems();
    }
});


//  Account Button  //
// Open popup
document.getElementById("account-btn").addEventListener("click", function (e) {
    e.preventDefault();
    document.getElementById("login-popup").style.display = "flex";
});

// Close popup on background click
window.addEventListener("click", function (e) {
    const popup = document.getElementById("login-popup");
    const box = document.getElementById("login-box");
    if (e.target === popup) {
        popup.style.display = "none";
        resetLoginSteps();
    }
});

function closeLoginPopup() {
    document.getElementById("login-popup").style.display = "none";
    resetLoginSteps();
}

function resetLoginSteps() {
    document.getElementById("step-1").style.display = "block";
    document.getElementById("step-2").style.display = "none";
    document.getElementById("mobile").value = "";
    document.getElementById("otp").value = "";
}

function requestOTP() {
    const mobile = document.getElementById("mobile").value;
    if (/^\d{10}$/.test(mobile)) {
        localStorage.setItem("userMobile", mobile); // Save to localStorage
        alert("OTP sent to: " + mobile + "\n(Use 123456 as test OTP)");
        document.getElementById("step-1").style.display = "none";
        document.getElementById("step-2").style.display = "block";
    } else {
        alert("Please enter a valid 10-digit mobile number.");
    }
}

function verifyOTP() {
    const otp = document.getElementById("otp").value;
    if (otp === "123456") {  // Dummy OTP check
        alert("Login Successful! Mobile saved.");
        closeLoginPopup();
    } else {
        alert("Invalid OTP. Try 123456 as a test.");
    }
}







