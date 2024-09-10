import { orders } from "../data/orders.js";
import formatCurrency from "./utils/money.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import { cart, addToCart } from "../data/cart.js";

renderOrdersPage();

function updateCartQuantity() {
	let cartQuantity = 0;
  
	cart.forEach((cartItem) => {
		cartQuantity += cartItem.quantity;
	})
  
	document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
}

async function renderOrdersPage() {
	updateCartQuantity();

	await loadProductsFetch();

    let orderContainersHTML = '';

    orders.forEach((order) => {
		const options = { month: 'long', day: 'numeric' };
		const orderDate = new Date(order.orderTime);
		const formattedOrderDate = orderDate.toLocaleString('en-US', options);

        orderContainersHTML +=
		`
		<div class="order-container js-order-container-${order.id}">
          
			<div class="order-header">
			<div class="order-header-left-section">
				<div class="order-date">
				<div class="order-header-label">Order Placed:</div>
				<div>${formattedOrderDate}</div>
				</div>
				<div class="order-total">
				<div class="order-header-label">Total:</div>
				<div>$${formatCurrency(order.totalCostCents)}</div>
				</div>
			</div>

			<div class="order-header-right-section">
				<div class="order-header-label">Order ID:</div>
				<div>${order.id}</div>
			</div>
			</div>

			<div class="order-details-grid js-order-details-grid-${order.id}">
				
			</div>
	    </div>
	  `;
    });
	document.querySelector('.js-orders-grid').innerHTML = orderContainersHTML;


	orders.forEach((order) => {
		let orderDetailsHTML = '';

		order.products.forEach((product) => {
			const matchingProduct = getProduct(product.productId);
			
			const options = { month: 'long', day: 'numeric' };
			const deliveryDate = new Date(product.estimatedDeliveryTime);
			const formattedDeliveryDate = deliveryDate.toLocaleString('en-US', options);

			orderDetailsHTML += `
				<div class="product-image-container">
					<img src="${matchingProduct.image}">
				</div>

				<div class="product-details">
					<div class="product-name">
					${matchingProduct.name}
					</div>
					<div class="product-delivery-date">
					Arriving on: ${formattedDeliveryDate}
					</div>
					<div class="product-quantity">
					Quantity: ${product.quantity}
					</div>
					<button class="buy-again-button js-buy-again-button button-primary" data-product-id="${matchingProduct.id}">
					<img class="buy-again-icon" src="images/icons/buy-again.png">
					<span class="buy-again-message">Buy it again</span>
					</button>
				</div>

				<div class="product-actions">
					<a href="tracking.html">
					<button class="track-package-button button-secondary">
						Track package
					</button>
					</a>
				</div>
			`;
		});
		document.querySelector(`.js-order-details-grid-${order.id}`).innerHTML = orderDetailsHTML;
	});

	document.querySelectorAll('.js-buy-again-button').forEach((button) => {
		button.addEventListener('click', () => {
			const productId = button.dataset.productId;
			addToCart(productId, 1);
		});
	});
}
