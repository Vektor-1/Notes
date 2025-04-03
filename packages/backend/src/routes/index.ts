// routes/index.ts
import { Hono } from 'hono';
import usersRoutes from './users'; // Import user routes
import notesRoutes from './notes'; // Assuming you have a `notes.ts` file for note routes

const app = new Hono();

// Combine all routes here
app.route('/api/users', usersRoutes);  // Mount the users routes at /api/users
app.route('/api/notes', notesRoutes);  // Mount the notes routes at /api/notes

export default app;

// Start the server
app.fire();