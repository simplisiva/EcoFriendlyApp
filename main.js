/********************************************
 * Global State & DOM Elements
 ********************************************/
let currentUser = null; // { username, password, firstName, lastName, gender, topSize, bottomSize, shoeSize }
let cartItems = [];     // Array of { path, quantity }
let historyItems = [];  // Array of image paths
let currentCategory = "women";   // 'women' or 'men'
let currentSubcategory = "tops"; // 'tops' | 'bottoms' | 'shoes'
let imageQueue = [];

// Section references
const createAccount1Section = document.getElementById("create-account-1");
const createAccount2Section = document.getElementById("create-account-2");
const loginPageSection = document.getElementById("login-page");
const userPreferencesSection = document.getElementById("user-preferences");
const mainAppSection = document.getElementById("main-app");
const cartOverlaySection = document.getElementById("cartOverlay");
const historyPageSection = document.getElementById("historyPage");

// Element references
const swipeImage = document.getElementById("swipe-image");
const cartList = document.getElementById("cartList");
const historyList = document.getElementById("historyList");

// Buttons
const createAccountNext1 = document.getElementById("createAccountNext1");
const goToLoginFromCreate = document.getElementById("goToLoginFromCreate");
const createAccountNext2 = document.getElementById("createAccountNext2");
const loginButton = document.getElementById("loginButton");
const goToCreateAccount = document.getElementById("goToCreateAccount");

const genderSelect = document.getElementById("genderSelect");
const womenSizesDiv = document.getElementById("womenSizes");
const menSizesDiv = document.getElementById("menSizes");
const savePreferencesButton = document.getElementById("savePreferences");

const cartButton = document.getElementById("cartButton");
const closeCartBtn = document.getElementById("closeCart");
const historyButton = document.getElementById("historyButton");
const closeHistoryBtn = document.getElementById("closeHistory");

const womenCategoryBtn = document.getElementById("womenCategory");
const menCategoryBtn = document.getElementById("menCategory");
const subcategoryButtons = document.querySelectorAll(".subcategoryBtn");

const swipeLeftBtn = document.getElementById("swipe-left");
const swipeRightBtn = document.getElementById("swipe-right");

/********************************************
 * Utility / Helper Functions
 ********************************************/
function hideAllSections() {
  const sections = [
    createAccount1Section, createAccount2Section, loginPageSection,
    userPreferencesSection, mainAppSection
  ];
  sections.forEach(sec => sec.classList.add("d-none"));
}

function showSection(section) {
  hideAllSections();
  section.classList.remove("d-none");
}

// Manage Overlays
function showCartOverlay() {
  renderCart();
  cartOverlaySection.classList.remove("d-none");
  // Optional custom animation
  cartOverlaySection.classList.add("showOverlay");
}
function hideCartOverlay() {
  cartOverlaySection.classList.add("d-none");
  cartOverlaySection.classList.remove("showOverlay");
}

function showHistoryOverlay() {
  renderHistory();
  historyPageSection.classList.remove("d-none");
  historyPageSection.classList.add("showOverlay");
}
function hideHistoryOverlay() {
  historyPageSection.classList.add("d-none");
  historyPageSection.classList.remove("showOverlay");
}

function saveToLocalStorage() {
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  localStorage.setItem("historyItems", JSON.stringify(historyItems));
}

function loadFromLocalStorage() {
  const savedUser = localStorage.getItem("currentUser");
  const savedCart = localStorage.getItem("cartItems");
  const savedHistory = localStorage.getItem("historyItems");
  if (savedUser) currentUser = JSON.parse(savedUser);
  if (savedCart) cartItems = JSON.parse(savedCart);
  if (savedHistory) historyItems = JSON.parse(savedHistory);
}

