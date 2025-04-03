import { Hono } from 'hono';
import { serve } from 'bun';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import { cors } from 'hono/cors';
import { checkRateLimit } from '../services/rateLimit';

const app = new Hono();

app.use('*', logger());
app.use('*', prettyJSON());
app.use(cors({ origin: '*' }));

// Rate limiting middleware
app.use(async (c, next) => {
  // Extract IP address from 'X-Forwarded-For' header, or fallback to the remote address
  const ip = c.req.header('x-forwarded-for') || c.req.raw.headers.get('host') || 'unknown';

  if (!ip) {
    return c.json({ error: 'Unable to determine IP address' }, 400); // Bad Request if no IP found
  }

  const allowed = await checkRateLimit(ip);

  if (!allowed) {
    return c.json({ error: 'Rate limit exceeded' }, 429); // 429 Too Many Requests
  }

  await next(); // Continue to next middleware or route handler
});

// Define routes
app.get('/', (c) => c.json({ message: '📖 Notes API is running!' }));

// Serve the app
const PORT = process.env.PORT || 3001;
serve({
  fetch: app.fetch,
  port: Number(PORT),
});

console.log(`🚀 Server running at http://localhost:${PORT}`);
