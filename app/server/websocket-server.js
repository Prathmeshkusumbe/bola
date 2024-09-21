const WebSocket = require('ws');

// Store connections mapped to user IDs
const clients = new Map();

const port = process.env.WS_PORT || 8080;
//const wss = new WebSocketServer({ port });

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  console.log('New client connected');

  // Associate the user with their WebSocket connection
  ws.on('message', (data) => {
    const parsedData = JSON.parse(data);
    //const { receiver, sender, msgContent, userId } = parsedData;

    console.log(parsedData,'parsedData');

    // Register the user when they connect
    if (parsedData.type === 'register') {
      clients.set(parsedData.userId, ws);
      console.log(`User ${parsedData.userId} registereded.`);
      return;
    }

    if (parsedData?.action === 'newConnectionReq'){
      // Send message to specific user
      if (clients.has(parsedData?.msgs[0].receiver)) {
        clients.get(parsedData?.msgs[0].receiver).send(JSON.stringify(parsedData));
        console.log(`connection req ${parsedData?.msgs[0].receiver} sent.`);
      } else {
        console.log(`User ${parsedData?.msgs[0].receiver} is not connected. ${clients}`);
      }
    }

    // Send message to specific user
    // if (clients.has(receiver)) {
    //   clients.get(receiver).send(JSON.stringify(parsedData));
    //   console.log(`User ${receiver} disconnected.`);
    // } else {
    //   console.log(`User ${receiver} is not connected. ${clients}`);
    // }
  });

  ws.on('close', () => {
    // Clean up when a client disconnects
    clients.forEach((clientWs, sender) => {
      if (clientWs === ws) {
        clients.delete(sender);
        console.log(`User ${sender} disconnected.`);
      }
    });
  });
});

console.log(`WebSocket server is running on ws://localhost:${port}`);

