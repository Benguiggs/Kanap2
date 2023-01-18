// Récupération des données avec la méthode fetch
function getDatasFromBackend(urlBackend) {
    fetch(urlBackend)
        .then((res) => res.json())
        .then((datas) => showProducts(datas))
        .catch((e) => {
            console.log(e)
            document.getElementById().innerHTML = error.message
        })
}

//Récupération des données de l'API
function main() {
    let url = "http://localhost:3000/api/products";
    getDatasFromBackend(url);
}

main();

//Affiche tous les produits
function showProducts(datas) {
    if (datas === null || datas === []) {
        //todo prévenir l'utilisateur
        document.getElementById().innerHTML = error.message
        return;
    }

    datas.forEach((data) => {

        showData(data);
    })
}
//Affiche un produit
function showData(data) {
    const { _id, imageUrl, altTxt, name, description } = data
    const attach = createAttach(_id)
    const article = document.createElement("article")
    const image = createImage(imageUrl, altTxt)
    const h3 = createH3(name)
    const p = createParagraph(description)

    appendElementsToArticle(article, [image, h3, p])
    appendArticletoAttach(attach, article)
}
// Récupération des données du tableau dans l'api pour affichez chacun des articles
function appendElementsToArticle(article, array) {
    array.forEach((item) => {
        article.appendChild(item)
    })
    //article.appendChild(image)
    //article.appendChild(h3)
    //article.appendChild(p)

}

function test() {
    //déclaration

    //initialisation

    //contrôle

    //traitement

    //valeur de retour

}
// Fonction qui permet de faire le lien avec la page product
function createAttach(id) {
    const attach = document.createElement("a")
    attach.href = "./product.html?id=" + id
    return attach
}

function appendArticletoAttach(attach, article) {
    const items = document.querySelector("#items")
    if (items != null) {
        items.appendChild(attach)
        attach.appendChild(article)
    }
}
// Affiche l'image du produit
function createImage(imageUrl, altTxt) {
    const image = document.createElement("img")
    image.src = imageUrl
    image.alt = altTxt
    return image
}
// Affiche le titre du produit
function createH3(name) {
    const h3 = document.createElement("h3")
    h3.textContent = name
    return h3
}
// Affiche la description du produit
function createParagraph(description) {
    const p = document.createElement("p")
    p.textContent = description
    return p
}

