const http = require("http");
const express = require("express");
const logger = require("morgan");
const WebSocket = require("ws");
const cookieParser = require("cookie-parser");

const app = express();
const port = 8002;

function myMiddleware(req, res, next) {

  req.url = '../client/client.js'
  console.log(`Request for ${req.url}`);
  next();
}

app.use(myMiddleware);
app.use(logger("dev"));
app.use(cookieParser());

app.use(function (req, res, next) {
  // check if client sent cookie
  var cookie = req.cookies.cookieName;
  if (cookie === undefined) {
    // no: set a new cookie
    var randomNumber = Math.random().toString();
    randomNumber = randomNumber.substring(2, randomNumber.length);
    res.cookie('cookieName', randomNumber, { maxAge: 900000, httpOnly: false });
    console.log('cookie created successfully');
  } else {
    // yes, cookie was already present 
    console.log('cookie exists', cookie);
  }
  next(); // <-- important!
});
app.use(express.static("."));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  let messageIndex = 0;
  console.log("Connection opened");
  ws.on("message", (message) => {
    console.log(`message received: ${message}`);
    ws.send(`Hello again from server ${messageIndex}`);
    messageIndex++;
  });

  ws.send("Hello from server");
});

// app.get("/", (req, res) => {
//   res.send("Hello world!");
// });

server.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});