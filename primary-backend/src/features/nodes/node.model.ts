import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
    required: true,
    enum: ["Dataset", "Preprocessing", "Model", "Splitting"],
  },
  icon: {
    type: String,
    required: true,
    default: "Circle",
  },
  type: {
    type: String,
    required: true,
    unique: true,
  },
  dataSchema: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const Node = mongoose.model("Node", nodeSchema);

export default Node;
