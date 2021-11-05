const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// use middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://tourSnap:8qVE2rKH9UGv5vTH@cluster0.nz5qt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("tours");
    const packageCollection = database.collection("packages");

    // getting api
    app.get("/packages", async (req, res) => {
      const cursor = packageCollection.find({});
      const packages = await cursor.toArray();
      res.send(packages);
    });

    // post api
    app.post("/addPackage", async (req, res) => {
      const newPackage = req.body;
      const result = await packageCollection.insertOne(newPackage);

      // console.log("hitting the posts", req.body);

      console.log("data paisi", result);

      res.json(result);
    });

    // delete packages
    app.delete("/packages/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await packageCollection.deleteOne(query);

      console.log("this id deleted", result);
      res.json(result);
    });

    // // create a document to insert
    // const doc = {
    //   title: "shamim",
    //   content: "kicchu nai",
    // };
    // const result = await usersCollection.insertOne(doc);
    // console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server running woohoo");
});

app.listen(port, () => {
  console.log("running server on", port);
});

// tourSnap
// 8qVE2rKH9UGv5vTH
