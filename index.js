const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pnaw0g1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

    const serviceCollection = client.db('car-doctor').collection('services');
    const bookingCollection = client.db('car-doctor').collection('bookings');
    // service-collection
    app.get('/services', async(req, res) => {
        const cursor = serviceCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    });
    app.get('/services/:id', async(req, res) => {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const options = {
          projection: { title: 1, price: 1, service_id: 1 }
        };
        const result = await serviceCollection.findOne(query, options);
        res.send(result)
    });
    // booking-collection
    app.post('/bookings', async(req, res) => {
        const booking = req.body;
        console.log(booking);
        // const result = await bookingCollection.insertOne(booking);
        // res.send(result)
        
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
    res.send("Car doctor running on the server");
});
app.listen(port, () => {
    console.log(`car doctor running on the port:${port} `);
});