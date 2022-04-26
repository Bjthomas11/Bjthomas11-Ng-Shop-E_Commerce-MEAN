const express = require("express")
const morganLogger = require("morgan")
const mongoose = require("mongoose")


const port = process.env.PORT || 3000;
require('dotenv').config()

const app = express();

const api = process.env.API_URL

// middleware
app.use(express.json())
app.use(morganLogger("tiny"))

const productSchema = mongoose.Schema({
    name: String,
    image: String,
    countInStock: Number
})

const Product = mongoose.model("Product", productSchema)

app.get(`${api}/products`, async (req,res) => {
    const productList = await Product.find()

    if(!productList){
        res.status(500).json({
            success: false
        })
    }
    res.send(productList)
})

app.post(`${api}/products`, (req, res) => {
    const product = new Product({
        name: req.body.name,
        image: req.body.image,
        countInStock: req.body.countInStock
    })

    product.save().then((product) => {
        res.status(201).json(product)
    }).catch((error)=> {
       res.status(500).json({
           error: error,
           success: false
       })
    })
})

mongoose.connect(process.env.DBConnect)

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});


app.listen(port, () => {
    console.log(`Server is running at ${port}`)
})