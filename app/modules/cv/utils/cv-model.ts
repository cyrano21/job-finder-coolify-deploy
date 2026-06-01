import { Schema, models, model } from "mongoose";

const sectionSchema = new Schema({
  title: String,
  content: String,
});

const cvSchema = new Schema(
  {
    userId: { type: String, required: true }, // Changé de ObjectId à String pour Clerk
    title: String,
    template: String,
    personalInfo: {
      firstName: String,
      lastName: String,
      title: String,
      email: String,
      phone: String,
    },
    sections: [sectionSchema],
  },
  { timestamps: true }
);

export default models.CV || model("CV", cvSchema);
