import mongoose from "mongoose";

const nodeSchema = new mongoose.Schema({
  id: String,
  type: String,
  position: {
    x: Number,
    y: Number,
  },
  data: {
    label: String,
  },
});

const edgeSchema = new mongoose.Schema({
  id: String,
  source: String,
  target: String,
  data: {
    label: String,
  },
});

const workflowSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    dockerId: { type: String },
    status: { type: Boolean, default: false },
    nodes: { type: [], default: [] },
    edges: { type: [], default: [] },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const Workflow = mongoose.model("Workflow", workflowSchema);

export default Workflow;