// Example image paths per subcategory
function getImagesForSubcategory(category, subcat) {
  const folder = category === "women"
    ? (subcat === "tops" ? "ftop" : subcat === "bottoms" ? "fbot" : "fsho")
    : (subcat === "tops" ? "mtop" : subcat === "bottoms" ? "mbot" : "msho");
  return [
    `images/${folder}/example1.jpeg`,
    `images/${folder}/example2.jpeg`,
    `images/${folder}/example3.jpeg`,
    `images/${folder}/example4.jpeg`,
    `images/${folder}/example5.jpeg`,
    `images/${folder}/example6.jpeg`,
    `images/${folder}/example7.jpeg`,
    `images/${folder}/example8.jpeg`,
    `images/${folder}/example9.jpeg`,
    `images/${folder}/example10.jpeg`
  ];
}

function displayCurrentImage() {
  if (imageQueue.length === 0) {
    swipeImage.src = "";
    swipeImage.alt = "No more items!";
    return;
  }
  swipeImage.src = imageQueue[0];
  swipeImage.alt = `Fashion Item - ${imageQueue[0]}`;
}

// Load a subcategory
function loadSubcategory(subcat) {
  currentSubcategory = subcat;
  imageQueue = getImagesForSubcategory(currentCategory, currentSubcategory);
  displayCurrentImage();
}

