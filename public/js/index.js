const carouselSlide = document.querySelector('.carousel-slide')
const carouselImages = document.querySelectorAll('.carousel-slide a') 
const radialBtnsContainer = document.querySelector('.carousel-nav-btns')
const radialBtns = document.querySelectorAll('.carousel-nav-btn')
const prevBtn = document.querySelector('.prev-btn')
const nextBtn = document.querySelector('.next-btn')
const bannerProducts = document.querySelector('.banner-products')


let carouselCounter = 1;
let radialCounter = 0;
let slideInterval = setInterval(moveSlideRight, 5000)
let size = carouselSlide.clientWidth
carouselSlide.style.transform = `translateX(${-size * carouselCounter}px)`

async function fillPopular() { 
    const response = await fetch("products.json")
    const data = await response.json()
    
    let popularity = []

    for (product of data.products) {
        popularity.push([product.id, product.popularity])
    }

    popularity.sort(function(a, b) {
        return b[1] - a[1];
    });

    for (let i = 0; i < 4; i++) {
        let mostPopular = data.products.find(product => product.id == popularity[i][0])
        if (mostPopular.price != mostPopular.prevPrice) {
            bannerProducts.innerHTML += `<a href="/product?id=${mostPopular.id}" class="product"><div class="product-img"><img src="./img/min/${mostPopular.id}-1.webp" alt="${mostPopular.brand} ${mostPopular.model} Thumbnail"></div> <div class="product-text"><p><b>${mostPopular.price}$</b> <span class="prev-price"><b>${mostPopular.prevPrice}$</b></span></p> ${mostPopular.brand} ${mostPopular.model}</div></a>`
        } else {
            bannerProducts.innerHTML += `<a href="/product?id=${mostPopular.id}" class="product"><div class="product-img"><img src="./img/min/${mostPopular.id}-1.webp" alt="${mostPopular.brand} ${mostPopular.model} Thumbnail"></div> <div class="product-text"><p><b>${mostPopular.price}$</b></p> ${mostPopular.brand} ${mostPopular.model}</div></a>`
        }
    }
}

function clearRadials() {
    for (radialBtn of radialBtns) {
        radialBtn.classList.remove('carousel-nav-btn-active')
    }
}

function moveSlideRight() {
    if (carouselCounter >= carouselImages.length - 1) return
    clearRadials()
    carouselSlide.style.transition = "transform 0.6s"
    carouselCounter++
    carouselSlide.style.transform = `translateX(${-size * carouselCounter}px)`
    if (radialCounter == radialBtns.length - 1) {
        radialCounter = 0
        radialBtns[radialCounter].classList.add('carousel-nav-btn-active')
    } else {
        radialBtns[++radialCounter].classList.add('carousel-nav-btn-active')
    }
}

function moveSlideLeft() {
    if (carouselCounter <= 0) return
    clearRadials()
    carouselSlide.style.transition = "transform 0.4s"
    carouselCounter--
    carouselSlide.style.transform = `translateX(${-size * carouselCounter}px)`
    if (radialCounter == 0) {
        radialCounter = radialBtns.length - 1
        radialBtns[radialCounter].classList.add('carousel-nav-btn-active')
    } else {
        radialBtns[--radialCounter].classList.add('carousel-nav-btn-active')
    }
}


prevBtn.addEventListener('click', () => {
    clearInterval(slideInterval)
    moveSlideLeft()
})

nextBtn.addEventListener('click', () => {
    clearInterval(slideInterval)
    moveSlideRight()
})


carouselSlide.addEventListener('transitionend', () => {
    if (carouselImages[carouselCounter].classList.contains('last-clone')) {
        carouselSlide.style.transition = "none"
        carouselCounter = carouselImages.length - 2
        carouselSlide.style.transform = `translateX(${-size * carouselCounter}px)`
    } else if (carouselImages[carouselCounter].classList.contains('first-clone')) {
        carouselSlide.style.transition = "none"
        carouselCounter = carouselImages.length - carouselCounter
        carouselSlide.style.transform = `translateX(${-size * carouselCounter}px)`
    }
})

radialBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        clearRadials()
        clearInterval(slideInterval)
        btn.classList.add('carousel-nav-btn-active')
        carouselSlide.style.transition = "transform 0.4s"
        carouselCounter = btn.id
        radialCounter = carouselCounter - 1
        carouselSlide.style.transform = `translateX(${-size * carouselCounter}px)`
    })
})

window.addEventListener('resize', () => {
    size = carouselSlide.clientWidth
    carouselSlide.style.transform = `translateX(${-size * carouselCounter}px)`
})


fillPopular()