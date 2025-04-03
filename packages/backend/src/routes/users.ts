import { Hono } from 'hono';
import { checkRateLimit } from '../services/rateLimit'; // Assuming you have rate limit service
import User from '../models/User'; // Assuming you have a User model
const jwt = require('jsonwebtoken'); // For JWT token generation and verification
const bcrypt = require('bcrypt') // For password hashing

const users = new Hono();

// Example: Register a new user
users.post('/register', async (c) => {
  const { username, email, password } = await c.req.json();
  
  // Validation (just an example)
  if (!username || !email || !password) {
    return c.json({ error: 'Missing required fields' }, 400); // Bad Request
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = new User({ username, email, password: hashedPassword });
  await newUser.save();

  return c.json({ message: 'User created successfully', user: newUser });
});

// Example: Login user
users.post('/login', async (c) => {
  const { email, password } = await c.req.json();
  
  const user = await User.findOne({ email });
  
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  // Compare password with the hashed one in the database
  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    return c.json({ error: 'Invalid password' }, 401);
  }

  // Generate a token (you can use JWT or any token generation method)
  const token = jwt.sign({ userId: user._id }, 'your-jwt-secret', { expiresIn: '1h' });

  return c.json({ message: 'Login successful', token });
});

// Example: Fetch user profile
users.get('/profile', async (c) => {
  const token = c.req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return c.json({ error: 'No token provided' }, 401); // Unauthorized
  }

  try {
    // Verify token and fetch user profile
    const decoded = jwt.verify(token, 'your-jwt-secret') as { userId: string }; // Decode JWT
    const user = await User.findById(decoded.userId);

    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json({ user });
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 401); // Unauthorized
  }
});

// Example: Rate limit middleware
users.use(async (c, next) => {
  const ip = c.req.header('X-Forwarded-For') || c.req.header('Remote-Addr') || 'unknown'; // Get IP from headers
  const allowed = await checkRateLimit(ip);

  if (!allowed) {
    return c.json({ error: 'Rate limit exceeded' }, 429); // 429 Too Many Requests
  }

  await next(); // Continue to the next middleware or route handler
});

export default users;
