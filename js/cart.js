const cartContainer = document.getElementById("cart-container");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (!cart.length) {
  emptyCart();
} else {
  // Remove duplicates from cart
  cart = [
    ...new Map(cart.map((item) => [JSON.stringify(item), item])).values(),
  ];
  const totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  // Render cart summary
  document.getElementById("cart-items").innerHTML = `
    <div class="sm:flex-row border-b-gray-300 sm:border-none flex flex-col items-center justify-between gap-8 pb-4 mb-4 text-2xl text-gray-500 border-b">
      <h3>Total Price: <span id="total-price" class="font-bold text-teal-500">${totalPrice} EGP</span></h3>
      <h3>Total Number: <span class="font-semibold text-teal-500">${cart.length}</span></h3>
    </div>
  `;

  // Render cart items
  cartContainer.innerHTML += cart
    .map(
      (product, i) => `
    <div style="box-shadow: 12px 12px 26px rgba(0,0,0,0.2),-12px -12px 26px rgba(255,255,255,0.6)" class="rounded-xl p-4 my-4">
      <div class="sm:flex-row flex flex-col items-center justify-between gap-8">
        <div class="flex items-center">
          <img class="w-28 mr-3" src="${product.imageCover}" alt="${
        product.name
      }"/>
          <div>
            <h3 class="mb-2 text-lg font-medium text-gray-500">${product.name
              .split(" ")
              .slice(0, 3)
              .join(" ")}</h3>
            <h4 class="mb-2 font-bold text-teal-500">${product.price} EGP</h4>
            <div class="flex cursor-pointer">
              <i class="fa-solid fa-trash text-[20px] text-1xl text-red-600 relative top-[2px] mr-1"></i>
              <button onclick="removeFromCart(${i})" class="text-red-600 cursor-pointer">Remove</button>
            </div>
          </div>
        </div>
        <div class="flex items-center item-quantity" data-id="${
          product.id
        }" data-price="${product.price}">
          <div class="flex items-center gap-2">
            <button class="sm:text-base hover:bg-teal-500 hover:text-white focus:ring-teal-300 px-4 py-2 text-sm text-gray-500 bg-transparent border-2 border-teal-500 rounded-lg cursor-pointer increase">+</button>
            <span class="mx-4 text-lg font-medium quantity">1</span>
            <button class="sm:text-base hover:bg-teal-500 focus:ring-teal-300 hover:text-white px-4 py-2 text-sm text-gray-500 bg-transparent border-2 border-teal-500 rounded-lg cursor-pointer decrease">-</button>
          </div>
        </div>
      </div>
    </div>
  `
    )
    .join("");

  // Handle cart functionality
  const updateTotalPrice = (change) => {
    let totalPrice =
      JSON.parse(localStorage.getItem("total-price")) ||
      cart.reduce((acc, item) => acc + item.price, 0);
    totalPrice += change;
    document.getElementById("total-price").textContent = totalPrice;
    localStorage.setItem("total-price", JSON.stringify(totalPrice));
  };

  const saveCartData = () => {
    const cartData = Array.from(
      document.querySelectorAll(".item-quantity")
    ).map((item) => ({
      id: item.dataset.id,
      quantity: parseInt(item.querySelector(".quantity").textContent),
    }));
    localStorage.setItem("cart-data", JSON.stringify(cartData));
  };

  window.removeFromCart = (i) => {
    const removedProduct = cart[i];
    const cartItem = JSON.parse(localStorage.getItem("cart-data"));
    const quantity = cartItem?.[i]?.quantity || 1;

    updateTotalPrice(-removedProduct.price * quantity);
    cart.splice(i, 1);
    if (cartItem) cartItem.splice(i, 1);

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cart-data", JSON.stringify(cartItem));
    window.location.reload();
  };

  // Set up event listeners
  document.addEventListener("DOMContentLoaded", () => {
    const cartData = JSON.parse(localStorage.getItem("cart-data"));
    if (cartData?.length) {
      cartData.forEach((item) => {
        const quantityElem = document.querySelector(
          `.item-quantity[data-id="${item.id}"] .quantity`
        );
        if (quantityElem) quantityElem.textContent = item.quantity;
      });
    }
    updateTotalPrice(0);
  });

  document.querySelectorAll(".item-quantity").forEach((item) => {
    const price = parseFloat(item.dataset.price);
    const quantityElem = item.querySelector(".quantity");

    item.querySelector(".increase").addEventListener("click", () => {
      quantityElem.textContent = parseInt(quantityElem.textContent) + 1;
      updateTotalPrice(price);
      saveCartData();
    });

    item.querySelector(".decrease").addEventListener("click", () => {
      if (parseInt(quantityElem.textContent) > 1) {
        quantityElem.textContent = parseInt(quantityElem.textContent) - 1;
        updateTotalPrice(-price);
        saveCartData();
      }
    });
  });
}

function emptyCart() {
  cartContainer.innerHTML = `
    <div class="flex flex-col items-center justify-center gap-12 py-8 my-8">
      <p class="sm:text-5xl text-3xl font-medium">your Cart Is Empty</p>
      <a href="home.html" class="hover:bg-teal-600 sm:w-auto w-full px-6 py-2 font-semibold text-center text-white transition-all duration-300 bg-teal-500 rounded-lg">Go Shopping</a>
    </div>
  `;
  ["cart", "cart-data", "total-price"].forEach((key) =>
    localStorage.removeItem(key)
  );
}
