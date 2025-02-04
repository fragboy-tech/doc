import { MongoClient } from "mongodb";

const url =
  "mongodb+srv://fragboy0302:dUz6X9hzeILPlL4Z@cluster0.7na3x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(url);

export { client };