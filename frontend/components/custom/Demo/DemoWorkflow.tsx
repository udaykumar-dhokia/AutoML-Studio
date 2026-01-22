"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import DatasetDemoNode from "./DatasetDemoNode";
import PreprocessingDemoNode from "./PreprocessingDemoNode";
import VisualizationDemoNode from "./VisualizationDemoNode";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";

const nodeTypes = {
  datasetDemo: DatasetDemoNode,
  preprocessingDemo: PreprocessingDemoNode,
  visualizationDemo: VisualizationDemoNode,
};

const nodes: Node[] = [
  {
    id: "dataset-1",
    type: "datasetDemo",
    position: { x: 0, y: 220 },
    data: {},
  },

  {
    id: "prep-1",
    type: "preprocessingDemo",
    position: { x: 300, y: 100 },
    data: {},
  },

  {
    id: "prep-2",
    type: "preprocessingDemo",
    position: { x: 300, y: 340 },
    data: {},
  },

  {
    id: "viz-1",
    type: "visualizationDemo",
    position: { x: 650, y: 60 },
    data: {},
  },
  {
    id: "viz-2",
    type: "visualizationDemo",
    position: { x: 650, y: 180 },
    data: {},
  },
  {
    id: "viz-3",
    type: "visualizationDemo",
    position: { x: 650, y: 340 },
    data: {},
  },
];

const edges: Edge[] = [
  { id: "e1", source: "dataset-1", target: "prep-1", animated: true },
  { id: "e2", source: "dataset-1", target: "prep-2", animated: true },

  { id: "e3", source: "prep-1", target: "viz-1", animated: true },
  { id: "e4", source: "prep-1", target: "viz-2", animated: true },
  { id: "e5", source: "prep-2", target: "viz-3", animated: true },
];

export default function DemoWorkflow() {
  return (
    <div className="w-full h-[500px] rounded-xl border shadow-lg bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={false}
        panOnScroll={false}
      >
        <Background gap={16} />
        <Panel position="top-center" className="w-full px-6">
          <div className="w-full flex justify-between items-center">
            <h1 className="font-medium">Customer Product Recommendation</h1>
            <div className="">
              <Button size={"sm"}>
                <Play /> Execute
              </Button>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
