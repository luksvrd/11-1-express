// import cors because we want to allow cross-origin requests, which are requests from a different domain (e.g. localhost:5173)
import cors from "cors";
// express is a web framework for node, the primary purpose of which is to handle routing and requests
import express from "express";

import petsData from "./db/pets.json" assert { type: "json" };

import reviewsData from "./db/reviews.json" assert { type: "json" };
// import the data from the json file. have to use the 'assert' syntax because we're importing a json file
import termsData from "./db/terms.json" assert { type: "json" };
// UUID is a library that will generate a unique ID for us

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

// app.post(
//   "/api/reviews/",
//   cors({ origin: "http://localhost:5173" }),
//   (req, res) => {
//     console.log(req.body, uuidv4());
//     const newReview = {
//       // Take all of the properties/values from the request body
//       // The spread operator (...) is a way to take all of the properties from an object and add them to a new object while keeping the original object intact
//       ...req.body,
//       // Add a new property called 'review_id' with a value of a new UUID
//       review_id: uuidv4(),
//       // Add a new property called 'upvotes' with a value of 0
//       upvotes: 0,
//     };

// TODO: verify that the request body has all of the required properties
// If not return a 400 status code and a JSON object with an error message. (Client error)
// Use this to create a new review
app.post("/api/reviews", (req, res) => {
  const { product, username, review } = req;

  // TODO: Remove any properties from the body that don't belong
  if (product && username && review) {
    res.json({ message: "Review added!" });
  } else {
    res.status(400).json({ error: "Missing required properties" });
  }

  // TODO: use fs.writefile to write the new review to the reviews.json file
  // if successful, return a 201 status code and a JSON object with a success message
  // if unsuccessful, return a 500 status code and a JSON object with an error message. which means that the server has encountered a situation it doesn't know how to handle (not the client's fault)
});

// TODO: PUT request to upvote a review

app.listen(port, () => {
  console.info("Server running on port 3001");
});
