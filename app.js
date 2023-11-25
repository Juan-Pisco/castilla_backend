const express = require('express')

const app = express()

const {Pool} = require('pg')
require('dotenv').config()

const pool = new Pool({
    user: 'default',
    host: "ep-round-truth-17895328-pooler.us-east-1.postgres.vercel-storage.com",
    database: "verceldb",
    password: 'vYKBV0fadW3j',
    port: 5432,
    ssl: {rejectUnauthorized: false},
});

const API_KEY = process.env.API_KEY_USER

const apiKeyValidation = (req, res, next) => {
    const userApiKey = req.get('USER_API_KEY');
    if (userApiKey && userApiKey === API_KEY) {
        next();
    } else {
        res.status(401).send('Llave invalida')
    }
}


const PORT = 701

app.use(express.json())


// POSTGRES_USER="default"
// POSTGRES_HOST="ep-round-truth-17895328-pooler.us-east-1.postgres.vercel-storage.com"
// POSTGRES_PASSWORD="vYKBV0fadW3j"
// POSTGRES_DATABASE="verceldb"

app.use(apiKeyValidation)
app.get('/products', (req, res) => {
    const traerProductos = `SELECT * FROM products`
    pool.query(traerProductos).then(data => {
        console.log('Traemos data', data.rows)
        res.status(200).send(data.rows)
    })
})



app.post('/products', function (req, res) {
    const name = req.body.nameProduct
    const price = req.body.price
    const quantity = req.body.quantity
    const insertarProductos = `INSERT INTO products (nameProduct, price, quantity) VALUES ('${name}', ${price}, ${quantity})`
    pool.query(insertarProductos)
        .then(() => {
            res.status(201).send("El producto se ha registrado correctamente")

        })
        .catch(err => {
            console.error(err)
            res.status(500).send('Hubo un error registrando el producto')
        })
})
module.exports = app;
app.listen(PORT, function () {
    console.log("Servidor corriendo")
})
