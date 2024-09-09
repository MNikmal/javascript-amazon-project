import {renderOrderSummary} from "./checkout/orderSummary.js";
import {renderPaymentSummary} from "./checkout/paymentSummary.js";
import {loadProducts, loadProductsFetch} from "../data/products.js";
import {cart, loadCart} from "../data/cart.js";

async function loadPage() {
    try {
        await loadProductsFetch();

        await new Promise((resolve) => {
            loadCart(() => {
                resolve();
            });
        });

    } catch (error) {
        console.log('Unexpected error. Please try again later.')
    }   
    
    renderOrderSummary();
    renderPaymentSummary();
    updateHeader();
}
loadPage();

export function updateHeader() {
    let cartQuantity = 0;

    cart.forEach((cartItem) => {
        cartQuantity += cartItem.quantity;
    })

    document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
}

/*
Promise.all([
    loadProductsFetch(),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    })

]).then(() => {
    renderOrderSummary();
    renderPaymentSummary();
});
*/

/*
new Promise((resolve) => {
    loadProducts(() => {
        resolve();
    });

}).then(() => {
    return new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    });

}).then(() => {
    renderOrderSummary();
    renderPaymentSummary();
});
*/

/*
loadProducts(() => {
    loadCart(() => {
        renderOrderSummary();
        renderPaymentSummary();
    });
})
*/