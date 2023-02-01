
function test() {
    //déclaration

    //initialisation

    //contrôle

    //traitement

    //valeur de retour    
}

// Récupération des données depuis l'API et ajout des éléments liés au Local Storage vers la page Panier
let cartDatas;
let catalogueDatas;

// Fonction principale qui va vérifier s'il y a des données dans le Local Storage
function main() {
    
    cartDatas = getDatasFromLocalStorage();
    if (cartDatas.length === 0) {
        hideForm();
        showEmptyCart();
        return;
    }
    let url = "http://localhost:3000/api/products";
    getDatasFromBackend(url);
}
main();

// Fonction pour masquer le formulaire si le panier est vide
function hideForm() {
    const form = document.querySelector("form");
    form.style.display = "none";
}

// Fonction pour afficher un message d'avertissement lorsque le panier est vide
function showEmptyCart() {
    console.log(showEmptyCart);
    showAlertError("Votre panier est vide. Veuillez sélectionner des produits pour continuer.");
}

// Récupération des données avec la méthode fetch => solution 2
function getDatasFromBackend(urlBackend) {
    fetch(urlBackend)
        .then((res) => res.json())
        .then((datas) => {
            catalogueDatas = datas;
            showCart();
        })
        .catch((e) => {
            console.log(e);
            showAlertError(e.message);
        })
}



function showCart() {

    cartDatas.forEach((item) => {

        catalogueDatas;

        const itemPrice = catalogueDatas.find((catalogueData) => item.id === catalogueData._id).price;

        item.price = itemPrice;
        displayItem(item);

    });

    displayTotalQuantity();
    displayTotalPrice();

}

function getItemFromCatalogue(id) {
    let i=0;
    for(i=0; i< catalogueDatas.length;i++) {
        if (catalogueDatas[i]._id === id) {
            return catalogueDatas[i];
        }
    }
    
    
}


// Récupération des données via le Local Storage
function getDatasFromLocalStorage() {
    let datas = localStorage.getItem('datas');
    return datas == null ? [] : JSON.parse(datas);
}

/*
fetchItemsFromCache()
const submitButton = document.querySelector("#order")
submitButton.addEventListener("click", (e) => submitForm(e))
*/

// Cette fonction récupère les articles du cache
function fetchItemsFromCache() {
    console.log(fetchItemsFromCache);
    // Pour chaque article dans le panier
    for (let i = 0; i < cartDatas.length; i++) {
        // Faire une demande pour récupérer les données de l'API pour l'article actuel
        fetch(`http://localhost:3000/api/products/${cart[i].id}`)
            .then(response => response.json())
            .then(cartDatas => {  
                // Afficher l'article
                displayItem();
            });
    }
}

// Affichage des produits
function displayItem(item) {
    let itemCatalogue= getItemFromCatalogue(item.id);
    const article = createArticle(item,itemCatalogue)
    const imageDiv = createImgDiv(itemCatalogue)
    article.appendChild(imageDiv)

    const cardItemContent = createCartContent(item,itemCatalogue)
    article.appendChild(cardItemContent)
    displayArticle(article)

}

// Affiche la quantité totale des produits
function displayTotalQuantity() {
    const totalQuantity = document.querySelector("#totalQuantity")
    const total = cartDatas.reduce((total, item) => total + item.quantity, 0)
    totalQuantity.textContent = total
}

// Affiche le prix total
function displayTotalPrice() {
    let total = 0
    const totalPrice = document.querySelector("#totalPrice")
    
    cartDatas.forEach((item) => {
        const totalUnitPrice = item.price * item.quantity
        total += totalUnitPrice
        totalPrice.textContent = total
    })
    
}

// Crée le contenu pour un élément dans le panier 
function createCartContent(item,itemCatalogue) {
    const cardItemContent = document.createElement("div")
    cardItemContent.classList.add("cart__item__content")
    const description = createDescription(item,itemCatalogue)
    const settings = createSettings(item, itemCatalogue)

    cardItemContent.appendChild(description)
    cardItemContent.appendChild(settings)
   
    return cardItemContent
}

// Crée les paramètres d'un objet
function createSettings(item,itemCatalogue) {
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    addQuantityToSettings(settings, item,itemCatalogue)
    addDeleteToSettings(settings, item)
    return settings
}

// Cette fonction permet de supprimer un article dans les paramétres
function addDeleteToSettings(settings, item,) {
    const div = document.createElement("div")
    div.classList.add("cart__item__content__settings__delete")
    div.addEventListener("click", () => deleteItem(item))

    const p = document.createElement("p")
    p.textContent = "Supprimer"
    div.appendChild(p)
    settings.appendChild(div)
}

// Fonction de Suppression d'article
function deleteItem(item) {
    const itemToDelete = cartDatas.findIndex(
        (product) => product.id === item.id && product.color === item.color)
    cartDatas.splice(itemToDelete, 1)
    displayTotalPrice()
    displayTotalQuantity()
    deleteDataCache(item)
    deleteArticlePage(item)
    
}

