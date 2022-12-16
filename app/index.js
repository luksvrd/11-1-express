import express from "express";

// Start Express
const app = express();
// Specify the port to listen on, 3000 is the default. A port is a way to identify a specific process on a computer
const port = 3001;

// This is a route, it's a way to define a path that the server will respond to
app.get("/", (_, res) => {
  // This is the response, it's what the server will send back to the client
  res.send(
    `<p>API - An application programming interface, is a computing interface that defines interactions between multiple software intermediaries</p>`
  );
});

app.get("/api", (_, res) => {
  // This is the most modern use of JSON, but it's not supported by IE
  // .Json is basically a way to send data to the client in a way that is easy to parse
  // res.json() is a method that will send the data as JSON, otherwise it will send it as a string
  res.json({
    term: "api",
    description:
      "An application programming interface, is a computing interface that defines interactions between multiple software intermediaries",
  });
});

app.listen(port, () => console.log(`Example app listening on port 3001!`));
