// Step 1: Connect HTML Elements

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const cartButton = document.getElementById("cartBtn");
const cartCount = document.getElementById("cartCount");
const categoryFilters = document.getElementById("category-Filters");
const productGrid = document.getElementById("productGrid");
const sortSelect = document.getElementById("sortSelect");


// Product modal ke liye JavaScript

const productModal = document.getElementById("productModal");
const productDetails = document.getElementById("productDetails");
const closeModal = document.getElementById("closeModal");


// Step 2: Initial Project Data

const DEFAULT_PRODUCTS = [
    { id: 1, name: "Wireless Headphones", price: 1299, Categories: "electronics", rating: 4.5, image: "https://m.media-amazon.com/images/I/31818K7ii3L._SY300_SX300_QL70_FMwebp_.jpg" },
    { id: 2, name: "Bluetooth Speaker", price: 899, Categories: "electronics", rating: 4.2, image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400" },
    { id: 3, name: "Smart Watch", price: 1599, Categories: "electronics", rating: 4.3, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400" },
    { id: 4, name: "Smartphone", price: 12999, Categories: "electronics", rating: 4.6, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400" },
    { id: 5, name: "Running Shoes", price: 1999, Categories: "fashion", rating: 4.4, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400" },
    { id: 6, name: "Classic Sunglasses", price: 699, Categories: "fashion", rating: 4.1, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400" },
    { id: 7, name: "Laptop", price: 45999, Categories: "computer accessories", rating: 4.7, image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400" },
    { id: 8, name: "Wireless Mouse", price: 499, Categories: "computer accessories", rating: 4.3, image: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400" },
    { id: 9, name: "Table Lamp", price: 799, Categories: "home & living", rating: 4.2, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400" },
    { id: 10, name: "Coffee Mug", price: 299, Categories: "home & living", rating: 4.0, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400" }
];

const PRODUCTS_STORAGE_KEY = "ecomstore-products";
function loadProducts() {
    try {
        const savedProducts = JSON.parse(localStorage.getItem(PRODUCTS_STORAGE_KEY));
        return Array.isArray(savedProducts) && savedProducts.length ? savedProducts : DEFAULT_PRODUCTS;
    } catch (error) {
        console.error("Unable to load saved products:", error);
        return DEFAULT_PRODUCTS;
    }
}
const products = loadProducts();
try {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
} catch (error) {
    console.error("Unable to save products:", error);
}


// Step 3: Cart Data

const CART_STORAGE_KEY = "ecomstore-cart";

function loadCart() {
    try {
        const savedCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY));

        if (!Array.isArray(savedCart)) return [];

        return savedCart
            .map(savedItem => {
                const product = products.find(item => String(item.id) === String(savedItem.id));
                const quantity = Number(savedItem.quantity);

                if (!product || !Number.isInteger(quantity) || quantity < 1) return null;

                return { ...product, quantity };
            })
            .filter(Boolean);
    } catch (error) {
        console.error("Unable to load the saved cart:", error);
        return [];
    }
}

function saveCart() {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
        console.error("Unable to save the cart:", error);
    }
}

const cart = loadCart();


// Step 4: Helper Function To Escape HTML

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}


// Step 5: Render Products

function renderProducts(productList) {

    if (productList.length === 0) {
        productGrid.innerHTML = `
            <div class="empty-message">
                <h3>No products found</h3>
                <p>Please check back later.</p>
            </div>
        `;
        return;
    }

    let productsHTML = "";

    productList.forEach(product => {
        productsHTML += `
            <article class="product-card">
                <div class="product-image">
                    <img
                        src="${escapeHTML(product.image)}"
                        alt="${escapeHTML(product.name)}"
                        loading="lazy"
                    >
                    <span class="product-rating">
                        ${Number(product.rating).toFixed(1)}
                    </span>
                </div>

                <div>
                    <p class="products-category">
                        ${escapeHTML(product.Categories)}
                    </p>

                    <h3 class="product-name">
                        ${escapeHTML(product.name)}
                    </h3>

                    <div class="product-bottom">
                        <span class="product-price">
                            ₹${Number(product.price).toLocaleString("en-IN")}
                        </span>

                        <button
                        class="veiw-details-btn"
                        type="button"
                        data-product-id="${Number(product.id)}"
                        >
                        View
                        Details
                        </button>

                        <button
                            class="add-to-cart-btn"
                            type="button"
                            data-product-id="${Number(product.id)}"
                        >
                            Add To Cart
                        </button>
                    </div>
                </div>
            </article>
        `;
    });

    productGrid.innerHTML = productsHTML;
}


// Step 6: Check HTML Connections

console.log("EcomStore connected");
console.log("Search Input:", searchInput);
console.log("Category Filters:", categoryFilters);
console.log("Product Grid:", productGrid);
console.log("Sort Select:", sortSelect);
console.log("Products:", products);
console.log("Cart:", cart);


// Step 7: Display Products

renderProducts(products);


// Step 8: Search Function

function SearchProduct() {

    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm);
    });

    renderProducts(filteredProducts);

    console.log("Search term:", searchTerm);
    console.log("Matching Products:", filteredProducts.length);
}


// Apply Filters

let selectedCategory = "all";

function applyFilters() {

    const searchTerm = searchInput.value.toLowerCase().trim();

    let filteredProducts = products.filter(product => {
        return product.name.toLowerCase().includes(searchTerm);
    });

    // Category Filters

    if (selectedCategory !== "all") {
        filteredProducts = filteredProducts.filter(product => {
            return product.Categories === selectedCategory.toLowerCase();
        });
    }

    // Sorting

    const sortValue = sortSelect.value;

    if (sortValue === "price-low") {
        filteredProducts.sort((a, b) => a.price - b.price);

    } else if (sortValue === "price-high") {
        filteredProducts.sort((a, b) => b.price - a.price);

    } else if (sortValue === "rating") {
        filteredProducts.sort((a, b) => b.rating - a.rating);
    }

    // Update Webpage

    renderProducts(filteredProducts);

    // Console Output

    console.log("Category:", selectedCategory);
    console.log("Search:", searchTerm);
    console.log("Sort:", sortValue);
    console.log("Matching Products:", filteredProducts.length);
}


// Search Button Click

searchBtn.addEventListener("click", applyFilters);


// Search While Typing

searchInput.addEventListener("input", applyFilters);


// Press Enter

searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        applyFilters();
    }
});


