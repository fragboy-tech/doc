import { MongoClient } from "mongodb";

const url =
  "mongodb+srv://3nh3e3:nkgs9p3YSonmvT8R@cluster0.awwtm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(url);

export { client };