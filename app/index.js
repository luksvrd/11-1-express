import express from "express";

// Start Express
const app = express();
// Specify the port to listen on, 3000 is the default. A port is a way to identify a specific process on a computer
const port = 3001;

// We want our express app to use the stuff in 'public' as statci assets
// Satic assets are the same for all visitors - nothing personalized or dynamic
// when working with routing, order matters - the first route that matches will be used
app.use(express.static("public"));

// Since theres no 'hello.html' file, we'll send back some HTML
app.use("/hello", (_, res) => res.send("<p>Hello World!</p>"));

// The '_' is a placeholder for the request object, we're only interested in the response object
// The response object is what we send back to the client
// app.get("/", (_, res) => res.send("<h1>Navigate to /send or /routes</h1>"));

// Start the server
app.listen(port, () => console.log(`Example app listening on port 3001!`));
