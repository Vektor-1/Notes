import app from '../src/index'; // Adjust to match your file structure
import { connectDB } from '../src/config/database'; // If needed for connection
import redisClient from '../src/config/redis'; // Correct import for Redis
import { ExecutionContext } from 'hono';

beforeAll(async () => {
  await connectDB();
  // Other necessary setup
});

afterAll(async () => {
  try {
    await redisClient.quit();
    console.log('✅ Disconnected from Redis');
  } catch (error) {
    console.error('❌ Redis disconnect error:', error);
  }
});

describe('User API', () => {
  it('should register a new user', async () => {
    const newUser = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    };

    const request = new Request('http://localhost:3001/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    });
    const response = await app.fetch(request);
    const data = (await response.json().catch(() => ({ message: '' }))) as { message: string }; // Explicitly cast to expected type

    expect(response.status).toBe(200);
    expect(data.message).toBe('User created successfully');
  });

  it('should login a user', async () => {
    const loginUser = { email: 'john@example.com', password: 'password123' };
    const request = new Request('http://localhost:3001/api/users/login', { // Corrected endpoint for login
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginUser),
    });
    const response = await app.fetch(request);
    const data = (await response.json().catch(() => ({ message: '' }))) as { message: string }; // Explicitly cast to expected type

    expect(response.status).toBe(200);
    expect(data.message).toBe('Login successful');
  });

  it('should fetch user profile', async () => {
    const token = 'your-test-token'; // Replace with actual token generation if needed

    const request = new Request('http://localhost:3001/api/users/profile', { // Corrected endpoint for profile
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const response = await app.fetch(request);
    const data = await response.json().catch(() => ({})); // Safe JSON parsing

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('name');
  });
});

// Server and database connection setup should happen outside of the test suite, 
// possibly in the application entry point or in a setup script, not inside the tests.
(async () => {
  try {
    await connectDB();  // MongoDB connection
    await redisClient.connect();  // Redis connection
    console.log('✅ Connected to MongoDB & Redis');
  } catch (error) {
    console.error('❌ Error while connecting:', error);
    process.exit(1);
  }

  // Only start the server if not in test environment
  if (process.env.NODE_ENV !== 'test') {
    console.log('🚀 Server running at http://localhost:3001');
    serve({ fetch: app.fetch, port: 3001 });
  }
})();

function serve({ fetch, port }: { fetch: (request: Request, Env?: unknown, executionCtx?: ExecutionContext) => Response | Promise<Response>; port: number; }) {
  throw new Error('Function not implemented.');
}
