"use client";

import { ReactFlow, Background, Controls, MiniMap } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CenterRightPanel from "./components/CenterRightPanel";
import TopCenterPanel from "./components/TopCenterPanel";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const page = () => {
  const { workflow } = useSelector((state: RootState) => state.currentWorkflow);
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow nodes={workflow?.nodes || []} edges={workflow?.edges || []}>
        <TopCenterPanel />
        <CenterRightPanel />
        <MiniMap />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default page;
