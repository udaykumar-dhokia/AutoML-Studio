import mongoose from "mongoose";

const datasetSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    d_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Dataset = mongoose.model("Dataset", datasetSchema);
export default Dataset;
