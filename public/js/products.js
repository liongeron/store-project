
const products = document.querySelector('.products')
const title = document.querySelector('.products-title')

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

function filler(product) {
    if (product.price != product.prevPrice) {
        products.innerHTML += `<a href="/product?id=${product.id}" class="product"><div class="product-img"><img src="../img/min/${product.id}-1.webp" alt="${product.brand} ${product.model}"></div>
        <div class="product-text"><p><b>${product.price}$</b> <b><span class="prev-price">${product.prevPrice}$</span></b></p> ${product.brand} ${product.model}</div></a>` 
    } else {
        products.innerHTML += `<a href="/product?id=${product.id}" class="product"><div class="product-img"><img src="../img/min/${product.id}-1.webp" alt="${product.brand} ${product.model}"></div>
        <div class="product-text"><p><b>${product.price}$</b></p> ${product.brand} ${product.model}</div></a>`
    }
}


function handleSearch(data) {
    let searchParams = urlParams.get('search').split(" ")
    let foundProducts = []
    for (param of searchParams) {
        data.products.filter(entry => {
            if (entry.brand.toLowerCase().includes(param.toLowerCase())) {
                foundProducts.push(entry)
            } else if (entry.model.toLowerCase().includes(param.toLowerCase())) {
                foundProducts.push(entry)
            } else if (entry.category.toLowerCase().includes(param.toLowerCase())) {
                foundProducts.push(entry)
            }
        });
    }
    if (foundProducts.length) {
        if (searchParams.length > 1) {
            let match = (foundProducts.filter((element, index, array) => array.indexOf(element) !== index))
            if (match.length) {
                filler(match[0])
                title.innerHTML = `<h1>Results for ${urlParams.get('search')}</h1>`
            } else {
                title.innerHTML = `<h1>Couldn't find '${urlParams.get('search')}'</h1>`
            }
        } else {
            for (product of foundProducts) {
                filler(product)
                title.innerHTML = `<h1>Results for ${urlParams.get('search')}</h1>`
            }
        }
    } else {
        title.innerHTML = `<h1>Couldn't find '${urlParams.get('search')}'</h1>`
    }
}


function handleCategory(data) {
    if (urlParams.has('brand')) {
        data.products.filter(entry => {
            if (entry.category == urlParams.get('category') && entry.brand.toLowerCase() == urlParams.get('brand')) {
                filler(entry)
            }
        });
        title.innerHTML = `<h1>Results for ${urlParams.get('category')}, ${urlParams.get('brand')}</h1>`
    } else if (urlParams.has('type')) {
        data.products.filter(entry => {
            if (entry.category == urlParams.get('category') && entry.type.toLowerCase() == urlParams.get('type')) {
                filler(entry)
            }
        });
        title.innerHTML = `<h1>Results for ${urlParams.get('category')}, ${urlParams.get('type')}</h1>`
    } else {
        data.products.filter(entry => {
            if (entry.category == urlParams.get('category')) {
                filler(entry)
            }
        });
        title.innerHTML = `<h1>Results for ${urlParams.get('category')}</h1>`
    }
}


function handleBrand(data) {
    data.products.filter(entry => {
        if (entry.brand.toLowerCase() == urlParams.get('brand')) {
            filler(entry)
        }
    });
    title.innerHTML = `<h1>Results for ${urlParams.get('brand')}</h1>`
}

function handleSale(data) {
    data.products.filter(entry => {
        if (entry.onsale == "yes") {
            products.innerHTML += `<a href="/product?id=${entry.id}" class="product"><div class="product-img"><img src="../img/min/${entry.id}-1.webp" alt="${entry.brand} ${entry.model} Thumbnail"></div>
            <div class="product-text"><p><b>${entry.price}$</b> <b><span class="prev-price">${entry.prevPrice}$</span></b></p> ${entry.brand} ${entry.model}</div></a>`
        }
    });
    title.innerHTML = `<h1>Sale</h1>`
}


function handleAll(data) {
    for (product of data.products) {
        filler(product)
    }
    title.innerHTML = `<h1>All products</h1>`
}

async function getProducts() {
    const response = await fetch("products.json")
    const data = await response.json()

    if (urlParams.has('search')) {
        handleSearch(data)
    } else if (urlParams.has('category')) {
        handleCategory(data)
    } else if (urlParams.has('brand') && !urlParams.has('category')) {
        handleBrand(data)
    } else if (urlParams.has('sale')) {
        handleSale(data)
    } else {
        handleAll(data)
    }
}

getProducts()