// Category Button

categoryFilters.addEventListener("click", function(event) {

    const button = event.target.closest("button[data-category]");

    if (!button) return;

    selectedCategory = button.dataset.category.toLowerCase();

    categoryFilters.querySelectorAll(".category-button").forEach(categoryButton => {
        categoryButton.classList.toggle("active", categoryButton === button);
    });

    applyFilters();
});


// Sorting

sortSelect.addEventListener("change", applyFilters);


// Product Modal Ka Function

function openProductModal(productId) {

    const product = products.find(
    item => String(item.id) === String(productId)
);

    if (!product) {
        console.log("Product Not Found", productId);
        return;
    }

    productDetails.innerHTML = `
    
    <img
        class="modal-product-image"
        src="${escapeHTML(product.image)}"
        alt="${escapeHTML(product.name)}"
    >

    <h2 class="modal-product-name">
        ${escapeHTML(product.name)}
    </h2>

    <p>
        Category: ${escapeHTML(product.Categories)}
    </p>

    <p>
        Rating: ${Number(product.rating).toFixed(1)}
    </p>

    <p class="Modal-product-description">
        ${escapeHTML(product.name || "Discover product at EcomStore")}
    </p>

    <p class="modal-product-price">
        ₹${Number(product.price).toLocaleString("en-IN")}
    </p>

    `;

    productModal.classList.remove("hidden");

    console.log("selected product:", product);
}


// Handle click for view details button

productGrid.addEventListener("click", function(event) {

    const button = event.target.closest(".veiw-details-btn");

    if (!button) return;

    const productId = button.dataset.productId;

    openProductModal(productId);
});


// Close Modal ussing X button

closeModal.addEventListener("click", function() {
    productModal.classList.add("hidden");
});


// Close Modal when Clicking outside the content

productModal.addEventListener("click", function(event) {

    if (event.target === productModal) {
        productModal.classList.add("hidden");
    }

});


