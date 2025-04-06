import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true, 
  },
  image: {
    type: String,
  },
  org_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  }
});

export const Notice = mongoose.model("Notice", noticeSchema);
