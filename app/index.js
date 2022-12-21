// import cors because we want to allow cross-origin requests, which are requests from a different domain (e.g. localhost:5173)
import cors from "cors";
// express is a web framework for node, the primary purpose of which is to handle routing and requests
import express from "express";

import petsData from "./db/pets.json" assert { type: "json" };
// import the data from the json file. have to use the 'assert' syntax because we're importing a json file
import reviewsData from "./db/reviews.json" assert { type: "json" };
// UUID is a library that will generate a unique ID for us
import { v4 as uuidv4 } from "uuid";
import termsData from "./db/terms.json" assert { type: "json" };

import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

console.log(path.dirname(fileURLToPath(import.meta.url)));

// Start express
const app = express();
// the purpose of setting a port is so that we can run multiple servers on our computer at the same time
const port = 3001;

// This is a middleware function that will run on every request
// app.get() is a function that will run when a GET request is made to the server
// requests are objects & response is how we send data back to the client
app.get("/api/terms", cors({ origin: "http://localhost:5173" }), (req, res) => {
  // 'req.query' is an object that comes from the '?student=josh'
  // This will be either 'asc' or 'desc'
  const { sort } = req.query;

  let ret;

  // This is a switch statement, which is a way to write a bunch of if/else statements
  // The 'sort' variable is the value that we're switching on and the 'case' is the value that we're comparing it to
  switch (sort) {
    case "asc":
      ret = termsData.sort((a, b) => a.term.localeCompare(b.term));
      break;
    case "desc":
      ret = termsData.sort((a, b) => b.term.localeCompare(a.term));
      break;
    default:
      ret = termsData;
  }

  res.json(ret);
});

// The ':' represents a DYNAMIC PARAMETER. (e.g. '/api/terms/WHATEVERIWANT')
// We can see the name of this parameter as a key in the 'req.params.' object
app.get("/api/terms/:term", (req, res) => {
  const { term } = req.params;

  const requestedTerm = termsData.find(
    (t) => t.term.toUpperCase() === term.toUpperCase()
  );

  if (requestedTerm) {
    res.json(requestedTerm);
  } else {
    res.status(404).json({ error: `Term ${term} not found. :(` });
  }
});

// TODO: Create a GET route for all of the pets
// This is a very basic route that will return the petsData. We'll need to add some logic to handle sorting. But this is fundamental to full stack development
app.get("/api/pets", cors({ origin: "http://localhost:5173" }), (_, res) => {
  res.json(petsData);
});

// TODO: GET request for reviews
// "api/reviews" is the path that we're listening for it is a made up route that we're creating
// localhost:5173 is the port that we're listening on and the path is the route that we're listening for. It is a security measure to prevent other people from accessing our data
app.get("/api/reviews", cors({ origin: "http://localhost:5173" }), (_, res) => {
  res.json(reviewsData);
});

// TODO: GET a single review
app.get(
  "/api/reviews/:id",
  cors({ origin: "http://localhost:5173" }),
  (req, res) => {
    // the req.params object is a key/value pair of the dynamic parameters in the route ie. /api/reviews/:id
    // Find the review whose 'review_id' that matches the id from the dynamic parameter in 'req.req.params'
    const { id } = req.params;
    const requestedReview = reviewsData.find((r) => r.review_id === id);
    // TODO: If the review is not found, return a 404 status code and a JSON object with an error message.
    if (requestedReview) {
      res.json(requestedReview);
    } else {
      res.status(404).json({ error: `Review ${id} not found. :(` });
    }
  }
);

// TODO: GET request for a specific review's upvotes
app.get(
  "/api/reviews/:id/upvotes",
  cors({ origin: "http://localhost:5173" }),
  (req, res) => {
    // the req.params object is a key/value pair of the dynamic parameters in the route ie. /api/reviews/:id
    // Find the review whose 'review_id' that matches the id from the dynamic parameter in 'req.req.params'
    const { id } = req.params;
    const requestedReview = reviewsData.find((u) => u.review_id === id);
    if (requestedReview) {
      res.json({ upvotes: requestedReview.upvotes });
    } else {
      res.status(404).json({ error: `Review ${id} not found. :(` });
    }
  }
);

// TODO: POST request to add a review
// the post request is a request that we're making to the server to add a review, it is a made up route that we're creating
// We have to use the 'cors' middleware to parse JSON data from the request body. This is because the request body is a string and we need to parse it into a JavaScript object
// This must be added before the post request
app.use(express.json());

// Post is used when we want to add data to the server, it is a made up route that we're creating
app.post("/api/reviews", async (req, res) => {
  const { product, username, review } = req.body;

  // TODO: Remove any properties from the body that don't belong
  const newReview = {
    ...req.body,
    review_id: uuidv4(),
    upvotes: 0,
  };
  // Try is a way to handle errors. If the code in the try block throws an error, the catch block will run
  // Try is useful for asynchronous code because it will catch errors that are thrown asynchronously
  try {
    // TODO: Remove any properties from the body that don't belong
    // this is a conditional statement that will check if the product, username, and review are true
    if (product && username && review) {
      await fs.writeFile(
        `${path.dirname(fileURLToPath(import.meta.url))}/db/reviews.json`,
        // null and 2 are used to format the JSON file for readability
        JSON.stringify([...reviewsData, newReview], null, 2),
        "utf-8"
      );
      // This status code means that the request was successful and a new resource was created
      res.status(201).json({ status: "success", body: newReview });
    } else {
      // This status code means that the request was unsuccessful because the client didn't provide all of the required properties
      res.status(400).json({ error: "Missing required properties" });
    }
    // a catch block will run if an error is thrown in the try block, it will return a 500 status code and a JSON object with an error message. The server caught the error and handled it
  } catch (err) {
    // This status code means that the request was unsuccessful because of an error on the server
    res.status(500).json({ error: `Something went wrong. ${err.message}` });
  }

  // TODO: Use fs.writeFile to write the new review to the reviews.json file
  // If successful, return a 201 status code with a message
  // If unsuccessful, return a 500 status code with a message
});

// TODO: PUT request to upvote a review
// Put is used when we want to update data on the server, it is a made up route that we're creating

app.listen(port, () => {
  console.info("Server running on port 3001");
});
