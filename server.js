const http = require("http");
const express = require("express");
const logger = require("morgan");
const WebSocket = require("ws");
const cookieParser = require("cookie-parser");
 
const app = express();
const port = 8002;
 
function myMiddleware(req, res, next) {
 
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
app.use(express.static("client"));
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});
 
const server = http.createServer(app);
 
const wss = new WebSocket.Server({ server });
 
let player1 = null;
let player2 = null;
 
wss.on("connection", (ws) => {
  if (!player1) {
    player1 = ws;
    player1.id = "player1";
    console.log("Player 1 connected");
    ws.send(JSON.stringify({ type: "assignRole", role: "player1" }));
 
    if (player2) {
      notifyPlayersAboutConnection();
    }
  } else if (!player2) {
    player2 = ws;
    player2.id = "player2";
    console.log("Player 2 connected");
    ws.send(JSON.stringify({ type: "assignRole", role: "player2" }));
 
    if (player1) {
      notifyPlayersAboutConnection();
    }
  } else {
    console.log("Server is full");
    ws.send(JSON.stringify({ type: "serverFull" }));
    ws.close();
    return;
  }
 
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      forwardMessage(ws, data);
    } catch (err) {
      console.error("Error parsing message:", err);
    }
  });
 
  ws.on("close", () => {
    handleDisconnect(ws);
  });
});
 
function notifyPlayersAboutConnection() {
  player1.send(JSON.stringify({ type: "gameReady" }));
  player2.send(JSON.stringify({ type: "gameReady" }));
  console.log("Both players connected - game ready");
}
 
function forwardMessage(sender, data) {
  if (sender === player1 && player2) {
    player2.send(JSON.stringify({
      type: "playerData",
      from: "player1",
      data: data
    }));
  } else if (sender === player2 && player1) {
    player1.send(JSON.stringify({
      type: "playerData",
      from: "player2",
      data: data
    }));
  }
}
 
function handleDisconnect(ws) {
  if (ws === player1) {
    console.log("Player 1 disconnected");
    player1 = null;
    if (player2) {
      player2.send(JSON.stringify({ type: "opponentDisconnected" }));
    }
  } else if (ws === player2) {
    console.log("Player 2 disconnected");
    player2 = null;
    if (player1) {
      player1.send(JSON.stringify({ type: "opponentDisconnected" }));
    }
  }
}
 
server.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});