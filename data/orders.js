export const orders = JSON.parse(localStorage.getItem('orders')) || [];

export function addOrder(order) {
    orders.unshift(order);
    saveToStorage();
}

export function getOrder(orderId) {
    let matchingOrder;
    orders.forEach((order) => {
        if (orderId === order.id) {
            matchingOrder = order;
        }
    });

    return matchingOrder;
}

function saveToStorage() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

