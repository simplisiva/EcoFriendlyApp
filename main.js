/********************************************
 * Global State & DOM Elements
 ********************************************/
let currentUser = null; // { username, password, firstName, lastName, gender, topSize, bottomSize, shoeSize }
let cartItems = [];     // Array of { path, quantity }
let historyItems = [];  // Array of image paths
let currentCategory = "women";   // 'women' or 'men'
let currentSubcategory = "tops"; // 'tops' | 'bottoms' | 'shoes'
let imageQueue = [];

/********************************************
 * Global State (Add pagination variables)
 ********************************************/
let cartPage = 0;          // current page for cart
const cartPageSize = 5;    // items per cart page

let historyPage = 0;       // current page for history
const historyPageSize = 5; // items per history page

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

const myAccountSection = document.getElementById("my-account");
const accountGenderSelect = document.getElementById("accountGenderSelect");
const accountWomenSizes = document.getElementById("accountWomenSizes");
const accountMenSizes = document.getElementById("accountMenSizes");
const accountWomenTopSize = document.getElementById("accountWomenTopSize");
const accountWomenBottomSize = document.getElementById("accountWomenBottomSize");
const accountWomenShoeSize = document.getElementById("accountWomenShoeSize");
const accountMenTopSize = document.getElementById("accountMenTopSize");
const accountMenBottomSize = document.getElementById("accountMenBottomSize");
const accountMenShoeSize = document.getElementById("accountMenShoeSize");
const updatePreferencesBtn = document.getElementById("updatePreferences");
const goBackToMainBtn = document.getElementById("goBackToMain");
const usernameDisplay = document.getElementById("usernameDisplay");
const accountUsernameDisplay = document.getElementById("accountUsernameDisplay");
const logoutButton = document.getElementById("logoutButton");


/********************************************
 * DOM Elements for Pagination Buttons
 ********************************************/
const cartPrevPageBtn = document.getElementById('cartPrevPage');
const cartNextPageBtn = document.getElementById('cartNextPage');
const historyPrevPageBtn = document.getElementById('historyPrevPage');
const historyNextPageBtn = document.getElementById('historyNextPage');

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

  // Also highlight the subcategory button
  highlightSubcategoryButtons(subcat);
}

// MyAccount related functions
function showMyAccountPage() {
  // Prefill gender
  accountGenderSelect.value = currentUser.gender;

  // Show the correct sizes based on gender
  if (currentUser.gender === "women") {
    accountWomenSizes.classList.remove("d-none");
    accountMenSizes.classList.add("d-none");

    // Prefill sizes
    accountWomenTopSize.value = currentUser.topSize;
    accountWomenBottomSize.value = currentUser.bottomSize;
    accountWomenShoeSize.value = currentUser.shoeSize;
  } else {
    accountWomenSizes.classList.add("d-none");
    accountMenSizes.classList.remove("d-none");

    // Prefill sizes
    accountMenTopSize.value = currentUser.topSize;
    accountMenBottomSize.value = currentUser.bottomSize;
    accountMenShoeSize.value = currentUser.shoeSize;
  }

  // Show the My Account page
  hideAllSections();
  myAccountSection.classList.remove("d-none");
}

function showUsername() {
  if (currentUser && currentUser.username) {
    usernameDisplay.textContent = `Hi, ${currentUser.username}`;
    accountUsernameDisplay.textContent = currentUser.username;
  }
}

/********************************************
 * Render Cart with Pagination
 ********************************************/
function renderCart() {
  cartList.innerHTML = "";

  // 1. Calculate the slice of items for the current page
  const startIndex = cartPage * cartPageSize;
  const endIndex = startIndex + cartPageSize;
  const pageItems = cartItems.slice(startIndex, endIndex);

  // 2. Render only those items
  pageItems.forEach((item, idx) => {
    // idx is the index within pageItems, but we need the absolute index in cartItems
    const actualIndex = startIndex + idx;
    
    const li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    li.innerHTML = `
      <div>
        <img src="${item.path}" alt="cart-img" style="width:40px; height:auto;" class="me-2" />
        ${item.path}
      </div>
      <div>
        <button class="btn btn-sm btn-outline-secondary minus-btn" data-index="${actualIndex}">-</button>
        <span class="mx-2">${item.quantity}</span>
        <button class="btn btn-sm btn-outline-secondary plus-btn" data-index="${actualIndex}">+</button>
        <button class="btn btn-sm btn-danger delete-btn" data-index="${actualIndex}">🗑</button>
      </div>
    `;
    cartList.appendChild(li);
  });

  // 3. Update pagination button states (disable if on first/last page)
  cartPrevPageBtn.disabled = (cartPage === 0);
  cartNextPageBtn.disabled = (endIndex >= cartItems.length);

  // 4. Event listeners for items
  cartList.querySelectorAll(".minus-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.getAttribute("data-index"));
      if (cartItems[i].quantity > 1) {
        cartItems[i].quantity--;
      }
      // If removing a quantity to 0 is also desired, handle it here
      saveToLocalStorage();
      // After changes, re-render
      renderCart();
    });
  });
  cartList.querySelectorAll(".plus-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.getAttribute("data-index"));
      cartItems[i].quantity++;
      saveToLocalStorage();
      renderCart();
    });
  });
  cartList.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.getAttribute("data-index"));
      cartItems.splice(i, 1);
      saveToLocalStorage();

      // If we removed the last item on the current page, we might need to adjust the page
      const maxPage = Math.ceil(cartItems.length / cartPageSize) - 1; 
      if (cartPage > maxPage) {
        cartPage = Math.max(0, maxPage);
      }

      renderCart();
    });
  });
}

