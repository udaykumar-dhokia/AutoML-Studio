"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CenterRightPanel from "./components/CenterRightPanel";
import TopCenterPanel from "./components/TopCenterPanel";
import { useSelector } from "react-redux";
import { RootState, store } from "@/store/store";
import { useCallback, useEffect, useState } from "react";
import { setCurrentWorkflow } from "@/store/slices/currentWorkflow.slice";
import { TNode, TEdge } from "@/store/slices/allWorkflows.slice";

const page = () => {
  const { workflow } = useSelector((state: RootState) => state.currentWorkflow);
  const [nodes, setNodes] = useState<TNode[]>([]);
  const [edges, setEdges] = useState<TEdge[]>([]);

  useEffect(() => {
    const workflowId = localStorage.getItem("currentWorkflow");
    if (workflowId) {
      store.dispatch(setCurrentWorkflow(JSON.parse(workflowId)));
    }
  }, []);

  useEffect(() => {
    if (workflow) {
      setNodes(workflow.nodes || []);
      setEdges(workflow.edges || []);
    }
  }, [workflow]);

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
      >
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
