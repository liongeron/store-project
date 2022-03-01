require('dotenv').config()
const express = require("express")
const app = express()
app.listen(3000)
app.use(express.json())
app.use(express.static('public'));




const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

app.post("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: req.body.items.map(item => {
                return {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: item.name
                        },
                        unit_amount: item.price * 100
                    },
                    quantity: item.quantity
                }
            }),
            success_url: `${process.env.SERVER_URL}/`,
            cancel_url: `${process.env.SERVER_URL}/`
        })
        res.json({url: session.url})
    } catch (e) {
        res.status(500).json({error: e.message})
    }
})



app.get('/', function (req, res) {
    res.sendFile( __dirname + "/public/" + "index.html" );
})


app.get('/all', function (req, res) {
    res.sendFile( __dirname + "/public/" + "products.html" );
})


app.get('/product', function (req, res) {
    res.sendFile( __dirname + "/public/" + "product-details.html" );
})

app.get('/search', function (req, res) {
    res.sendFile( __dirname + "/public/" + "products.html" );
})

app.get('/cart', function (req, res) {
    res.sendFile( __dirname + "/public/" + "cart.html" );
})

