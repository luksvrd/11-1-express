// express is a web framework for Node.js that makes it easy to create a web server. It's a way to create a server that can respond to requests
import express from "express";
// Must specify this is JSON otherwise it will be treated as a string because it's not a .js file
import terms from "./db/terms.json" assert { type: "json" };

// Start Express
const app = express();
// Specify the port to listen on, 3000 is the default. A port is a way to identify a specific process on a computer
const port = 3001;

// this is a file that will be served up when the user goes to the root of the site.
app.get("/api/terms", (_, res) => {
  res.json(terms);
});

// TODO: add a route for /api/terms/:id so I can get back on specific term

// the difference between '/' and '/:term' is that the ':' represents a dynamic parameter. (e.g. 'api/terms/Whatever)
app.get("/api/terms/:term", (req, res) => {
  // we can see the name of this parameter as a key in the req.params object
  // TODO: get the desired term from the req.params object
  const { terms } = req.params;
  console.log(req.params);
  res.json(terms);
});

// using consloe.info instead of console.log because it's a more permanent log, saved in the console
app.listen(port, () => console.info(`Example app listening on port 3001!`));
