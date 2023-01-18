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

    // return id!=null?id:false;
}
/*fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((res) => displayProduct(res))
*/

function getDataFromBackend(url, id) {
fetch(url +  id)
    .then((response) => response.json())
    .then((response) => displayProduct(response))
    .catch((e) => {
        console.log(e)
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
    
    let datas = getDatasFromLocalStorage();
    console.log(datas);
    if (datas.length==0) {
        datas.push(data);
        localStorage.setItem("datas", JSON.stringify(datas));
    } 
    else {

        // si l'id et la couleur sont dans le localstorage dans ce cas, on cumul les quantités (attention à la restriction des 100)

        //sinon datas.push()
        datas.push(data);
        localStorage.setItem("datas", JSON.stringify(datas));
    }
}
//todo function getLs datas->[]
function getDatasFromLocalStorage() {
    let datas=localStorage.getItem('datas');
    return datas==null?[] : JSON.parse( datas);
}




    //si présent, tu modifies que la quantité (cumul de la quantité précédente et courante) en vérifiant que ce soit <100
    //sinon push

  //  localStorage.setItem("datas", JSON.stringify(datas))
  function addToBasket() {
    const color = document.querySelector("#colors").value
    const quantity = document.querySelector("#quantity").value

    if (isOrdernotvalid(color, quantity)) return
    saveOrder(color, quantity)
    //redirectToCart()
}

// Fonction qui indique a l'utilisateur de choisir un article ainsi que sa couleur
function isOrdernotvalid(color, quantity) {
    if (color == null || color === "" || quantity == null || quantity == 0|| quantity > 100) {
        alert("Choisissez une couleur et un nombre d'article(s) s'il-vous plaît")
        return true
    }
}
// Redirige l'utilisateur vers la page cart.html
function redirectToCart() {
    window.location.href = "cart.html"
}

function main() {
    let url = "http://localhost:3000/api/products/";
    let id = getIdFromUrl();

    if (id == false) {
        //todo message à l'utilisateur
        //document.getElementById().innerHTML = error.message
        showAlertError("L'adresse est incorrecte");
        return;
    }
    getDataFromBackend(url,id);
    addEventForButton();
}

main();
function addEventForButton() {
    const button = document.querySelector("#addToCart");
    button.addEventListener("click", addToBasket);
    // Ajout des couleurs et des quantités aux articles

}

function showAlert(message, bgColor, color) {

    const balises=document.getElementsByClassName('item');
    let divMsg=document.getElementById("message");
    if( divMsg === null) {
        divMsg=document.createElement('div');
        divMsg.id="message";
    }
    divMsg.style.color=color;
    divMsg.style.background=bgColor ;
    
    divMsg.textContent=message;
    balises[0].appendChild(divMsg);
    //settimeout
}

function showAlertError(message){
    showAlert(message,'#f0a0a0', 'red');
}
function showAlertSucces(message){
    showAlert(message,'#bbf0a0', 'green');
}