// Récupération des données depuis l'API et ajout des éléments liés au Local Storage vers la page Panier
let cartDatas;
let catalogueDatas;

// Fonction principale qui va vérifier s'il y a des données dans le Local Storage
function main() {
    initialisePanier();
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

function initialisePanier() {
    let items = document.getElementById('cart__items');
    items.innerHTML = "";
    items = document.getElementById('totalQuantity');
    items.innerHTML = "";
    items = document.getElementById('totalPrice');
    items.innerHTML = "";

}

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

// Récupération des données avec la méthode fetch
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

// Fonction qui montre les produits choisis, le prix et la quantité total
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
// Récupération des produits du catalogue
function getItemFromCatalogue(id) {
    let i = 0;
    for (i = 0; i < catalogueDatas.length; i++) {
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


const submitButton = document.querySelector("#order")
submitButton.addEventListener("click", (e) => handleSubmitForm(e))


// Affichage des produits
function displayItem(item) {
    let itemCatalogue = getItemFromCatalogue(item.id);
    const article = createArticle(item, itemCatalogue)
    const imageDiv = createImgDiv(itemCatalogue)
    article.appendChild(imageDiv)

    const cardItemContent = createCartContent(item, itemCatalogue)
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
function createCartContent(item, itemCatalogue) {
    const cardItemContent = document.createElement("div")
    cardItemContent.classList.add("cart__item__content")
    const description = createDescription(item, itemCatalogue)
    const settings = createSettings(item, itemCatalogue)

    cardItemContent.appendChild(description)
    cardItemContent.appendChild(settings)

    return cardItemContent
}

// Crée les paramètres d'un objet
function createSettings(item, itemCatalogue) {
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content__settings")

    addQuantityToSettings(settings, item, itemCatalogue)
    addDeleteToSettings(settings, item)
    return settings
}

// Cette fonction permet de supprimer un article dans les paramétres
function addDeleteToSettings(settings, item) {
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
    cartDatas.splice(itemToDelete, 1);
    localStorage.setItem("datas", JSON.stringify(cartDatas));
    main();
    showAlertSucces('Le canapé a bien été supprimé du panier');
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

// Fonction permettant la gestion des évenements du formulaire
function addEventToFormField() {
    const formContent = document.querySelector('.cart__order__form');
    const userFirstName = document.querySelector('#firstName');
    const userLastName = document.querySelector('#lastName');
    const emailContent = document.querySelector('#email');
    const adressContent = document.querySelector('#adress');
    const cityContent = document.querySelector('#city');

    userFirstName.addEventListener(
        'blur',
        function () {
            checkFirstNameField();
        }
    )
    userLastName.addEventListener(
        'blur',
        function () {
            checkLastNameField();
        }
    )
    emailContent.addEventListener(
        'blur',
        function () {
            checkMail();
        }
    )
    adressContent.addEventListener(
        'blur',
        function () {
            checkIfFieldsEmpty('#adress', '#adressErrorMsg');
        }
    )
    cityContent.addEventListener(
        'blur',
        function () {
            checkIfFieldsEmpty('#city', '#cityErrorMsg');
        }
    )
    formContent.addEventListener(
        'submit',
        function (evt) {
            handleSubmitForm(evt)
        }
    )
}

//  Fonction permettant de vérifier si le champ du prénom est bien valide
function checkFirstNameField() {
    const firstNameValidation = /^[A-Za-zÀ-ÿ]+[-\s]{0,1}[A-Za-zÀ-ÿ]+$/;
    const userName = document.querySelector("#firstName").value;
    const isValidFirstName = firstNameValidation.test(userName) && userName !== '';
    let firstNameErrorMessage = document.querySelector("#firstNameErrorMsg");
    firstNameErrorMessage.textContent = isValidFirstName ? null : "Ce champ est invalide.";
    firstNameErrorMessage.style.color = "red";
    return isValidFirstName;
}

// Fonction permettant de vérifier si le champ du nom de famille est bien valide
function checkLastNameField() {
    const lastNameValidation = /^(?:[A-Za-z]+[\s]{0,1})+$/;
    const userLastName = document.querySelector("#lastName").value;
    let lastNameErrorMessage = document.querySelector("#lastNameErrorMsg");
    const isValidLastName = lastNameValidation.test(userLastName) && userLastName !== '';
    lastNameErrorMessage.textContent = isValidLastName ? null : "Ce champ est invalide";
    lastNameErrorMessage.style.color = "red";
    return isValidLastName;
}

// Fonction permettant de vérifier si le champ email est bien valide
function checkMail() {
    const emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const emailContent = document.querySelector('#email').value;
    let emailErrorMessage = document.querySelector('#emailErrorMsg');
    const isValidMail = emailValidation.test(emailContent) && emailContent !== '';
    emailErrorMessage.textContent = isValidMail ? null : "Ce champ est invalide";
    emailErrorMessage.style.color = 'red';
    return isValidMail;
}

// Fonction permettant de vérifier si le champ est vide
function checkIfFieldsEmpty(idContent, idErrMsg) {
    const errMsg = document.querySelector(idErrMsg);
    const content = document.querySelector(idContent).value;
    const fieldIsNotEmpty = content !== '';
    errMsg.textContent = fieldIsNotEmpty ? null : "Ce champ est invalide";
    errMsg.style.color = 'red';
    return fieldIsNotEmpty;
}

// Fonction permettant de récupérer de façon asynchrone les données du formulaire remplis par l'utilisateur
async function handleSubmitForm(evt) {
    evt.preventDefault();

    if (!checkFields()) {
        return;
    }

    const requestBody = {
        contact: {
            firstName: document.querySelector('#firstName').value,
            lastName: document.querySelector('#lastName').value,
            address: document.querySelector('#adress').value,
            city: document.querySelector('#city').value,
            email: document.querySelector('#email').value,
        },
        products: cartProducts.map((product) => product.id)
    }

    try {
        const res = await postOrder(requestBody);
        clearLocalStorage();
        window.location.href = 'confirmation.html?order=' + res.orderId;
    } catch (err) {
        showAlertError('Une erreur est survenue')
    }
}


// Fonction permettant de vérifier que le formulaire est bien valide
function checkFields() {
    return checkFirstNameField()
        && checkLastNameField()
        && checkMail
        && checkIfFieldsEmpty('#adress', '#addressErrorMsg')
        && checkIfFieldsEmpty('#city', '#cityErrorMsg')
}

// Fonction permettant d'envoyer la requête vers l'API de façon asynchrone
async function postOrder(requestBody) {
    const response = await fetch(`${URL}/products/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(requestBody)
    });
    return response.json();
}

// Fonction permettant de nettoyer le Local Storage une fois la commande effectué
function clearLocalStorage() {
    localStorage.clear();
}

// Fonction permettant d'afficher un message d'erreur si l'API n'est pas disponible.
function showError() {
    document.querySelector('.cart').textContent = "Désolé, le site n'est pas disponible"
}

// Prévient l'utilisateur d'une alerte avec un message d'erreur indiquant une couleur rouge
function showAlertError(message) {
    showAlert(message, '#f44336', 'white');
}
// Prévient l'utilisateur d'une alerte avec un message de succés indiquant une couleur verte
function showAlertSucces(message) {
    showAlert(message, '#5cb811', 'white');
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
    divMsg.style.display = "block";
    divMsg.style.color = color;
    divMsg.style.background = bgColor;
    divMsg.style.padding = "20px";
    divMsg.style.position = "fixed";
    divMsg.style.top = "50px";
    divMsg.style.left = "50px";
    divMsg.style.zIndex = "9999";
    divMsg.style.borderRadius = "20px";

    divMsg.textContent = message;
    balises.appendChild(divMsg);
    // Fonction permettant d'afficher l'alerte au bout d'une seconde
    setTimeout(() => {
        divMsg.style.display = "none";
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