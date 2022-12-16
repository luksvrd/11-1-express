// express is a web framework for Node.js that makes it easy to create a web server. It's a way to create a server that can respond to requests
import express from "express";
// Must specify this is JSON otherwise it will be treated as a string because it's not a .js file
import terms from "./db/terms.json" assert { type: "json" };

// Start Express
const app = express();
// Specify the port to listen on, 3000 is the default. A port is a way to identify a specific process on a computer
const port = 3001;

// this is a file that will be served up when the user goes to the root of the site.
app.get("/api", (req, res) => {
  res.json(terms);
});

app.listen(port, () => console.log(`Example app listening on port 3001!`));
