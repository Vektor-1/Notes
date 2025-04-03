import { WebSocketServer } from 'ws'; // Import WebSocket server from the ws package
import { Context } from 'hono'; // Import Context from Hono

interface ExtendedContext extends Context {
  runtime?: {
    server?: any; // Adjust the type of server as needed
  };
}


export const wss = (c: ExtendedContext) => {
  // Check if the request is a WebSocket upgrade request
  const req = c.req;

  if (req.header('upgrade') !== 'websocket') {
    return new Response('Not a WebSocket request', { status: 400 });
  }

  // Accept WebSocket connection using WebSocketServer (from ws package)
  const ws = new WebSocketServer({ noServer: true });

  ws.on('connection', (socket) => {
    console.log('WebSocket connection opened');

    socket.on('message', (data) => {
      console.log('Received message:', data);
      socket.send('Echo: ' + data);
    });

    socket.on('close', () => {
      console.log('WebSocket connection closed');
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Attach the WebSocket handler to the incoming request
  const server = c.runtime?.server; // Access the underlying Node.js server
  if (!server) {
    throw new Error('Server instance is not available in the runtime context');
  }

server.once('upgrade', (req: import('http').IncomingMessage, socket: import('net').Socket, head: Buffer) => {
    ws.handleUpgrade(req, socket, head, (ws: import('ws').WebSocket) => {
        ws.emit('connection', ws, req);
    });
});

  return new Response('WebSocket handshake completed');
};
