const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mdfhcbd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffees");
    
    // create coffee
    app.post("/coffees", async (req, res) => {
      const newCoffee = req.body;

      const result = await coffeeCollection.insertOne(newCoffee);
      res.send(result)
    });

    // find/get

    app.get('/coffees' , async(req , res)=> {

      const result = await coffeeCollection.find().toArray()
      res.send(result)
      
    })

    // findOne

    app.get('/coffees/:id' , async(req , res)=> {
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(filter)
      res.send(result)
    })

    // delete

    app.delete('/coffees/:id' , async(req , res)=> {

      const id = req.params.id
      const query = {_id: new ObjectId(id)}

      const result = await  coffeeCollection.deleteOne(query)
      res.send(result)
      console.log(result);
      
    })


    // updated

    app.put('/coffees/:id' , async(req , res)=>{

      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const updatedCoffee = req.body

      const updateDoc = {
        $set:  updatedCoffee
         
        
      }

      const result = await coffeeCollection.updateOne(filter , updateDoc)
      res.send(result)
      console.log(result);
      
    })



    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
