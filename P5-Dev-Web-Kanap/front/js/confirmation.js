const orderId = getOrderIdFromCart()
displayOrderId(orderId)


function getOrderIdFromCart() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    return urlParams.get("orderId")
    return orderId
}



function displayOrderId(orderId) {
    const orderIdElement = document.getElementById("orderId")
    orderIdElement.textContent = orderId ;
    localStorage.clear() ;
}

