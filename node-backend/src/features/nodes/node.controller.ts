import { httpStatus } from "../../utils/httpStatus";
import Node from "./node.model";

const nodeController = {
  getNodes: async (req, res) => {
    try {
      const nodes = await Node.find({});
      res.status(httpStatus.OK).json(nodes);
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error fetching nodes", error });
    }
  },
  seedNodes: async (req, res) => {
    try {
      const standardNodes = [
        {
          label: "Dataset Node",
          description: "Input node for loading datasets",
          category: "Dataset",
          type: "dataset",
          dataSchema: {
            datasetId: { type: "string", required: true, label: "Dataset ID" },
          },
        },
        {
          label: "Preprocessing Node",
          description: "Node for data cleaning and transformation",
          category: "Preprocessing",
          type: "preprocessing",
          dataSchema: {
            datasetId: { type: "string", required: true, label: "Dataset ID" },
            operation: {
              type: "string",
              required: true,
              enum: [
                "Handle Missing Values",
                "Handle Outliers",
                "Feature Scaling",
                "Feature Selection",
                "Normalization",
                "Standardization",
                "No Operation",
              ],
              label: "Operation",
            },
            column: { type: "string", required: false, label: "Target Column" },
          },
        },
        {
          label: "Model Node",
          description: "Machine Learning model node",
          category: "Model",
          type: "model",
          dataSchema: {
            datasetId: { type: "string", required: true, label: "Dataset ID" },
            model: {
              type: "string",
              required: true,
              enum: [
                "Random Forest",
                "Linear Regression",
                "Logistic Regression",
                "Decision Tree",
                "Naive Bayes",
                "Support Vector Machine",
                "K-Nearest Neighbors",
                "Gradient Boosting",
                "XGBoost",
              ],
              label: "Model",
            },
            hyperparameters: {
              type: "object",
              required: false,
              label: "Hyperparameters",
            },
          },
        },
      ];

      for (const node of standardNodes) {
        await Node.updateOne(
          { type: node.type },
          { $set: node },
          { upsert: true }
        );
      }

      res.status(httpStatus.OK).json({ message: "Nodes seeded successfully" });
    } catch (error) {
      res
        .status(httpStatus.INTERNAL_SERVER_ERROR)
        .json({ message: "Error seeding nodes", error });
    }
  },
};

export default nodeController;
