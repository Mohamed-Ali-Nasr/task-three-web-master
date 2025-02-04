const firstLetter = document.getElementById("first-letter");
const profileButton = document.getElementById("profile-button");

// Get the username from local storage
const username = localStorage.getItem("username");
if (username) {
  firstLetter.textContent = username.charAt(0).toUpperCase();
}

// Toggle profile menu
profileButton.addEventListener("click", function () {
  document.getElementById("profile-menu").classList.toggle("hidden");

  document.getElementById(
    "username"
  ).innerHTML = `logged in as <p class="font-semibold text-teal-500">${username}</p>`;
});

// Logout button
document.getElementById("logout-button").addEventListener("click", function () {
  // Clear Local Storage or any other storage mechanism used
  localStorage.removeItem("username");
  localStorage.removeItem("cart");
  localStorage.removeItem("cart-data");
  localStorage.removeItem("total-price");
  // Redirect to login page or another action
  location.replace("/index.html");
});

// Check if user is logged in, otherwise redirect to login page
const savedUsername = localStorage.getItem("username");
if (!savedUsername) {
  location.replace("/index.html");
}