/********************************************
 * Render History with Pagination
 ********************************************/
function renderHistory() {
  historyList.innerHTML = "";

  // 1. Calculate the slice of items for the current page
  const startIndex = historyPage * historyPageSize;
  const endIndex = startIndex + historyPageSize;
  const pageItems = historyItems.slice(startIndex, endIndex);

  // 2. Render only those items
  pageItems.forEach(item => {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.innerHTML = `
      <img src="${item}" alt="history-img" style="width:40px; height:auto;" class="me-2" />
      ${item}
    `;
    historyList.appendChild(li);
  });

  // 3. Update pagination button states
  historyPrevPageBtn.disabled = (historyPage === 0);
  historyNextPageBtn.disabled = (endIndex >= historyItems.length);
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
  // Example after user preferences are saved or loaded
  highlightGenderButtons(currentCategory);
  highlightSubcategoryButtons(currentSubcategory);
  imageQueue = getImagesForSubcategory(currentCategory, currentSubcategory);
  displayCurrentImage();
});

// 4. Main App
cartButton.addEventListener("click", showCartOverlay);
historyButton.addEventListener("click", showHistoryOverlay);
closeCartBtn.addEventListener("click", hideCartOverlay);
closeHistoryBtn.addEventListener("click", hideHistoryOverlay);

/********************************************
 * Pagination Button Event Listeners
 ********************************************/
// Cart
cartPrevPageBtn.addEventListener("click", () => {
  if (cartPage > 0) {
    cartPage--;
    renderCart();
  }
});
cartNextPageBtn.addEventListener("click", () => {
  const maxPage = Math.ceil(cartItems.length / cartPageSize) - 1;
  if (cartPage < maxPage) {
    cartPage++;
    renderCart();
  }
});

// History
historyPrevPageBtn.addEventListener("click", () => {
  if (historyPage > 0) {
    historyPage--;
    renderHistory();
  }
});
historyNextPageBtn.addEventListener("click", () => {
  const maxPage = Math.ceil(historyItems.length / historyPageSize) - 1;
  if (historyPage < maxPage) {
    historyPage++;
    renderHistory();
  }
});

// MyAccount event listerners
const myAccountButton = document.getElementById("myAccountButton");
myAccountButton.addEventListener("click", () => {
  showUsername(); // Update the username display
  showMyAccountPage(); // Navigate to the My Account page
});

logoutButton.addEventListener("click", () => {
  // Clear user data
  currentUser = null;
  localStorage.removeItem("currentUser");

  // Clear UI elements
  usernameDisplay.textContent = "";

  // Redirect to login page
  showSection(loginPageSection);
});

// Toggle sizes when gender is changed
accountGenderSelect.addEventListener("change", () => {
  const selectedGender = accountGenderSelect.value;

  if (selectedGender === "women") {
    accountWomenSizes.classList.remove("d-none");
    accountMenSizes.classList.add("d-none");
  } else {
    accountWomenSizes.classList.add("d-none");
    accountMenSizes.classList.remove("d-none");
  }
});

// Update Preferences Button
updatePreferencesBtn.addEventListener("click", () => {
  const selectedGender = accountGenderSelect.value;

  // Update user preferences
  currentUser.gender = selectedGender;

  if (selectedGender === "women") {
    currentUser.topSize = accountWomenTopSize.value;
    currentUser.bottomSize = accountWomenBottomSize.value;
    currentUser.shoeSize = accountWomenShoeSize.value;
  } else {
    currentUser.topSize = accountMenTopSize.value;
    currentUser.bottomSize = accountMenBottomSize.value;
    currentUser.shoeSize = accountMenShoeSize.value;
  }

  // Save updated preferences to localStorage
  saveToLocalStorage();

  alert("Preferences updated successfully!");

  // Navigate back to main app
  showSection(mainAppSection);
});

// Go Back to Main Button
goBackToMainBtn.addEventListener("click", () => {
  showSection(mainAppSection);
});

/********************************************
 * Highlight Functions
 ********************************************/
function highlightGenderButtons(selectedGender) {
  womenCategoryBtn.classList.remove('active');
  menCategoryBtn.classList.remove('active');
  if (selectedGender === 'women') {
    womenCategoryBtn.classList.add('active');
  } else {
    menCategoryBtn.classList.add('active');
  }
}

function highlightSubcategoryButtons(selectedSubcategory) {
  subcategoryButtons.forEach((btn) => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-subcategory') === selectedSubcategory) {
      btn.classList.add('active');
    }
  });
}


// Category Buttons
womenCategoryBtn.addEventListener("click", () => {
  currentCategory = "women";
  loadSubcategory(currentSubcategory);
  // Highlight the currently selected gender
  highlightGenderButtons('women');
});
menCategoryBtn.addEventListener("click", () => {
  currentCategory = "men";
  loadSubcategory(currentSubcategory);
  // Highlight the currently selected gender
  highlightGenderButtons('men');
});

// Subcategory Buttons
subcategoryButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const subcat = btn.getAttribute("data-subcategory");
    loadSubcategory(subcat);
    // Highlight the currently selected subcategory
    highlightSubcategoryButtons(subcat);
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
