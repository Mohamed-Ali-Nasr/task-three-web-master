const productsContainer = document.getElementById("products-container");
let cart = [];
let products = [];

// Create a function that will render the products to the page
function renderProducts(products) {
  for (let i = 0; i < products.length; i++) {
    productsContainer.innerHTML += `
      <div class="group rounded-xl p-4" style="box-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2),-12px -12px 8px rgba(255, 255, 255, 0.6);">
        <img className="rounded-md" src=${
          products[i].imageCover
        } alt="product-image-${i + 1}" />
        <h3 class="mt-8 text-lg font-medium text-teal-500">
          ${products[i].name.split(" ").slice(0, 3).join(" ")}
        </h3>
        <h4>${products[i].price} EGP</h4>
        <p class="text-gray-500 text-xs mt-2">${products[i].description
          .split(" ")
          .slice(0, 6)
          .join(" ")}
        </p>
        <button onclick="addToCart(${i})"
          class="hover:bg-teal-600 focus:ring-teal-300 group-hover:opacity-100 group-hover:translate-y-0 whitespace-nowrap w-full px-4 py-2 mx-auto font-semibold text-center text-white transition-all duration-500 translate-y-full bg-teal-500 rounded-lg opacity-0 cursor-pointer mt-6"
        >
          Add to Cart
        </button>
      </div>
    `;
  }
}

// Create a function that will fetch the products from the JSON file
async function getAllProducts() {
  try {
    const response = await fetch("./products.json");
    const data = await response.json();

    if (response.ok) {
      renderProducts(data.products);
      products = data.products;
    }
  } catch (error) {
    console.error("Error fetching JSON:", error);
  }
}

// Add an event listener to the DOM to call the getAllProducts function when the page loads
document.addEventListener("DOMContentLoaded", () => {
  getAllProducts();
});

// Check if the cart exists in the local storage
if (localStorage.getItem("cart")) {
  cart = [
    ...new Map(
      JSON.parse(localStorage.getItem("cart")).map((item) => [
        JSON.stringify(item),
        item,
      ])
    ).values(),
  ];
}

function addToCart(i) {
  cart.push(products[i]);
  localStorage.setItem("cart", JSON.stringify(cart));
  notification("Product is added successfully to your Cart", "add");
}

//* notification *//
function notification(title, type) {
  let obj = {};
  obj.progress = 0;
  obj.fadeTime = 1000;
  obj.fadeTicks = 50;
  obj.fadeInterval = 0;
  obj.opacity = 1;
  obj.time = 2;
  obj.ticks = 500;
  obj.element = null;
  obj.progress = null;
  obj.progressPos = 0;
  obj.progressIncrement = 0;

  obj.Show = function () {
    const notifyContainer = document.getElementById("notifications");
    obj.element = document.createElement("div");
    obj.element.className = `notification ${type}`;
    obj.element.innerHTML = `
      <div class="content">
       <h1>${title}</h1>
      </div>

      <div class="progressDiv">
       <div></div>
      </div>
    `;

    notifyContainer.appendChild(obj.element);
    obj.progress = document.querySelector(".progressDiv > div");
    obj.progressIncrement = 100 / obj.ticks;
    obj.StartWait();
  };

  obj.StartWait = function () {
    if (obj.progressPos >= 100) {
      obj.fadeInterval = 1;
      obj.FadeTick();
      return;
    }
    setTimeout(obj.Tick, obj.time);
  };

  obj.Clear = function () {
    obj.opacity = 0;
    obj.progressPos = 100;
    obj.element.remove();
    obj = null;
    return;
  };

  obj.FadeTick = function () {
    obj.opacity = (obj.opacity * 100 - obj.fadeInterval) / 100;
    if (obj.opacity <= 0) {
      obj.element.remove();
      obj = null;
      return;
    }
    obj.element.style.opacity = obj.opacity;
    setTimeout(obj.FadeTick, obj.fadeTime / obj.fadeTicks);
  };

  obj.Tick = function () {
    obj.progressPos += obj.progressIncrement;
    obj.progress.style.width = obj.progressPos + "%";
    obj.StartWait();
  };
  obj.Show();
  return obj;
}
