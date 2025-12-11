import { ReactFlow, Background, Controls, Panel, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CenterRightPanel from "./components/CenterRightPanel";

const initialNodes = [
  {
    id: "n1",
    position: { x: 0, y: 0 },
    data: { label: "Node 1" },
    type: "input",
  },
  {
    id: "n2",
    position: { x: 100, y: 100 },
    data: { label: "Node 2" },
  },
];

const initialEdges = [
  {
    id: "n1-n2",
    source: "n1",
    target: "n2",
  },
];

const page = () => {
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow nodes={initialNodes} edges={initialEdges}>
        <Panel position="top-center">top-center</Panel>
        <CenterRightPanel />
        <MiniMap />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default page;
