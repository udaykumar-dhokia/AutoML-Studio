import { type } from "node:os";
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
          icon: "FileSpreadsheet",
          dataSchema: {
            datasetId: { type: "string", required: true, label: "Dataset ID" },
          },
        },
        {
          label: "Preprocessing Node",
          description: "Node for data cleaning and transformation",
          category: "Preprocessing",
          type: "preprocessing",
          icon: "FileEditIcon",
          dataSchema: {
            datasetId: { type: "string", required: true, label: "Dataset ID" },
            operation: {
              type: "string",
              required: true,
              enum: [
                "Handle Missing Values",
                "Handle Outliers",
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
          icon: "BrainCircuit",
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
        {
          label: "Train Test Split",
          description: "Split dataset into training and testing sets",
          category: "Splitting",
          type: "trainTestSplit",
          icon: "Split",
          dataSchema: {
            testSize: {
              type: "number",
              required: true,
              label: "Test Size (0-1)",
              min: 0.1,
              max: 0.9,
              step: 0.1,
              default: 0.2,
            },
            randomState: {
              type: "number",
              required: false,
              label: "Random State",
              default: 42,
            },
          },
        },
        {
          label: "Data Visualisation Node",
          description: "Node for visualising the data",
          category: "Visualisation",
          type: "dataVisualisation",
          icon: "ChartLine",
          dataSchema: {
            datasetId: { type: "string", required: true, label: "Dataset ID" },
          },
        },
        {
          label: "Comment Node",
          description: "Node for adding comments",
          category: "Comment",
          type: "comment",
          icon: "NotebookPen",
          dataSchema: {
            comment: { type: "string", required: true, label: "Comment" },
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
