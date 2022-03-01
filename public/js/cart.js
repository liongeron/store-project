const cartProducts = document.querySelector('.cart-products')
const cartPriceContainer = document.querySelector('.cart-price')
const total = document.querySelector('.total')
const deliveryPriceContainer = document.querySelector('.delivery-price')
const itemCounterContainer = document.querySelector('.item-counter')
const cartSummary = document.querySelector('.cart-summary')
const checkoutBtn = document.querySelector('.checkout-btn')

let cartPrice = 0
let itemCounter = 0


let keys = Object.keys(getCookies())
let stockControl = []

async function fillCart() {
    const response = await fetch("products.json")
    const data = await response.json()

    if (keys[0]) {
        data.products.filter(product => { 
            for (let i = 0; i < keys.length; i++){
                if (product.id == keys[i]) {
                    cartProducts.innerHTML += `<div class="cart-row" id="${product.id}"><span class="cart-row-wrap"><div class="cart-img"><a href="/product?id=${product.id}"><img src="./img/min/${product.id}-1.webp" alt="${product.brand} ${product.model}"></a></div><a href="/product?id=${product.id}"><p>${product.brand} ${product.model}</p></a> 
                    <input type="number" max="${product.inStock}" value="${getCookie(keys[i])}" min="1" class="product-counter" id="${product.id}-counter" aria-label="Quantity">
                    <p class="product-price center" id="${product.id}-price">${(product.price * getCookie(keys[i]))}$</p></span><button class="remove-item-btn" value="${product.id}" aria-label="Remove Product"></button></div>`
    
                    let obj = {
                        id: product.id,
                        price: product.price,
                        stock: product.inStock,
                        name: `${product.brand} ${product.model}`
                    }
                    stockControl.push(obj)
                }
            }
        })
        updateTotal()
    } else {
        cartSummary.innerHTML = "Nothing here :(" 
    }

    const productCounters = document.querySelectorAll('.product-counter')
    const removeBtns = document.querySelectorAll('.remove-item-btn')

    productCounters.forEach(counter => {
        counter.addEventListener("keydown", async (e) => {
            if (isNaN(e.key) && e.keyCode != 8) {
                e.preventDefault();
            }
        })
    })

    productCounters.forEach(counter => {
        counter.addEventListener('change', (e) => {
            if (e.target.value == "") {
                e.target.value = 1
            }

            const stock = stockControl.find(x => x.id == e.target.id.split("-")[0]).stock
            const price = stockControl.find(x => x.id == e.target.id.split("-")[0]).price
        
            if (parseInt(e.target.value) > stock) {
                e.target.max = stock
                e.target.value = e.target.max
            }

            let focusedObjectId = e.target.id.split("-")
            focusedObjectId = focusedObjectId[0]
            const priceHolder = document.getElementById(focusedObjectId + '-price')
            priceHolder.innerHTML = (e.target.value * price) + '$'
        
            document.cookie = `${focusedObjectId}=${e.target.value}; SameSite=None; Secure`

            updateTotal()
            allStorage()
        })
        counter.oninput = async (e) => {
            const stock = stockControl.find(x => x.id == e.target.id.split("-")[0]).stock
            const price = stockControl.find(x => x.id == e.target.id.split("-")[0]).price
        
            if (parseInt(e.target.value) > stock) {
                e.target.max = stock
                e.target.value = e.target.max
            }

            let focusedObjectId = e.target.id.split("-")
            focusedObjectId = focusedObjectId[0]
            const priceHolder = document.getElementById(focusedObjectId + '-price')
            priceHolder.innerHTML = (e.target.value * price) + '$'
        }
    })

    removeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            let id = e.target.value
            document.getElementById(id).remove()
            deleteCookie(id)
            stockControl = stockControl.filter(function(obj) {
                return obj.id != id;
            });
            keys = Object.keys(getCookies())
            cartPrice = 0
            allStorage()
            if (!keys[0]) {
                cartSummary.innerHTML = "Nothing here :(" 
            } else {
                updateTotal()
            }
        })
    })

}


function updateTotal(){
    itemCounter = 0
    cartPrice = 0
    const productCounters = document.querySelectorAll('.cart-products .product-counter')
    for (data of stockControl) {
        cartPrice += data.price * getCookie(data.id)
    }
    for (productCount of productCounters) {
        if(productCount.value != "")
        itemCounter += parseInt(productCount.value)
    }
    itemCounterContainer.innerHTML = itemCounter + ' items'
    cartPriceContainer.innerHTML = cartPrice + '$'
    if (cartPrice > 200) {
        deliveryPriceContainer.innerHTML = 'Free!'
    } else {
        deliveryPriceContainer.innerHTML = '20$'
        cartPrice += 20
    }
    total.innerHTML = cartPrice + '$'
}


checkoutBtn.addEventListener('click', () => {
    const purchasedProducts = Object.keys(getCookies())
    let cart = []

    for (product of purchasedProducts) {
        cart.push({
            id: product,
            quantity: getCookie(product),
            name: stockControl.find(x => x.id == product).name,
            price: stockControl.find(x => x.id == product).price
        })
    }

    if (cartPrice < 200) {
        let delivery = {
            id: 9999,
            quantity: 1,
            name: 'Delivery',
            price: 20
        }
        cart.push(delivery)
    }

    fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            items: cart
        })
    }).then(res => {
        if (res.ok) return res.json()
        return res.json().then(json => Promise.reject(json))
    }).then(({ url }) => {
        window.location = url
    }).catch(e => {
        console.error(e.error)
    })

})


fillCart()

