import {getOrder} from '../data/orders.js';
import {getProduct, loadProductsFetch} from '../data/products.js';

const url = new URL(window.location.href);
const orderId = url.searchParams.get('orderId');
const productId = url.searchParams.get('productId');

renderTrackingSummary();

async function renderTrackingSummary() {
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
            <div class="progress-label">
            Preparing
            </div>
            <div class="progress-label current-status">
            Shipped
            </div>
            <div class="progress-label">
            Delivered
            </div>
        </div>

        <div class="progress-bar-container">
            <div class="progress-bar"></div>
        </div>
    `;
}