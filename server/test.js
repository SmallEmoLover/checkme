const { MongoClient } = require("mongodb");

const uri =
  "mongodb://127.0.0.1:27017/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

const database = client.db('test');

const smth = database.collection('smth');

smth.findOne({}).then((value) => console.log(value)).finally(() => client.close());
