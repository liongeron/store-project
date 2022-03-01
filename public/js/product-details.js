const productInfo = document.querySelector('.product-info')
const focusedPicture = document.querySelector('.focused-picture')
const detailsPictures = document.querySelector('.details-gallery')
const addBtn = document.querySelector('.add-to-cart-btn')
const productCounter = document.querySelector('.product-counter')
const productPrice = document.querySelector('.details-product-price')
const inStockContainer = document.querySelector('.in-stock')
const bannerProducts = document.querySelector('.banner-products')

const lightbox = document.createElement('div')
lightbox.id = 'lightbox'
document.body.appendChild(lightbox)

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get('id')

let price
let inStock

async function getProductDetails() {
    const response = await fetch("products.json")
    const data = await response.json()
    
    let focusedProduct = data.products.find(x => x.id == id)
    let category = data.products.find(x => x.id == id).category
    
    let productPictures = focusedProduct.allPictures.split(" ")

    productPrice.innerHTML = `$${focusedProduct.price}.00`
    productInfo.innerHTML = `<h2>${focusedProduct.brand} ${focusedProduct.model}</h2>`
    focusedPicture.innerHTML += `<img src="./img/large/${focusedProduct.id}-1.webp" alt="Big picture of ${focusedProduct.brand} ${focusedProduct.model}">`
        
    for (picture of productPictures) {
        detailsPictures.innerHTML += `<div class="gallery-picture">
        <img src="${picture}" alt="${focusedProduct.brand} ${focusedProduct.model} Thumbnail">
        </div>`
    }

    detailsPictures.children[0].classList.add('gallery-focused')
            
    inStock = focusedProduct.inStock
    if (getCookie(id)) {
        let temp = inStock - getCookie(id)
        if (temp) {
            inStockContainer.innerHTML = `In stock: ${temp}`
            productCounter.setAttribute("max",temp)
        } else {
            inStockContainer.innerHTML = `Out of stock`
            addBtn.remove()
            productCounter.remove()
        }
    } else {
        inStockContainer.innerHTML = `In stock: ${inStock}`
        productCounter.setAttribute("max",inStock)
    }
    price = parseInt(focusedProduct.price)

    const galleryPictures = document.querySelectorAll('.gallery-picture')
    galleryPictures.forEach(picture => {
        picture.addEventListener('click', (e) => {
            for (div of galleryPictures) {
                div.classList.remove('gallery-focused')
            }
            focusedPicture.querySelectorAll('img')[1].src = picture.querySelector('img').src.replace('min', 'large')
            picture.classList.add('gallery-focused')
        })
    })


    let counter = 0
    data.products.filter(product => {
        if (product.category == category && product.id != id && counter < 4) {
            if (product.price != product.prevPrice) {
                bannerProducts.innerHTML += `<a href="/product?id=${product.id}" class="product"><div class="product-img"><img src="../img/min/${product.id}-1.webp" alt="${product.brand} ${product.model} Thumbnail"></div> <div class="product-text"><p><b>${product.price}$</b> <span class="prev-price"><b>${product.prevPrice}$</b></span></p> ${product.brand} ${product.model}</div></a>`
                counter++
            } else {
                bannerProducts.innerHTML += `<a href="/product?id=${product.id}" class="product"><div class="product-img"><img src="../img/min/${product.id}-1.webp" alt="${product.brand} ${product.model} Thumbnail"></div> <div class="product-text"><p><b>${product.price}$</b></p> ${product.brand} ${product.model}</div></a>`
                counter++
            }
        }
    });
}

productCounter.addEventListener("keydown", async (e) => {
    if (e.key == '-' || e.key == '+' | e.key == 'e') {
        e.preventDefault();
    }
})

productCounter.oninput = (e) => {
    if (parseInt(e.target.value) > inStock || e.target.max > inStock) {
        if(getCookie(id))
            e.target.max = inStock - getCookie(id)
        else
            e.target.max = inStock
        e.target.value = e.target.max
    }
    productPrice.innerHTML = '$' + (productCounter.value * price) + ".00";
}

addBtn.addEventListener('click', () => {
    if (productCounter.value && productCounter.value <= inStock) {
        if (!getCookie(id)) {
            document.cookie = `${id}=${productCounter.value}; SameSite=None; Secure` //HttpOnly     
        } else {
            document.cookie = `${id}=${parseInt(productCounter.value) + parseInt(getCookie(id))}; SameSite=None; Secure` //HttpOnly
        }
        let temp = inStock - getCookie(id)
        if (temp) {
            inStockContainer.innerHTML = `In stock: ${temp}`
            productCounter.setAttribute("max", temp)
        } else {
            inStockContainer.innerHTML = `Out of stock`
            addBtn.remove()
            productCounter.remove()
        }
        allStorage()
    }
})

focusedPicture.addEventListener('click', () => {
    lightbox.classList.add('active')
    const img = document.createElement('img')
    img.src = focusedPicture.children[1].src
    while (lightbox.firstChild) {
        lightbox.removeChild(lightbox.firstChild)
    }
    lightbox.appendChild(img)
})

lightbox.addEventListener('click', (e) => {
    if (e.target !== e.currentTarget) return
    lightbox.classList.remove('active')
})

getProductDetails() 




