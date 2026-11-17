const CART_KEY = "ecomstore-cart";
const PRODUCTS_KEY = "ecomstore-products";
const ORDER_KEY = "ecomstore-orders";
const CHECKOUT_DRAFT_KEY = "ecomstore-checkout-draft";
const formatMoney = value => `₹${Number(value).toLocaleString("en-IN")}`;

function readJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch (error) { console.error(`Unable to read ${key}:`, error); return fallback; }
}

const products = readJSON(PRODUCTS_KEY, []);
const savedCart = readJSON(CART_KEY, []);
const cart = Array.isArray(savedCart) ? savedCart.map(item => {
    const product = products.find(entry => String(entry.id) === String(item.id)) || item;
    const quantity = Number(item.quantity);
    return product && Number.isInteger(quantity) && quantity > 0 ? { ...product, quantity } : null;
}).filter(Boolean) : [];
let couponApplied = false;
const checkoutForm = document.getElementById("checkoutForm");
const savedDraft = readJSON(CHECKOUT_DRAFT_KEY, {});
if (savedDraft && typeof savedDraft === "object") {
    for (const [key, value] of Object.entries(savedDraft)) {
        const field = checkoutForm.elements.namedItem(key);
        if (field && field.type !== "radio" && typeof value === "string") field.value = value;
        if (field && field.type === "radio") {
            const option = checkoutForm.querySelector(`input[name="${key}"][value="${CSS.escape(value)}"]`);
            if (option) option.checked = true;
        }
    }
    document.getElementById("couponInput").value = savedDraft.couponCode || "";
    couponApplied = savedDraft.couponApplied === true;
}

function saveDraft() {
    const data = Object.fromEntries([...new FormData(checkoutForm).entries()].filter(([key]) => !["cardName", "cardNumber", "cardExpiry", "cardCvv"].includes(key)));
    data.couponCode = document.getElementById("couponInput").value;
    data.couponApplied = couponApplied;
    try { localStorage.setItem(CHECKOUT_DRAFT_KEY, JSON.stringify(data)); }
    catch (error) { console.error("Unable to save checkout details:", error); }
}
checkoutForm.addEventListener("input", saveDraft);
checkoutForm.addEventListener("change", saveDraft);
document.getElementById("couponInput").addEventListener("input", saveDraft);

const demoPaymentFields = document.getElementById("demoPaymentFields");
const cardFields = ["cardName", "cardNumber", "cardExpiry", "cardCvv"].map(name => checkoutForm.elements.namedItem(name));
function syncPaymentFields() {
    const isOnline = checkoutForm.elements.namedItem("payment").value === "UPI / online payment";
    demoPaymentFields.hidden = !isOnline;
    cardFields.forEach(field => { field.required = isOnline; });
}
checkoutForm.querySelectorAll('input[name="payment"]').forEach(input => input.addEventListener("change", syncPaymentFields));
syncPaymentFields();

const itemContainer = document.getElementById("checkoutItems");
const emptyMessage = document.getElementById("emptyCheckout");

function subtotalAmount() { return cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0); }
function renderSummary() {
    itemContainer.innerHTML = "";
    cart.forEach(item => {
        const row = document.createElement("div");
        row.className = "checkout-summary-row";
        const name = document.createElement("span");
        name.textContent = `${item.name} × ${item.quantity}`;
        const price = document.createElement("strong");
        price.textContent = formatMoney(Number(item.price) * item.quantity);
        row.append(name, price);
        itemContainer.appendChild(row);
    });
    const subtotal = subtotalAmount();
    const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
    document.getElementById("subtotal").textContent = formatMoney(subtotal);
    document.getElementById("discount").textContent = discount ? `−${formatMoney(discount)}` : formatMoney(0);
    document.getElementById("total").textContent = formatMoney(subtotal - discount);
    emptyMessage.textContent = cart.length ? "" : "Your cart is empty. Add products before checkout.";
    document.querySelector(".place-order-button").disabled = cart.length === 0;
}

document.getElementById("applyCoupon").addEventListener("click", () => {
    const message = document.getElementById("couponMessage");
    if (document.getElementById("couponInput").value.trim().toUpperCase() === "SAVE10") {
        couponApplied = true;
        message.textContent = "SAVE10 applied: 10% off your order.";
    } else {
        couponApplied = false;
        message.textContent = "That coupon code is not valid. Try SAVE10.";
    }
    renderSummary();
    saveDraft();
});

checkoutForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!cart.length || !event.currentTarget.reportValidity()) return;
    const formData = new FormData(event.currentTarget);
    const subtotal = subtotalAmount();
    const discount = couponApplied ? Math.round(subtotal * 0.1) : 0;
    const orders = readJSON(ORDER_KEY, []);
    const order = {
        id: `EC${Date.now()}`,
        createdAt: new Date().toISOString(),
        customer: Object.fromEntries(["name", "email", "phone", "address", "cityPin"].map(key => [key, formData.get(key)])),
        payment: formData.get("payment"),
        coupon: couponApplied ? "SAVE10" : "",
        items: cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity })),
        subtotal, discount, total: subtotal - discount
    };
    try {
        localStorage.setItem(ORDER_KEY, JSON.stringify([...orders, order]));
        localStorage.removeItem(CART_KEY);
        localStorage.removeItem(CHECKOUT_DRAFT_KEY);
        document.getElementById("successOrderId").textContent = order.id;
        const successModal = document.getElementById("orderSuccessModal");
        successModal.hidden = false;
        document.getElementById("successContinue").focus();
        event.currentTarget.reset();
        syncPaymentFields();
        cart.length = 0;
        renderSummary();
    } catch (error) {
        console.error("Unable to save order:", error);
        document.getElementById("orderMessage").textContent = "Could not save your order in this browser. Please try again.";
    }
});

renderSummary();

document.getElementById("successContinue").addEventListener("click", () => { window.location.href = "index.html"; });
