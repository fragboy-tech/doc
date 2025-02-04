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

route.get("/runtime", async (req, res) => {
  let { maxRuntime, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  maxRuntime = parseInt(maxRuntime);

  if (!maxRuntime) {
    res.json({ success: false, message: "maxRuntime required" });
  }

  const query = { runtime: { $lt: maxRuntime } };

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

route.get("/director", async (req, res) => {
  let { director, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  if (!director) {
    res.json({ success: false, message: "director required" });
  }

  const query = { directors: { $in: [director] } }

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

route.get("/year", async (req, res) => {
  let { year, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  year = parseInt(year);

  if (!year) {
    res.json({ success: false, message: "year required" });
  }

  const query = { year: { $eq: year } };


  const movies = await movies_collection
    .find(query)
    .sort({year: 1})
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

route.get("/limit", async (req, res) => {
  let {  page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const movies = await movies_collection
    .find({})
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const total = await movies_collection.countDocuments({}, {limit})

  res.json({
    success: true,
    pagination: { total, page, limit },
    data: { movies },
  });
});

route.get("/paginate", async (req, res) => {
  let {  page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  const movies = await movies_collection
    .find({})
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const total = await movies_collection.countDocuments({}, {limit})

  res.json({
    success: true,
    pagination: { total, page, limit },
    data: { movies },
  });
});

route.get("/awards", async (req, res) => {
  let { minWins = 2, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  minWins= parseInt(minWins);

  const query = { "awards.wins": { $gt: minWins } };

  const movies = await movies_collection
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const total = await movies_collection.countDocuments(query)

  res.json({
    success: true,
    pagination: { total, page, limit },
    data: { movies },
  });
});

route.get("/language", async (req, res) => {
  let { language, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  if (!language) {
    res.json({ success: false, message: "language required" });
  }

  const query = { languages: { $in: [language] } }

  const movies = await movies_collection
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const total = await movies_collection.countDocuments(query);
  

  res.json({
    success: true,
    pagination: { total, page, limit },
    data: { movies },
  });
});

route.get("/filter", async (req, res) => {
  let { year = 1900, genre = "Action" , page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  year= parseInt(year);

  const query = { $and: [{ genres: genre }, { year: { $gt: year  } }] }

  const movies = await movies_collection
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const total = await movies_collection.countDocuments(query)

  res.json({
    success: true,
    pagination: { total, page, limit },
    data: { movies },
  });
});

route.get("/cast", async (req, res) => {
  let { castMember, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);

  if (!castMember) {
    res.json({ success: false, message: "castMember required" });
  }

  const query = { cast: { $in: [castMember] } }

  const movies = await movies_collection
    .find(query)
    .skip((page - 1) * limit)
    .limit(limit)
    .toArray();

  const total = await movies_collection.countDocuments(query);
  

  res.json({
    success: true,
    pagination: { total, page, limit },
    data: { movies },
  });
});

route.get("/count", async (req, res) => {
  let { genre, limit = 10 } = req.query;

  if (!genre) {
    res.json({ success: false, message: "genre required" });
  }
  const query = {genres: {$eq: genre }}
  const movies = await movies_collection
    .find(query)
    .limit(limit)
    .toArray();

  const total = await movies_collection.countDocuments(query);
  res.json({
    success: true,
    pagination: { total, limit },
    data: { movies },
  });
});

export { route };