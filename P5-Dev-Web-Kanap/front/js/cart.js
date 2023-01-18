// Récupération des données depuis l'API et ajout des éléments liés au Local Storage vers la page Panier

const cart = []

fetchItemsFromCache()
cart.forEach((item) => displayItem(item))

const submitButton = document.querySelector("#order")
submitButton.addEventListener("click", (e) => submitForm(e))


function fetchItemsFromCache() {
    const numberOfItems = localStorage.length
    //il faut chercher les produit de l'api avec fetch 
    fetch(`http://localhost:3000/api/products/${id}`)
        .then((response) => response.json())
        .then((res) => displayProduct(res))

    for (let i = 0; i < numberOfItems; i++) {
        // localStorage[i].id 
        // il faut chercher ( find )le produit qui correpond a l'id de produit dans localStorage pour avoir les autres info ( price , image , name )
        const item = localStorage.getItem(localStorage.key(i)) || ""
        const itemObject = JSON.parse(item)
        cart.push(itemObject)
    }
}

// Affichage des produits
function displayItem(item) {
    const article = createArticle(item)
    const imageDiv = createImgDiv(item)
    article.appendChild(imageDiv)

    const cardItemContent = createCartContent(item)
    article.appendChild(cardItemContent)
    displayArticle(article)
    displayTotalQuantity()
    displayTotalPrice()
}
// affiche la quantité totale des produits
function displayTotalQuantity() {
    const totalQuantity = document.querySelector("#totalQuantity")
    const total = cart.reduce((total, item) => total + item.quantity, 0)
    totalQuantity.textContent = total
}
// Affiche le prix total
function displayTotalPrice() {
    let total = 0
    const totalPrice = document.querySelector("#totalPrice")
    cart.forEach((item) => {
        const totalUnitPrice = item.price * item.quantity
        total += totalUnitPrice
        totalPrice.textContent = total
    })
}

function createCartContent(item) {
    const cardItemContent = document.createElement("div")
    cardItemContent.classList.add("cart__item__content")
    const description = createDescription(item)
    const settings = createSettings(item)

    cardItemContent.appendChild(description)
    cardItemContent.appendChild(settings)
    return cardItemContent
}

function createSettings(item) {
    const settings = document.createElement("div")
    settings.classList.add("cart__item__content_settings")

    addQuantityToSettings(settings, item)
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
    const itemToDelete = cart.findIndex(
        (product) => product.id === item.id && product.color === item.color)
    cart.splice(itemToDelete, 1)
    displayTotalPrice()
    displayTotalQuantity()
    deleteDataCache(item)
    deleteArticlePage(item)
}

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
    input.addEventListener("input", () => updateQuantityAndCost(item.id, input.value, item))
    quantity.appendChild(input)
    settings.appendChild(quantity)
}


// fonction permettant de mettre à jour la quantité et le prix global
function updateQuantityAndCost(id, newValue, item) {
    const itemToUpdate = cart.find(item => item.id === id)
    itemToUpdate.quantity = Number(newValue)
    item.quantity = itemToUpdate.quantity
    displayTotalQuantity()
    displayTotalPrice()
    deleteDataCache(item)
    deleteArticlePage(item)
}



function deleteDataCache(item) {
    const key = `${item.id}-${item.color}`
    localStorage.removeItem(key)
}

function saveDataToCache(item) {
    const dataToSave = JSON.stringify(item)
    const key = `${item.id}-${item.color}`
    localStorage.setItem(key, dataToSave)
}

function createDescription(item) {
    const description = document.createElement("div")
    description.classList.add("cart__item__content_description")

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

function displayArticle(article) {
    document.querySelector("#cart__items").appendChild(article)
}


function createArticle(item) {
    const article = document.createElement('article')
    article.classList.add("card__item")
    article.dataset.id = item.id
    article.dataset.color = item.color
    return article
}


function createImgDiv(item) {
    const div = document.createElement('div')
    div.classList.add("cart__item__img")
    const image = document.createElement('img')
    image.src = item.imageUrl
    image.alt = item.altText
    div.appendChild(image)
    return div
}

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

function isEmailInvalid() {
    const email = document.querySelector("#email").value
    const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
    if (regex.test(email) === false) {
        alert("Renseignez votre email dans le champs indiquées s'il-vous plaît")
        return true
    }
    return false
}

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

