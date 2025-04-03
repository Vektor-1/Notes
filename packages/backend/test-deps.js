const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Test bcrypt functionality
async function testBcrypt() {
  console.log("Testing bcrypt functionality...");
  
  const password = "mySecretPassword123";
  const saltRounds = 10;
  
  try {
    // Hash the password
    const hash = await bcrypt.hash(password, saltRounds);
    console.log("Password hash:", hash);
    
    // Verify the password against the hash (should be true)
    const isMatch = await bcrypt.compare(password, hash);
    console.log("Password verification (correct):", isMatch);
    
    // Verify with incorrect password (should be false)
    const incorrectMatch = await bcrypt.compare("wrongPassword", hash);
    console.log("Password verification (incorrect):", incorrectMatch);
    
    console.log("bcrypt test completed successfully\n");
  } catch (error) {
    console.error("bcrypt test failed:", error);
  }
}

// Test JWT functionality
function testJWT() {
  console.log("Testing JWT functionality...");
  
  const secretKey = "your-secret-key";
  const payload = {
    userId: 123,
    username: "testuser",
    role: "admin"
  };
  
  try {
    // Create a token
    const token = jwt.sign(payload, secretKey, { expiresIn: "1h" });
    console.log("Generated JWT:", token);
    
    // Verify and decode the token
    const decoded = jwt.verify(token, secretKey);
    console.log("Decoded JWT payload:", decoded);
    
    // Attempt to verify with incorrect secret (should throw an error)
    try {
      jwt.verify(token, "wrong-secret-key");
      console.log("JWT verification with wrong key should have failed");
    } catch (err) {
      console.log("JWT verification correctly failed with wrong key:", err.message);
    }
    
    console.log("JWT test completed successfully");
  } catch (error) {
    console.error("JWT test failed:", error);
  }
}

// Run tests
async function runTests() {
  console.log("=== Testing Dependencies ===");
  await testBcrypt();
  testJWT();
  console.log("=== All tests completed ===");
}

runTests();

