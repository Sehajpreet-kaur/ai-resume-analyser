import mongoose from "mongoose";

const kvSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    key: { type: String, required: true, trim: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    expiresAt: { type: Date, default: null }, // null = never expires
  },
  { timestamps: true }
);

// Compound unique: each user owns a unique key
kvSchema.index({ owner: 1, key: 1 }, { unique: true });
// TTL on expiresAt (sparse so null entries are ignored)
kvSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0, sparse: true });

const KV = mongoose.model("KV", kvSchema);
export default KV;