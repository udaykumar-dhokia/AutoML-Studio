import { TNode } from "../workflow/workflow.type";

export type TDatasetNode = TNode & {
  type: "dataset";
  datasetId: string;
};

export type TPreprocessingNode = TNode & {
  type: "preprocessing";
  datasetId: string;
  operation:
    | "Handle Missing Values"
    | "Handle Outliers"
    | "Feature Scaling"
    | "Feature Selection"
    | "Normalization"
    | "Standardization"
    | "No Operation";
};

export type TModelNode = TNode & {
  type: "model";
  datasetId: string;
  model:
    | "Random Forest"
    | "Linear Regression"
    | "Logistic Regression"
    | "Decision Tree"
    | "Naive Bayes"
    | "Support Vector Machine"
    | "K-Nearest Neighbors"
    | "Gradient Boosting"
    | "XGBoost"
    | "Random Forest"
    | "No Operation";
};
