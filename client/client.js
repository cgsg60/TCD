export let push_player, pull_player;


export function openWebsocketCommunication() {
  let socket = new WebSocket("ws://46.254.18.237:8002");
  let messageIndex = 0;

  socket.onopen = (e) => {
    console.log("Connection established");
    socket.send("Hello from client!");
  };

  socket.onmessage = (event) => {
    pull_player = event.data;
    socket.send(push_player);
  };
}
