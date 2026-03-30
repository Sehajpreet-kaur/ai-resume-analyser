import mongoose from "mongoose";
 
// Stores invalidated JWT tokens (logout blacklist).
// TTL index auto-removes expired entries so the collection stays lean.
const sessionSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // MongoDB TTL: delete doc when expiresAt is reached
  },
});
 
const Session = mongoose.model("Session", sessionSchema);
export default Session;