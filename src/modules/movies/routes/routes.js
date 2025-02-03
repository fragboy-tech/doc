import express from "express";
import { client } from "../../../mongo.js";


const route = express.Router();

const database = client.db("sample_mflix");
const movies_collection = database.collection("movies");

route.get("/title", async (req, res) => {
  const { title } = req.query;

  if (!title) {
    res.json({ success: false, message: "title required" });
  }

  const movie = await movies_collection.findOne({ title: { $eq: title } });

  res.json({ success: true, data: { movie } });
});

route.get("/genre", async (req, res) => {
  let { genre, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  if (!genre) {
    res.json({ success: false, message: "genre required" });
  }

  const query = { genres: { $eq: genre } };

  const movies = await movies_collection
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const movieCount = await movies_collection.countDocuments(query);

  res.json({
    success: true,
    pagination: { total: movieCount, page, limit, totalReturn: limit },
    data: { movies }
  });
});

route.get("/or", async (req, res) => {
  let { genre, page = 1, limit = 10, year } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  year = parseInt(year);

  if (!genre || !year) {
    res.json({ success: false, message: "genre or year required" });
  }

  const query = {
    $or: [{ genre: { $eq: genre } }, { year: { $eq: year } }]
  };

  const movies = await movies_collection
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const movieCount = await movies_collection.countDocuments(query);

  res.json({
    success: true,
    pagination: { total: movieCount, page, limit, totalReturn: limit },
    data: { movies }
  });
});
route.get("/imdb", async (req, res) => {
  let { imdbid } = req.query;

  if (!imdbid) {
    res.json({ success: false, message: "imdb id required" });
  }
  const parsedImdbid = parseInt(imdbid);

  const movie = await movies_collection.findOne({
    "imdb.id": { $eq: parsedImdbid },
  });

  res.json({ success: true, data: movie });
});

route.get("/year", async (req, res) => {
  let { year, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  year = parseInt(year);

  if (!year) {
    res.json({ success: false, message: "year required" });
  }

  const query = { year: { $gt: year } };

  const movies = await movies_collection
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const movieS = await movies_collection.countDocuments(query);

  res.json({
    success: true,
    pagination: { total: movieS, page, limit },
    data: { movies },
  });
});

route.get("/rating", async (req, res) => {
  let { rating, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  rating = parseInt(rating);

  if (!rating) {
    res.json({ success: false, message: "rating required" });
  }

  const query = { "imdb.rating": { $in: [rating] } }

  const movies = await movies_collection
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const movieS = await movies_collection.countDocuments(query);
  

  res.json({
    success: true,
    pagination: { total: movieS, page, limit },
    data: { movies },
  });
});

route.get("/votes", async (req, res) => {
  let { minVotes, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  minVotes = parseInt(minVotes);

  if (!minVotes) {
    res.json({ success: false, message: "minVotes required" });
  }

  const query = { "imdb.votes": { $gt: minVotes } };

  const movies = await movies_collection
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const movieS = await movies_collection.countDocuments(query);

  res.json({
    success: true,
    pagination: { total: movieS, page, limit },
    data: { movies },
  });
});

export { route };