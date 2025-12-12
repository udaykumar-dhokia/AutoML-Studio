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
    enum: ["Dataset", "Preprocessing", "Model"],
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
