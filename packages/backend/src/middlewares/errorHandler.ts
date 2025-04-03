import { Hono } from 'hono';
import { cors } from 'hono/cors';
import mongoose from 'mongoose';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { serve } from 'bun';

const app = new Hono();

// Apply CORS middleware with default settings
app.use(cors());

// Add logging and JSON formatting middleware
app.use('*', logger());
app.use('*', prettyJSON());

// Health check endpoint
app.get('/', (c) => c.json({ message: '📖 Notes API is running!' }));

// Error handling middleware
app.onError((err, c) => {
  console.error('Server error:', err);

  // Handle different types of errors
  if (err instanceof mongoose.Error.ValidationError) {
    return c.json({
      error: 'Validation Error',
      details: Object.values(err.errors).map(e => e.message)
    }, 400); // Return 400 Bad Request for validation errors
  }

  if (err instanceof mongoose.Error.CastError) {
    return c.json({
      error: 'Invalid ID Format',
      details: err.message
    }, 400); // Return 400 Bad Request for invalid IDs
  }

  // Default error response for other types of errors
  return c.json({
    error: 'Internal Server Error',
    message: err.message
  }, 500); // Return 500 Internal Server Error for general errors
});

// MongoDB connection (example)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-app')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start the server using Bun's `serve`
const PORT = process.env.PORT || 3001;
serve({
  fetch: app.fetch,
  port: Number(PORT),
});

console.log(`🚀 Server running at http://localhost:${PORT}`);
