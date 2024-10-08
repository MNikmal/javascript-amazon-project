import {cart, addToCart} from '../data/cart.js';
import {products, loadProducts} from '../data/products.js';

loadProducts(renderProductsGrid);

export function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
  })

  document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

function containsMatch(productName, searchWords) {
  for (let i = 0; i < searchWords.length; i++) {
    if (!productName.includes(searchWords[i])) {
      return false;
    }
  }
  return true;
}

export function searchProducts() {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  if (params.get('search')) {
    const search = params.get('search').toLowerCase();
    const searchWords = search.split(" ");
   
    for (let i = products.length - 1; i >= 0; i--) {
      if (!containsMatch(products[i].name.toLowerCase(), searchWords)) {
        products.splice(i, 1);
      }
    }
  }
}

function renderProductsGrid() {
  searchProducts();

  updateCartQuantity();
  
  let productsHTML = '';

  // Generate the HTML for each product
  products.forEach((product) => {
      productsHTML += `
          <div class="product-container">
            <div class="product-image-container">
              <img class="product-image"
                src="${product.image}">
            </div>

            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>

            <div class="product-rating-container">
              <img class="product-rating-stars"
                src="${product.getStarsUrl()}">
              <div class="product-rating-count link-primary">
                ${product.rating.count}
              </div>
            </div>

            <div class="product-price">
              ${product.getPrice()}
            </div>

            <div class="product-quantity-container">
              <select class="js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>

            ${product.extraInfoHTML()}

            <div class="product-spacer"></div>

            <div class="added-to-cart">
              <img src="images/icons/checkmark.png">
              Added
            </div>

            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-Id="${product.id}">
              Add to Cart
            </button>
          </div>
      `;
  });

  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  // Add event listeners for each add-to-cart button
  document.querySelectorAll('.js-add-to-cart').forEach((button) => {
      button.addEventListener('click', () => {
          const productId = button.dataset.productId;
          const quantitySelected = Number(document.querySelector(`.js-quantity-selector-${productId}`).value);
          addToCart(productId, quantitySelected);
          updateCartQuantity();
      });
  });

  document.querySelector('.js-search-button').addEventListener('click', () => {
    const search = document.querySelector('.js-search-bar').value;
    window.location.href = `amazon.html?search=${search}`;
  })
}
