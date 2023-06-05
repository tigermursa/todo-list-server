const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.use(cors());
app.use(express.json());
// MONGODB CODE >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const { MongoClient, ServerApiVersion } = require("mongodb");
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
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     // await client.connect();

   
//   } finally {
//     // Ensures that the client will close when you finish/error
//     // await client.close();
//     }
    const theCollection = client.db("todo").collection("todo-list");

    // app.get("/name", async (req, res) => {
    //   const result = await theCollection.find().toArray();
    //   res.send(result);
    // });
        //1. POST/CREATE FROM HERE...
    app.post("/users", async (req, res) => {
        const user = req.body;
        console.log("new user", user);
        const result = await theCollection.insertOne(user);
        res.send(result);
      });
      //2.  GET /READ FROM HERE......
      app.get("/users", async (req, res) => {
        const cursor = theCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      });
  
      //3. UPDATE FROM HERE .....................................................,,
      app.get("/users/:id", async (req, res) => {
        const id = req.params.id;
        console.log("updating ", id);
        const query = { _id: new ObjectId(id) };
        const result = await theCollection.findOne(query);
        res.send(result);
      });
  
      // updating put code  .....
      app.put("/users/:id", async (req, res) => {
        const id = req.params.id;
        const user = req.body;
        console.log("updating ", id);
        const filter = { _id: new ObjectId(id) };
        const options = { upsert: true };
        const updatedUser = {
          $set: {
            name: user.name,
            email: user.email,
            photo: user.photo,
          },
        };
        const result = await theCollection.updateOne(
          filter,
          updatedUser,
          options
        );
        res.send(result);
      });
  
      //4. DELETE FROM HERE .....
      app.delete("/users/:id", async (req, res) => {
        const id = req.params.id;
        console.log("deleting ", id);
        const query = { _id: new ObjectId(id) };
        const result = await theCollection.deleteOne(query);
        res.send(result);
      });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("ema jhon runninng ");
});
// starting the server>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
app.listen(port, () => {
  console.log(` the server running at the ${port} port`);
});

// install the 7 brothers
// npm init --y
// npm i express
// npm i nodemon
// npm i cors
// npm i mongodb
// npm i dotenv
// npm i jsonwebtoken
// and "start" ="nodemon index"

// .env file = DB_USER=ema-jhon /n DB_PASS=10EqeKGlL11G7wby
// .gitignore = nose_modules /n .env
// DONT FORGET TO IMPORT OBJECT ID FROM MONGO const { ObjectId } = require("mongodb");