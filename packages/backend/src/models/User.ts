import { Schema, model } from "mongoose";
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Password hashing and comparison methods
userSchema.pre("save", async function (next) {
  const user = this as any; // Access user document

  // Hash password if it is being modified or created
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});

// Compare provided password with the hashed one
userSchema.methods.comparePassword = async function (password: string) {
  const user = this as any;
  return await bcrypt.compare(password, user.password);
};

const User = model("User", userSchema);
export default User;
