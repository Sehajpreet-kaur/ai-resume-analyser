import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalName: { type: String, required: true },
    storedName: { type: String, required: true },   // filename on disk / cloud
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },          // bytes
    url: { type: String, default: "" },              // public URL if hosted
    path: { type: String, required: true },          // server-side path
    isPublic: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const File = mongoose.model("File", fileSchema);
export default File;