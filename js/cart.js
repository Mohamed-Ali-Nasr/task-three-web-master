const cartContainer = document.getElementById("cart-container");
let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length) {
  const cart = [
    ...new Map(
      JSON.parse(localStorage.getItem("cart")).map((item) => [
        JSON.stringify(item),
        item,
      ])
    ).values(),
  ];

  let totalPrice = cart.reduce((acc, item) => acc + item.price, 0);

  document.getElementById("cart-items").innerHTML = `
    <div class="sm:flex-row border-b-gray-300 sm:border-none flex flex-col items-center justify-between gap-8 pb-4 mb-4 text-2xl text-gray-500 border-b">
       <h3>
         Total Price:
            <span id="total-price"  class="font-bold text-teal-500">
              ${totalPrice} EGP
            </span>
       </h3>
       <h3>
         Total Number:
              <span class="font-semibold text-teal-500">
                ${cart.length}
              </span>
       </h3>
    </div>

  `;

  cart?.forEach((product, i) => {
    cartContainer.innerHTML += `
      <div style="box-shadow: 12px 12px 26px rgba(0, 0, 0, 0.2),-12px -12px 26px rgba(255, 255, 255, 0.6)";
       class="rounded-xl p-4 my-4">
        <div class="sm:flex-row flex flex-col items-center justify-between gap-8">
          <div class="flex items-center">
            <img class="w-28 mr-3"
              src="${product.imageCover}"
              alt="${product.name}"
            />
            <div>
              <h3 class="mb-2 text-lg font-medium text-gray-500">
                ${product.name.split(" ").slice(0, 3).join(" ")}
              </h3>
              <h4 class="mb-2 font-bold text-teal-500">
                ${product.price} EGP
              </h4>
              <div class="flex cursor-pointer">
                <i class="fa-solid fa-trash text-[20px] text-1xl text-red-600 relative top-[2px] mr-1 cursor-pointer"></i>
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
    `;
  });

  function removeFromCart(i) {
    let totalPrice = JSON.parse(localStorage.getItem("total-price"));
    let cartItem = JSON.parse(localStorage.getItem("cart-data"));
    const removedProduct = cart[i];
    const removedItem = cartItem[i];

    if (cartItem && totalPrice) {
      cart.splice(i, 1);
      cartItem.splice(i, 1);
      totalPrice -= removedProduct.price * removedItem.quantity;
      document.getElementById("total-price").textContent = totalPrice;

      localStorage.setItem("cart-data", JSON.stringify(cartItem));
    } else {
      cart.splice(i, 1);
      totalPrice = cart.reduce((acc, item) => acc + item.price, 0);
      totalPrice -= removedProduct.price;
      document.getElementById("total-price").textContent = totalPrice;
    }

    localStorage.setItem("total-price", JSON.stringify(totalPrice));
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.reload();
  }

  document.addEventListener("DOMContentLoaded", loadCartFromLocalStorage);

  document.querySelectorAll(".item-quantity").forEach((item) => {
    const price = parseFloat(item.dataset.price);
    let quantityElem = item.querySelector(".quantity");
    const increaseButton = item.querySelector(".increase");
    const decreaseButton = item.querySelector(".decrease");

    increaseButton.addEventListener("click", () => {
      let totalPrice = JSON.parse(localStorage.getItem("total-price"));
      let quantity = parseInt(quantityElem.textContent);
      quantity++;
      quantityElem.textContent = quantity;

      if (totalPrice) {
        totalPrice += price;
        document.getElementById("total-price").textContent = totalPrice;
      } else {
        totalPrice = cart.reduce((acc, item) => acc + item.price, 0);
        totalPrice += price;
        document.getElementById("total-price").textContent = totalPrice;
      }

      localStorage.setItem("total-price", JSON.stringify(totalPrice));

      saveCartToLocalStorage();
    });

    decreaseButton.addEventListener("click", () => {
      let totalPrice = JSON.parse(localStorage.getItem("total-price"));
      let quantity = parseInt(quantityElem.textContent);

      if (quantity > 1) {
        quantity--;
        quantityElem.textContent = quantity;

        totalPrice -= price;
        document.getElementById("total-price").textContent = totalPrice;

        localStorage.setItem("total-price", JSON.stringify(totalPrice));

        saveCartToLocalStorage();
      }
    });
  });

  function saveCartToLocalStorage() {
    let cartData = [];

    document.querySelectorAll(".item-quantity").forEach((item) => {
      const quantity = parseInt(item.querySelector(".quantity").textContent);
      const itemId = item.dataset.id;

      cartData.push({
        id: itemId,
        quantity,
      });

      localStorage.setItem("cart-data", JSON.stringify(cartData));
    });
  }

  function loadCartFromLocalStorage() {
    const cartData = JSON.parse(localStorage.getItem("cart-data"));
    let totalPrice = JSON.parse(localStorage.getItem("total-price"));

    if (totalPrice) {
      document.getElementById("total-price").textContent = totalPrice;
    } else {
      totalPrice = cart.reduce((acc, item) => acc + item.price, 0);
      document.getElementById("total-price").textContent = totalPrice;
    }

    if (cartData?.length > 0) {
      cartData.forEach((cartItem) => {
        const itemElem = document.querySelector(
          `.item-quantity[data-id="${cartItem.id}"]`
        );
        if (itemElem) {
          const quantityElem = itemElem.querySelector(".quantity");

          quantityElem.textContent = cartItem.quantity;
        }
      });
    }
  }
} else {
  emptyCart();
}

function emptyCart() {
  cartContainer.innerHTML = `
    <div class="flex flex-col items-center justify-center gap-12 py-8 my-8">
        <p class="sm:text-5xl text-3xl font-medium">
          your Cart Is Empty
        </p>
        <a href="home.html" class="hover:bg-teal-600 sm:w-auto w-full px-6 py-2 font-semibold text-center text-white transition-all duration-300 bg-teal-500 rounded-lg cursor-pointer">
          Go Shopping
        </a>
    </div>
`;

  localStorage.removeItem("cart");
  localStorage.removeItem("cart-data");
  localStorage.removeItem("total-price");
}
