  const express = require('express');
  const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

  const cors = require('cors');
  const app = express();
  require('dotenv').config()
  const port = process.env.PORT || 5000;

//   middleware
app.use(cors());
app.use(express.json());

 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.of1ofap.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db('coffeeDB').collection('coffee')

    app.post('/add', async (req, res) => {
      const data = req.body;
      console.log(data);
      const result = await coffeeCollection.insertOne(data);
      res.send(result)
    });

    app.get('/coffee', async (req, res) => {
       
      const result = await coffeeCollection.find().toArray();
      res.send(result)
    });

    app.delete('/coffee/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.deleteOne(query);
      res.send(result)
    });

    app.get('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await coffeeCollection.findOne(query);
      res.send(result);
    });

    app.put('/coffee/:id', async (req, res) => {
      const id = req.params.id;
      const updatedCoffee = req.body;
      const  filter = {_id : new ObjectId(id)};
      const options = {upsert: true}
      const coffee = {
        $set: {
           name :updatedCoffee.name,
            chef :updatedCoffee.chef,
            Supplier :updatedCoffee.Supplier,
            Taste :updatedCoffee.Taste,
            Category :updatedCoffee.Category,
            Details :updatedCoffee.Details,
            Photo:   updatedCoffee.Photo

        }
      };
      const result = await coffeeCollection.updateOne(filter, coffee, options );
      res.send(result)

    })
     
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('coffee shop is running ...');
});

app.listen(port, () => {
    console.log(`coffee shop is running on ${port}`);
})