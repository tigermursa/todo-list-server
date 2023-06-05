const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.use(cors());
app.use(express.json());
// MONGODB CODE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1nqrclq.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
//important note : remove try function before vercel deploy
async function run() {
  const theCollection = client.db("todo").collection("todo-list");

  // app.get("/name", async (req, res) => {
  //   const result = await theCollection.find().toArray();
  //   res.send(result);
  // });
  //1. POST/CREATE FROM HERE...
  app.post("/task", async (req, res) => {
    const user = req.body;
    console.log("new user", user);
    const result = await theCollection.insertOne(user);
    res.send(result);
  });
  //2.  GET /READ FROM HERE......
  app.get("/task", async (req, res) => {
    const cursor = theCollection.find();
    const result = await cursor.toArray();
    res.send(result);
  });

  //3. UPDATE FROM HERE .....................................................,,
  app.get("/task/:id", async (req, res) => {
    const id = req.params.id;
    console.log("updating ", id);
    const query = { _id: new ObjectId(id) };
    const result = await theCollection.findOne(query);
    res.send(result);
  });

  app.patch("/task/:id", async (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const filter = { _id: new ObjectId(id) };
    const update = { $set: { status } };
    const result = await theCollection.updateOne(filter, update);
    res.send(result);
  });

  //4. DELETE FROM HERE .....
  app.delete("/task/:id", async (req, res) => {
    const id = req.params.id;
    console.log("deleting ", id);
    const query = { _id: new ObjectId(id) };
    const result = await theCollection.deleteOne(query);
    res.send(result);
  });
  // Send a ping to confirm a successful connection
  await client.db("admin").command({ ping: 1 });
  console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("to do running  ");
});
// starting the server>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.listen(port, () => {
  console.log(` the server running at the ${port} port`);
});
