export function openWebsocketCommunication() {
  let socket = new WebSocket("ws://localhost:8002");
  let messageIndex = 0;

  socket.onopen = (e) => {
    console.log("Connection established");
    socket.send("Hello from client!");
  };

  socket.onmessage = (event) => {
    console.log(`message received: ${event.data}`);
    setTimeout(() => {
      socket.send(`Hi again from client! ${messageIndex}`);
      messageIndex++;
    }, 0)
  };
}
