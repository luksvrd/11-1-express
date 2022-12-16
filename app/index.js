// express is a web framework for Node.js that makes it easy to create a web server. It's a way to create a server that can respond to requests
import express from "express";
// Must specify this is JSON otherwise it will be treated as a string because it's not a .js file
import termsData from "./db/terms.json" assert { type: "json" };
// Terms data is an array and because its an array we  can use the 'find' method to find a specific term. And we can compare that term to the term we are looking for.

// Start Express
const app = express();
// Specify the port to listen on, 3000 is the default. A port is a way to identify a specific process on a computer
const port = 3001;

// TODO: Use Query Parameters to allow an option to SORT the terms asending or descending
// this is a file that will be served up when the user goes to the root of the site.
app.get("/api/terms", (req, res) => {
  // 'req.query' is an object that comes from the '?student=josh'
  // This will be either 'asc' or 'desc'
  const { sort } = req.query;

  let ret;

  switch (sort) {
    case "asc":
      // a.term.localeCompare(b.term) will return a number. If a is greater than b, it will return a positive number. If a is less than b, it will return a negative number. If they are equal, it will return 0.
      // this is sorting a to z
      ret = termsData.sort((a, b) => a.term.localeCompare(b.term));
      break;
    case "desc":
      // localeCompare is a method that will compare two strings and return a number. If the first string is greater than the second, it will return a positive number. If the first string is less than the second, it will return a negative number. If they are equal, it will return 0.
      // This is sorting z to a
      ret = termsData.sort((a, b) => b.term.localeCompare(a.term));
      break;
    default:
      ret = termsData;
  }

  res.json(ret);
});

/ The ':' represents a DYNAMIC PARAMETER. (e.g. '/api/terms/WHATEVERIWANT')
// We can see the name of this parameter as a key in the 'req.params.'
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

app.listen(port, () => {
  console.info("Server running on port 3001");
});