const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express();
const port =process.env.PORT || 5000;

app.use(cors())

app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PAS}@cluster0.vuwe8k1.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    const brandCollection = client.db("brandShopDB").collection("brand");
    const productsCollection = client.db("brandShopDB").collection("products");
    const cartCollection = client.db("brandShopDB").collection("cart");



    app.get('/brand', async(req,res) =>{
        const cursor = brandCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })
    app.get('/brand/:id', async(req,res) =>{
        const id = req.params.id
        const query = { _id: new ObjectId(id)}
        const result = await brandCollection.findOne(query)
        res.send(result)
    })
    app.get('/products:id', async(req,res) =>{
        const id = req.params.id
        const filters = { _id: new ObjectId(id)}
        const brandResult = await brandCollection.findOne(filters)

        const query = {brand: (brandResult.name).toUpperCase()}
        const result = await productsCollection.find(query).toArray()
        res.send(result)
    })
    app.get('/products', async(req,res) =>{
        const cursor = productsCollection.find()
        const result = await cursor.toArray()
        res.send(result)
    })


    app.get('/details/:id', async(req,res) =>{
      const id = req.params.id
      const query = { _id: new ObjectId(id)}
      const result = await productsCollection.findOne(query)
      console.log(id)
      res.send(result)
    })

    app.get('/cart', async(req, res) => {
      const cursor = cartCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })



    app.get('/cart/:id', async(req, res) =>{
      const id = req.params.id
      const query = { _id: new ObjectId(id)}
      const result = await cartCollection.findOne(query)
      res.send(result)
    })


    app.post('/brand', async(req,res) =>{
        const brands = req.body
        const result = await brandCollection.insertOne(brands)
        res.send(result)
    })
    app.post('/products', async(req,res) =>{
        const product = req.body
        const result = await productsCollection.insertOne(product)
        res.send(result)
    })
    
    

    app.post('/cart', async(req, res) =>{
      const cart = req.body
      const result = await cartCollection.insertOne(cart)
      res.send(result)
      
    })


    app.put('/products/:id', async(req,res) =>{
      const id = req.params.id
      const product = req.body

      const filter = { _id: new ObjectId(id)};
      const options = { upsert: true };
      const updateProduct = {
        $set: {
          name:product.name,
          brand:product.brand,
          category:product.category,
          price:product.price,
          description:product.description,
          photo: product.photo,
          rating: product.rating
        },

      };
      const result = await productsCollection.updateOne(filter, updateProduct, options);
      res.send(result)
    })

    app.delete('/cart/:id', async(req, res) =>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await cartCollection.deleteOne(query)
      res.send(result)
    })


  app.get('/', (req, res) => {
    res.send('Hello, this is your brand shop!');
  });
    


  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })


  
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);


