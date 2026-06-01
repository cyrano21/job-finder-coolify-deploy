import { Schema, models, model } from "mongoose";

const coverLetterSchema = new Schema(
  {
    userId: { type: String, required: true }, // Changé de ObjectId à String pour Clerk
    title: String,
    company: String,
    position: String,
    date: String,
    content: String,
    tone: String,
    language: String,
  },
  { timestamps: true }
);

export default models.CoverLetter || model("CoverLetter", coverLetterSchema);
