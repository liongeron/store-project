const searchBtns = document.querySelectorAll('.search-btn')
const searchInputs = document.querySelectorAll('.search-text')
const contactBtn = document.querySelector('.contact')
const recommended = document.querySelectorAll('.recommended')
const cartCounters = document.querySelectorAll('.cart-counter')
const menuBtn = document.querySelector('.menu-btn')
const mobileNavigation = document.querySelector('.mobile-nav')


menuBtn.addEventListener('click', (e) => {
    mobileNavigation.classList.add('active')
    mobileNavigation.addEventListener('click', (e) => {
        if (e.target.classList.contains('mobile-nav')) {
            mobileNavigation.classList.remove('active')
            document.querySelector('body').classList.remove('overflow-hidden')
        }
    })
    document.querySelector('body').classList.add('overflow-hidden')
})

const expandBtns = document.querySelectorAll('.expand-filter-btn')
    expandBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.target.classList.toggle('active')
            e.target.parentElement.querySelector('.mobile-nav-options-filters').classList.toggle('active')
        })
})


async function handleRecommended() {
    const response = await fetch("products.json")
    
    const data = await response.json()
    
    let popularity = {}

    for (i of recommended) {
        if (i.classList.contains('recommended-acoustic')) {
            for (product of data.products) {
                if (product.category == 'acoustic') {
                    popularity[product.id] = product.popularity
                }
            }
            fillRecommended(popularity, data)
        } else if (i.classList.contains('recommended-electric')) {
            for (product of data.products) {
                if (product.category == 'electric') {
                    popularity[product.id] = product.popularity
                }
            }
            fillRecommended(popularity, data)
        } else if (i.classList.contains('recommended-classical')) {
            for (product of data.products) {
                if (product.category == 'classical') {
                    popularity[product.id] = product.popularity
                }
            }
            fillRecommended(popularity, data)
        } else if (i.classList.contains('recommended-accessories')) {
            for (product of data.products) {
                if (product.category == 'accessories') {
                    popularity[product.id] = product.popularity
                }
            }
            fillRecommended(popularity, data)
        }
    }
}


function getCookies() {
    var pairs = document.cookie.split(";");
    var cookies = {};
    for (var i=0; i<pairs.length; i++){
      var pair = pairs[i].split("=");
      cookies[(pair[0]+'').trim()] = unescape(pair.slice(1).join('='));
    }
    return cookies;
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

function deleteCookie(name) {
    document.cookie = name +'=; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function allStorage() {
    keys = Object.keys(getCookies())
    if (keys[0] != '') {
        let values = [],
        i = keys.length;
        while (i--) {
            if (getCookie(keys[i]) == "") {
                values.push(0);
            } else {
                values.push(parseInt(getCookie(keys[i])));
            }
        }
        let sum = values.reduce((value, a) => value + a);
        cartCounters.forEach(counter => {
            counter.innerHTML = sum
        })
    } else {
        cartCounters.forEach(counter => {
            counter.innerHTML = 0
        })
    }
}


function fillRecommended(popularity, data) {
    let id = (Object.keys(popularity).reduce(function (a, b) { return popularity[a] > popularity[b] ? a : b }))
    const mostPopular = data.products.find(product => product.id == id)
    if (mostPopular.price != mostPopular.prevPrice) { 
        i.innerHTML = `<a href="/product?id=${mostPopular.id}"><img src="./img/min/${mostPopular.id}-1.webp" alt=""></a> <span class="product-price">${mostPopular.price}$ <span class="prev-price">${mostPopular.prevPrice}$</span></span> <span>${mostPopular.brand} ${mostPopular.model}</span>`
    } else {
        i.innerHTML = `<a href="/product?id=${mostPopular.id}"><img src="./img/min/${mostPopular.id}-1.webp" alt=""></a> <span class="product-price">${mostPopular.price}$</span> <span>${mostPopular.brand} ${mostPopular.model}</span>`
    }
    
}


searchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        searchInputs.forEach(input => {
            if (input.value) {
                window.location.replace(`/search?search=${input.value}`);
            } else {
                return
            }
        })
    })
})

searchInputs.forEach(input => {
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (input.value) {
                window.location.replace(`/search?search=${input.value}`);
            } else {
                return
            }
        }
    })
})

contactBtn.addEventListener('click', (e) => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
})


handleRecommended()
allStorage()
