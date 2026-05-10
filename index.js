const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri =
  'mongodb://crudServer:8by0Q5mVjdK14JPN@ac-fylx1fh-shard-00-00.sflwpyz.mongodb.net:27017,ac-fylx1fh-shard-00-01.sflwpyz.mongodb.net:27017,ac-fylx1fh-shard-00-02.sflwpyz.mongodb.net:27017/?ssl=true&replicaSet=atlas-ias9m9-shard-0&authSource=admin&appName=Cluster0';

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

    const db = client.db('simpleUsers');
    const userCollection = db.collection('users');

    // GET users
    app.get('/users', async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const user = await userCollection.findOne(query);
      res.send(user);
    })

    // ADD user
    app.post('/users', async (req, res) => {
      const doc = req.body;
      const result = await userCollection.insertOne(doc);
      res.send(result);
    })

    // DELETE user
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = {
        _id: new ObjectId(id)
      }
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })

    await client.db('admin').command({ ping: 1 });

    console.log('MongoDB connected successfully');
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('crud server is running');
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});