// Render the cart
function renderCart() {
  cartList.innerHTML = "";
  cartItems.forEach((item, idx) => {
    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    li.innerHTML = `
      <div>
        <img src="${item.path}" alt="cart-img" style="width:40px; height:auto;" class="me-2" />
        ${item.path}
      </div>
      <div>
        <button class="btn btn-sm btn-outline-secondary minus-btn" data-index="${idx}">-</button>
        <span class="mx-2">${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary plus-btn" data-index="${idx}">+</button>
        <button class="btn btn-sm btn-danger delete-btn" data-index="${idx}">🗑</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  // Event listeners for cart item actions
  cartList.querySelectorAll(".minus-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = btn.getAttribute("data-index");
      if (cartItems[i].quantity > 1) {
        cartItems[i].quantity--;
      }
      saveToLocalStorage();
      renderCart();
    });
  });
  cartList.querySelectorAll(".plus-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = btn.getAttribute("data-index");
      cartItems[i].quantity++;
      saveToLocalStorage();
      renderCart();
    });
  });
  cartList.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = btn.getAttribute("data-index");
      cartItems.splice(i, 1);
      saveToLocalStorage();
      renderCart();
    });
  });
}

// Render the history
function renderHistory() {
  historyList.innerHTML = "";
  historyItems.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerHTML = `<img src="${item}" alt="history-img" style="width:40px; height:auto;" class="me-2" /> ${item}`;
    historyList.appendChild(li);
  });
}

/********************************************
 * Event Handlers
 ********************************************/
// 1. Create Account Flow
createAccountNext1.addEventListener("click", () => {
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  if (!firstName || !lastName) {
    alert("Please enter your first and last names");
    return;
  }
  currentUser = { firstName, lastName };
  showSection(createAccount2Section);
});

goToLoginFromCreate.addEventListener("click", () => {
  showSection(loginPageSection);
});

createAccountNext2.addEventListener("click", () => {
  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }
  currentUser.username = username;
  currentUser.password = password;

  saveToLocalStorage();
  alert("Account created! You can now log in.");
  showSection(loginPageSection);
});

// 2. Login Flow
loginButton.addEventListener("click", () => {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  loadFromLocalStorage();
  if (currentUser && currentUser.username === username && currentUser.password === password) {
    alert(`Welcome back, ${currentUser.firstName}!`);
    showSection(userPreferencesSection);
  } else {
    alert("Invalid username or password!");
  }
});

goToCreateAccount.addEventListener("click", () => {
  showSection(createAccount1Section);
});

// 3. Preferences
genderSelect.addEventListener("change", () => {
  const val = genderSelect.value;
  if (val === "women") {
    womenSizesDiv.classList.remove("d-none");
    menSizesDiv.classList.add("d-none");
  } else {
    womenSizesDiv.classList.add("d-none");
    menSizesDiv.classList.remove("d-none");
  }
});

savePreferencesButton.addEventListener("click", () => {
  const val = genderSelect.value;
  currentUser.gender = val;
  if (val === "women") {
    currentUser.topSize = document.getElementById("womenTopSize").value;
    currentUser.bottomSize = document.getElementById("womenBottomSize").value;
    currentUser.shoeSize = document.getElementById("womenShoeSize").value;
  } else {
    currentUser.topSize = document.getElementById("menTopSize").value;
    currentUser.bottomSize = document.getElementById("menBottomSize").value;
    currentUser.shoeSize = document.getElementById("menShoeSize").value;
  }
  saveToLocalStorage();
  alert("Preferences saved!");
  showSection(mainAppSection);

  // Load default subcategory
  currentCategory = currentUser.gender;
  currentSubcategory = "tops";
  imageQueue = getImagesForSubcategory(currentCategory, currentSubcategory);
  displayCurrentImage();
});

// 4. Main App
cartButton.addEventListener("click", showCartOverlay);
historyButton.addEventListener("click", showHistoryOverlay);
closeCartBtn.addEventListener("click", hideCartOverlay);
closeHistoryBtn.addEventListener("click", hideHistoryOverlay);

// Category Buttons
womenCategoryBtn.addEventListener("click", () => {
  currentCategory = "women";
  loadSubcategory(currentSubcategory);
});
menCategoryBtn.addEventListener("click", () => {
  currentCategory = "men";
  loadSubcategory(currentSubcategory);
});

// Subcategory Buttons
subcategoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const subcat = btn.getAttribute("data-subcategory");
    loadSubcategory(subcat);
  });
});

// Swipe Buttons (fallback for desktop)
swipeLeftBtn.addEventListener("click", swipeLeft);
swipeRightBtn.addEventListener("click", swipeRight);

function swipeLeft() {
  if (imageQueue.length === 0) return;
  const item = imageQueue.shift();
  historyItems.push(item);
  saveToLocalStorage();
  displayCurrentImage();
}

function swipeRight() {
  if (imageQueue.length === 0) return;
  const item = imageQueue.shift();
  cartItems.push({ path: item, quantity: 1 });
  saveToLocalStorage();
  displayCurrentImage();
}

// 5. Hammer.js for Mobile Swipes
// We'll attach a Hammer instance to the "card" or the image container
window.addEventListener("DOMContentLoaded", () => {
  loadFromLocalStorage();

  // If user info is already present, skip to main or preferences
  if (currentUser && currentUser.username && currentUser.password) {
    if (currentUser.gender) {
      showSection(mainAppSection);
      currentCategory = currentUser.gender;
      currentSubcategory = "tops";
      imageQueue = getImagesForSubcategory(currentCategory, currentSubcategory);
      displayCurrentImage();
    } else {
      showSection(userPreferencesSection);
    }
  } else {
    showSection(createAccount1Section);
  }

  // Create Hammer manager for the swipe image container
  const mc = new Hammer(swipeImage);
  mc.get('swipe').set({ direction: Hammer.DIRECTION_HORIZONTAL });

  mc.on("swipeleft", () => {
    // Animate left swipe
    swipeImage.classList.add("swipe-animation");
    swipeImage.style.transform = "translateX(-100px)";
    setTimeout(() => {
      swipeImage.style.transform = "translateX(0)";
      swipeImage.classList.remove("swipe-animation");
      swipeLeft();
    }, 300);
  });

  mc.on("swiperight", () => {
    // Animate right swipe
    swipeImage.classList.add("swipe-animation");
    swipeImage.style.transform = "translateX(100px)";
    setTimeout(() => {
      swipeImage.style.transform = "translateX(0)";
      swipeImage.classList.remove("swipe-animation");
      swipeRight();
    }, 300);
  });
});
