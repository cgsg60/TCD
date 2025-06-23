import { Player } from "./render.js"
 
export let pull_player = {};
 
 
export function openWebsocketCommunication() {
  let socket = new WebSocket("ws://46.254.18.237:8002");
  let messageIndex = 0;
 
  socket.onopen = (e) => {
    console.log("Connection established");
    socket.send("Hello from client!");
  };
 
  socket.onmessage = (event) => {
    let datal = JSON.parse(event.data);
    if (datal.type == "playerData") {
      pull_player = datal.data;
      console.log("got:", JSON.stringify(pull_player));
    }
    socket.send(JSON.stringify({ type: "playerData", data: Player }));
    //console.log(`send: ${JSON.stringify(Player)}`);
 
  };
}