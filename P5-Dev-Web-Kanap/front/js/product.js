main();

// Récupere l'id depuis l'url
function getIdFromUrl() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    const id = urlParams.get("id")
    if (id != null) {
        return id;
    } else {
        return false;
    }

}

// Récupération des données depuis le Backend
function getDataFromBackend(url, id) {
    fetch(url + id)
        .then((response) => response.json())
        .then((response) => displayProduct(response))
        .catch((e) => {
            console.log(e)
            //TODO masquer le zone de détail du produit
            showAlertError('Produit non trouvé');

            document.getElementById().innerHTML = error.message
        })
}
// Affiche tous les produits
function displayProduct(product) {
    const altTxt = product.altTxt
    const colors = product.colors
    const description = product.description
    const imageUrl = product.imageUrl
    const name = product.name
    const price = product.price

    itemPrice = price
    imgUrl = imageUrl
    altText = altTxt
    artName = name
    createImage(imageUrl, altTxt)
    createTitle(name)
    createPrice(price)
    createCartContent(description)
    createColors(colors)
}

// Affiche l'image du produit
function createImage(imageUrl, altTxt) {
    const image = document.createElement('img')
    image.src = imageUrl
    image.alt = altTxt
    const parent = document.querySelector(".item__img")
    if (parent != null) parent.appendChild(image)
}

// Affiche le titre du produit
function createTitle(name) {
    const h1 = document.querySelector("#title")
    if (h1 != null) h1.textContent = name
}
// Affiche le prix du produit
function createPrice(price) {
    const span = document.querySelector("#price")
    if (span != null) span.textContent = price
}
// Affiche la description du produit
function createCartContent(description) {
    const p = document.querySelector("#description")
    if (p != null) p.textContent = description
}
// Fonction permettant a l'utilisateur de selectionner la couleur du produit
function createColors(colors) {
    const select = document.querySelector("#colors")
    if (select != null) {
        colors.forEach((color) => {
            const option = document.createElement("option")
            option.value = color
            option.textContent = color
            select.appendChild(option)
        })
    }
}

// Sauvegarde le choix des articles au panier
function saveOrder(color, quantity) {
    const data = {
        id: getIdFromUrl(),
        color: color,
        quantity: Number(quantity),
    }
// Récupere les données en provenance du local storage
    let datas = getDatasFromLocalStorage();
    console.log(datas);
    if (datas.length == 0) {
        datas.push(data);
    }
    else {
        let productFind=false ;
        // si l'id et la couleur sont dans le localstorage dans ce cas, on cumul les quantités
        datas.forEach( datals => {
            if (datals.id== data.id && datals.color == data.color) {
                productFind=true;
                datals.quantity=datals.quantity + data.quantity;
                datals.quantity= datals.quantity>100?100:datals.quantity;
            }
        } )
        //sinon datas.push()
        if (!productFind) {
            datas.push(data);
        }
    }
    localStorage.setItem("datas", JSON.stringify(datas));
    showAlertSucces("Votre produit a été mis dans le panier")
}
// Récupération des données via le Local Storage
function getDatasFromLocalStorage() {
    let datas = localStorage.getItem('datas');
    return datas == null ? [] : JSON.parse(datas);
}




// Fonction d'ajout au Panier
function addToBasket() {
    const color = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value

    if (isOrdernotvalid(color, quantity)) return
    saveOrder(color, quantity)
    
}

// Fonction qui indique a l'utilisateur de choisir un article ainsi que sa couleur
function isOrdernotvalid(color, quantity) {
    if (color == null || color === "" || quantity == null || quantity == 0 || quantity > 100) {
        showAlertError("Choisissez une couleur et un nombre d'article(s) s'il-vous plaît")
        return true
    }
}


function main() {
    let url = "http://localhost:3000/api/products/";
    let id = getIdFromUrl();

    if (id == false) {
        showAlertError("L'adresse est incorrecte");
        return;
    }

    getDataFromBackend(url, id);
    addEventForButton();
}


// Quand on clique sur un article, cela l'ajoute au panier
function addEventForButton() {
    const button = document.querySelector("#addToCart");
    button.addEventListener("click", addToBasket);
}

// Fonction permettant de prévenir l'utilisateur d'un message d'alerte
function showAlert(message, bgColor, color) {

    const balises = document.getElementsByClassName('item');
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
    balises[0].appendChild(divMsg);
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