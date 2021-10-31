const express = require("express");
const { MongoClient, ObjectID } = require("mongodb");
const objectID = require("mongodb").ObjectId;

require("dotenv").config();
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// middle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sfpfh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("TourPackage");
    const serviceCollection = database.collection("services");
    const orderCollection = database.collection("orders");

    // get services api
    app.get("/services", async (req, res) => {
      const cursor = serviceCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    // post api
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit the post api ", service);

      const result = await serviceCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    // get single service
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: objectID(id) };

      const service = await serviceCollection.findOne(query);
      res.json(service);

      //   add orders

      app.post("/orders", async (req, res) => {
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.json(result);
      });
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("asons travel is running");
});

app.listen(port, () => {
  console.log("server running at port", port);
});
