// Récuperere l'id de la commande depuis l'url
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


// Affiche à  l'utilisateur que sa commande à été effectué et affiche le numéro de commande.
function displayOrderId(orderId) {
    const orderIdElement = document.getElementById("orderId")
    orderIdElement.textContent = orderId;

}

// Fonction Main global
function main() {
    let orderId = getOrderIdFromUrl();
    console.log(orderId)
    displayOrderId(orderId);
}

main();

