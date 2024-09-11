import {getOrder} from '../data/orders.js';
import {getProduct, loadProductsFetch} from '../data/products.js';
import {updateCartQuantity, searchProducts} from './amazon.js';

renderTrackingSummary();

async function renderTrackingSummary() {
    const url = new URL(window.location.href);
    const orderId = url.searchParams.get('orderId');
    const productId = url.searchParams.get('productId');

    searchProducts();
    updateCartQuantity();

    await loadProductsFetch();

    const matchingOrder = getOrder(orderId);
    const matchingProduct = getProduct(productId);

    let orderProduct;
    matchingOrder.products.forEach((product) => {
        if (product.productId == productId) {
            orderProduct = product;
        }
    });

    const options = {weekday: 'long', month: 'long', day: 'numeric'};
    const deliveryDate = new Date(orderProduct.estimatedDeliveryTime);
    const formattedDeliveryDate = deliveryDate.toLocaleString('en-US', options);

    document.querySelector('.js-order-tracking').innerHTML = `
        <a class="back-to-orders-link link-primary" href="orders.html">
            View all orders
        </a>

        <div class="delivery-date">
            Arriving on ${formattedDeliveryDate}
        </div>

        <div class="product-info">
            ${matchingProduct.name}
        </div>

        <div class="product-info">
            Quantity: ${orderProduct.quantity}
        </div>

        <img class="product-image" src="${matchingProduct.image}">

        <div class="progress-labels-container">
            <div class="progress-label js-progress-label-preparing">
            Preparing
            </div>
            <div class="progress-label js-progress-label-shipped">
            Shipped
            </div>
            <div class="progress-label js-progress-label-delivered">
            Delivered
            </div>
        </div>

        <div class="progress-bar-container">
            <div class="progress-bar js-progress-bar"></div>
        </div>
    `;

    const currentTime = new Date();
    const orderTime = new Date(matchingOrder.orderTime);
    const deliveryTime = new Date(orderProduct.estimatedDeliveryTime);

    const deliveryProgress = ((currentTime.getTime() - orderTime.getTime()) / (deliveryTime.getTime() - orderTime.getTime()) * 100);

    let deliveryStatus = '';
    if (deliveryProgress < 50) {
        deliveryStatus = 'preparing';
    } else if (deliveryProgress < 100) {
        deliveryStatus = 'shipped';
    } else {
        deliveryStatus = 'delivered';
    }

    document.querySelector(`.js-progress-label-${deliveryStatus}`).classList.add('current-status');
    document.querySelector('.js-progress-bar').style.width = `${deliveryProgress}%`;

    document.querySelector('.js-search-button').addEventListener('click', () => {
		const search = document.querySelector('.js-search-bar').value;
		window.location.href = `amazon.html?search=${search}`;
	  })
}