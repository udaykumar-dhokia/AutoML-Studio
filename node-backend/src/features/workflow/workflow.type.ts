import {
  TDatasetNode,
  TModelNode,
  TPreprocessingNode,
} from "../nodes/node.type";

export type TNode = {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: {
    label?: string;
  };
};

export type TEdge = {
  id: string;
  source: string;
  target: string;
  data: {
    label?: string;
  };
};

export type TWorkflow = {
  name: string;
  description: string;
  nodes: TDatasetNode[] | TPreprocessingNode[] | TModelNode[];
  edges: TEdge[];
  userId: string;
};
