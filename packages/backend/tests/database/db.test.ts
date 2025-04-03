import mongoose from 'mongoose';
import { connectDB } from '../../src/config/database'; // You can import your connectDB function if needed

describe('Database connection tests', () => {

  beforeAll(async () => {
    // Connect to MongoDB before the tests
    await connectDB();  // or use `mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-app')`
  });

  test('should connect to the database', async () => {
    const connectionState = mongoose.connection.readyState;
    expect(connectionState).toBe(1); // 1 means connected
  });

  afterAll(async () => {
    await mongoose.disconnect();   // Cleanup MongoDB connection after tests
  });

});
