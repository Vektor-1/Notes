import { Hono } from 'hono';
import { serve } from 'bun';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';

import { connectDB } from './config/database';
import { connectRedis } from './config/redis';
import notesRoutes from './routes/notes';
import { wss } from './ws/websocket'; // Import WebSocket handler

const app = new Hono();

// Middleware
app.use('*', logger());
app.use('*', prettyJSON());
app.use(cors());

// Routes
app.get('/', (c) => c.json({ message: '📖 Notes API is running!' }));
app.route('/api/notes', notesRoutes);

// WebSocket route
app.get('/ws', wss); // This is where the WebSocket server will be accessed

const PORT = process.env.PORT || 3001;

(async () => {
  try {
    await connectDB();  // MongoDB connection
    await connectRedis();  // Redis connection
    console.log('✅ Connected to MongoDB & Redis');

    // Start the HTTP server
    serve({
      fetch: app.fetch,
      port: Number(PORT),
    });

    console.log(`🚀 Server running at http://localhost:${PORT}`);
  } catch (error) {
    console.error('❌ Error during startup:', error);
    process.exit(1); // Exit if there’s an error starting the app
  }
})();

export default app;
