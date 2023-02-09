


function getOrderIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    const id = urlParams.get("order")
    if (id != null) {
        return id;
    } else {
        return false;
    }    
}



function displayOrderId(orderId) {
    const orderIdElement = document.getElementById("orderId")
    orderIdElement.textContent = orderId ;

}


function main() {
    let orderId = getOrderIdFromUrl();
    console.log(orderId)
    displayOrderId(orderId);
}

main();