// close modal with escape key

document.addEventListener("keydown", function(event) {
    if(event.key === "Escape"){
        productModal.classList.add("hidden")
        cartModal.classList.add("hidden")
    }
})





const cartModal = document.getElementById("cartModal")
const closeCart = document.getElementById("closeCart")
const cartItemsContainer = document.getElementById("cartItems")
const cartTotal = document.getElementById("cartTotal")
const clearCartButton = document.getElementById("clearCart")



// cart data

// const cart = []

// Add product to cart


function addTocart(productId){
    const product = products.find(item => {
       return String(item.id) === String(productId)
    })

    if(!product) return

    const existingItem = cart.find(item => {
    return String(item.id) === String(productId);
});

    if(existingItem){
        existingItem.quantity++
    }else {
        cart.push({
            ...product,
            quantity: 1
        })
    }

    updateCart()
    showCartToast(`${product.name} was added to your cart successfully.`);
}

let toastTimeout;
function showCartToast(message) {
    const toast = document.getElementById("cartToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => toast.classList.remove("visible"), 2800);
}

// update cart



function updateCart(){
    saveCart();

    const totalItems = cart.reduce(
    (total,item) => total + item.quantity,
    0
    )

    cartCount.textContent = totalItems

    cartItemsContainer.innerHTML = ""

    if(cart.length === 0){
        cartItemsContainer.textContent = "Your Cart Is Empty"
    }

    let totalPrice = 0

    cart.forEach(item => {
        totalPrice += item.price * item.quantity

        const cartItem = document.createElement("div")
        cartItem.className = "cart-item"

        const productName = document.createElement("p");
productName.textContent = item.name;

const price = document.createElement("p");
price.textContent = `Rs. ${item.price.toLocaleString("en-IN")} x ${item.quantity}`;

const decreaseBtn = document.createElement("button");
decreaseBtn.textContent = "-"
decreaseBtn.dataset.action = "decrease"
decreaseBtn.dataset.productId = item.id

const quantity = document.createElement("span");
quantity.textContent = String(item.quantity)

const increaseBtn = document.createElement("button");
increaseBtn.textContent = "+"
increaseBtn.dataset.action = "increase"
increaseBtn.dataset.productId = item.id

const removeBtn = document.createElement("button");
removeBtn.textContent = "Remove"
removeBtn.dataset.action = "remove"
removeBtn.dataset.productId = item.id

const controls = document.createElement("div");
controls.className = "cart-item-controls";
controls.append(decreaseBtn, quantity, increaseBtn, removeBtn);

cartItem.append(
    productName,
    price,
    controls
);

        cartItemsContainer.appendChild(cartItem)
    })

    cartTotal.textContent =
    `Total: ₹${totalPrice.toLocaleString("en-IN")}`
}



// listen for add to cart


productGrid.addEventListener("click", function(event){
    const button = event.target.closest(".add-to-cart-btn")

    if(!button) return
   addTocart(button.dataset.productId);
})


// open cart

cartButton.addEventListener("click", function(event){
    cartModal.classList.remove("hidden")
    updateCart()
})

// close cart

closeCart.addEventListener("click", function(){
    cartModal.classList.add("hidden")
})

cartModal.addEventListener("click", function(event){
    if (event.target === cartModal) {
        cartModal.classList.add("hidden")
    }
})

// increase, decrease, remove cart item

cartItemsContainer.addEventListener("click", function(event){
    const button = event.target.closest("button[data-action]")

    if(!button) return

    const productId = button.dataset.productId
    const action = button.dataset.action

    const itemIndex = cart.findIndex(item => String(item.id) === String(productId)
)

    if(itemIndex === -1) return

    if(action === "increase"){
    cart[itemIndex].quantity++
}

if(action === "decrease"){
    cart[itemIndex].quantity--

    if(cart[itemIndex].quantity <= 0){
        cart.splice(itemIndex, 1)
    }
}

if(action === "remove"){
    cart.splice(itemIndex, 1)
}

updateCart()
})



// clear complete cart

clearCartButton.addEventListener("click", function(){
    cart.length = 0
    updateCart()
})

// intial cart display

updateCart()
