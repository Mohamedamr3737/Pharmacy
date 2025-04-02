// main page  js
// navbar toggling
const navbarShowBtn = document.querySelector('.navbar-show-btn');
const navbarCollapseDiv = document.querySelector('.navbar-collapse');
const navbarHideBtn = document.querySelector('.navbar-hide-btn');

navbarShowBtn.addEventListener('click', function(){
    navbarCollapseDiv.classList.add('navbar-show');
});
navbarHideBtn.addEventListener('click', function(){
    navbarCollapseDiv.classList.remove('navbar-show');
});

// changing search icon image on window resize
window.addEventListener('resize', changeSearchIcon);
function changeSearchIcon(){
    let winSize = window.matchMedia("(min-width: 1200px)");
    if(winSize.matches){
        document.querySelector('.search-icon img').src = "../assets/images/search-icon.png";
    } else {
        document.querySelector('.search-icon img').src = "../assets//images/search-icon-dark.png";
    }
}
changeSearchIcon();

// stopping all animation and transition
let resizeTimer;
window.addEventListener('resize', () =>{
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 400);
});



// Select all sections and navbar links
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
    let currentSection = "";

    sections.forEach((section) => {
        const sectionTop = section.offsetTop - 100; // Adjust based on navbar height
        const sectionHeight = section.clientHeight;

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach((link) => {
        link.classList.remove("active"); // Remove 'active' from all links
        if (link.getAttribute("href") === `#£{currentSection}`) {
            link.classList.add("active"); // Add 'active' to the current section link
        }
    });
});


// cart page js

document.addEventListener("DOMContentLoaded", loadCart);

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let cartItemsContainer = document.getElementById("cart-items");
    let cartTotal = document.getElementById("cart-total");
    let cartCount = document.getElementById("cart-count");

    cartItemsContainer.innerHTML = "";
    let totalPrice = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {
        let total = item.price * item.quantity;
        totalPrice += total;
        totalItems += item.quantity;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td><input type="number" value="${item.quantity}" min="1" data-index="${index}" class="quantity-input"></td>
            <td>£${item.price.toFixed(2)}</td>
            <td>£${total.toFixed(2)}</td>
            <td><button class="remove-btn" data-index="${index}">Remove</button></td>
        `;
        cartItemsContainer.appendChild(row);
    });

    cartTotal.textContent = totalPrice.toFixed(2);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    document.querySelectorAll(".quantity-input").forEach(input => {
        input.addEventListener("change", updateQuantity);
    });

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", removeItem);
    });
}

function updateQuantity(event) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let index = parseInt(event.target.getAttribute("data-index")); // Convert to integer
    cart[index].quantity = parseInt(event.target.value);
    localStorage.setItem("cart", JSON.stringify(cart));
    loadCart();
}

function removeItem(event) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let index = parseInt(event.target.getAttribute("data-index")); // Convert to integer

    console.log("Removing item at index:", index); // Debugging

    if (index >= 0 && index < cart.length) {
        cart.splice(index, 1); // Remove item
        localStorage.setItem("cart", JSON.stringify(cart));
        loadCart(); // Reload cart
    } else {
        console.log("Invalid index:", index);
    }
}