// Supprime un article de la page
function deleteArticlePage(item) {
    const articleToDelete = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`
    )
    articleToDelete.remove()
}

// Ajoute la quantité au paramétres
function addQuantityToSettings(settings, item) {
    const quantity = document.createElement("div")
    quantity.classList.add("cart__item__content__settings__quantity")
    const p = document.createElement("p")
    p.textContent = "Qté : "
    quantity.appendChild(p)
    const input = document.createElement("input")
    input.type = "number"
    input.classList.add("itemQuantity")
    input.name = "itemQuantity"
    input.min = "1"
    input.max = "100"
    input.value = item.quantity
    input.addEventListener("input", () => updateQuantityAndCost(input.value, item));
    quantity.appendChild(input);
    settings.appendChild(quantity);
}


// Fonction permettant de mettre à jour la quantité et le prix global
function updateQuantityAndCost(newValue, item) {
    item.quantity = (Number(newValue));
    displayTotalQuantity();
    displayTotalPrice();
}


// Supprime les données du cache
function deleteDataCache(item) {
    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)
}

// Sauvegarde les données dans le cache
function saveDataToCache(item) {
    const dataToSave = JSON.stringify(item)
    const key = `${item.id}-${item.color}`
    localStorage.setItem(key, dataToSave)
}

// Ajoute une description aux produits
function createDescription(item) {
    const description = document.createElement("div")
    description.classList.add("cart__item__content__description")

    const h2 = document.createElement("h2")
    h2.textContent = item.name
    const p = document.createElement("p")
    p.textContent = item.color;
    const p2 = document.createElement("p")
    p2.textContent = item.price + " €"

    description.appendChild(h2)
    description.appendChild(p)
    description.appendChild(p2)
    return description
}

// Affiche l'article
function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article)
}

// Création d'un article
function createArticle(item) {
    const article = document.createElement('article')
    article.classList.add("cart__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}

// Créé une div qui affiche l'image du produit
function createImgDiv(itemCatalogue) {
    const div = document.createElement('div')
    div.classList.add("cart__item__img")
    const image = document.createElement('img')
    image.src = itemCatalogue.imageUrl
    image.alt = itemCatalogue.altText
    div.appendChild(image)
    return div
}

// Ajout du formulaire
function submitForm(e) {
    e.preventDefault()
    if (cart.length === 0) {
        alert("Sélectionner un article à acheter")
        return
    }

    if (isFormInvalid()) return
    if (isEmailInvalid()) return


    const body = createReqBody()
    fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json"
        }
    })
        .then((res) => res.json())
        .then((data) => {
            const orderId = data.orderId
            window.location.href = "confirmation.html" + "?orderId=" + orderId
        })
        .catch((err) => console.error(err))
}


// Prévient l'utilisateur d'une alerte avec un message d'erreur indiquant une couleur rouge
function showAlertError(message) {
    showAlert(message, '#f44336', 'white');
}
// Prévient l'utilisateur d'une alerte avec un message de succés indiquant une couleur verte
function showAlertSucces(message) {
    showAlert(message, '#5cb811', 'white');
}

// Fonction permettant de prévenir l'utilisateur si son email est invalide avec utilisation des regex
function isEmailInvalid() {
    const email = document.querySelector("#email").value
    const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
    if (regex.test(email) === false) {
        alert("Renseignez votre email dans le champs indiquées s'il-vous plaît")
        return true
    }
    return false
}

// Fonction permettant de prévenir l'utilisateur si les données de son formulaire sont invalide
function isFormInvalid() {
    const form = document.querySelector(".cart__order__form")
    const inputs = form.querySelectorAll("input")
    inputs.forEach((input) => {
        if (input.value === "") {
            alert("Remplissez tous les champs du formulaire s'il-vous plaît")
            return true
        }
        return false
    })
}

function createReqBody() {
    const form = document.querySelector(".cart__order__form")
    const firstName = form.elements.firstName.value
    const lastName = form.elements.lastName.value
    const address = form.elements.address.value
    const city = form.elements.city.value
    const email = form.elements.email.value
    const body = {
        contact: {
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email
        },
        products: getIdCache()
    }
    return body
}

function getIdCache() {
    const numberOfProducts = localStorage.length
    const ids = []
    for (let i = 0; i < numberOfProducts; i++) {
        const key = localStorage.key(i)
        const id = key.split("-")[0]
        ids.push(id)
    }
    return ids
}




// Fonction permettant de prévenir l'utilisateur d'un message d'alerte
function showAlert(message, bgColor, color) {

    const balises = document.getElementById('cart__items');
    let divMsg = document.getElementById("message");
    if (divMsg === null) {
        divMsg = document.createElement('div');
        divMsg.id = "message";
    }
    divMsg.style.display="block";
    divMsg.style.color = color;
    divMsg.style.background = bgColor;
    divMsg.style.padding="20px";
    divMsg.style.position="fixed";
    divMsg.style.top="50px";
    divMsg.style.left="50px";
    divMsg.style.zIndex="9999";
    divMsg.style.borderRadius="20px";

    divMsg.textContent = message;
    balises.appendChild(divMsg);
    // Fonction permettant d'afficher l'alerte au bout d'une seconde
    setTimeout(() => {
        divMsg.style.display="none";
    }, 1500)
}

// Prévient l'utilisateur d'une alerte avec un message d'erreur indiquant une couleur rouge
function showAlertError(message) {
    showAlert(message, '#f44336', 'white');
}
// Prévient l'utilisateur d'une alerte avec un message de succés indiquant une couleur verte
function showAlertSucces(message) {
    showAlert(message, '#5cb811', 'white');
}