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
import { fetchAvailableNodes } from "@/store/slices/node.slice";
import DatasetNode from "@/components/custom/Nodes/DatasetNode";
import BottomCenterPanel from "./components/BottomCenterPanel";

const nodeTypes = {
  datasetNode: DatasetNode,
};

const page = () => {
  const { workflow } = useSelector((state: RootState) => state.currentWorkflow);
  const [nodes, setNodes] = useState<TNode[]>([]);
  const [edges, setEdges] = useState<TEdge[]>([]);
  const { nodes: availableNodes } = useSelector(
    (state: RootState) => state.node
  );

  useEffect(() => {
    const workflowId = localStorage.getItem("currentWorkflow");
    if (workflowId) {
      store.dispatch(setCurrentWorkflow(JSON.parse(workflowId)));
      store.dispatch(fetchAvailableNodes());
    }
  }, []);

  useEffect(() => {
    if (!workflow) return;

    setNodes(workflow.nodes || []);
    setEdges(workflow.edges || []);
  }, []);

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

  const onNodesDelete = useCallback((deletedNodes: any) => {
    setNodes((nds) =>
      nds.filter((n) => !deletedNodes.some((d: any) => d.id === n.id))
    );
  }, []);

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        fitView={false}
      >
        <TopCenterPanel />
        <CenterRightPanel availableNodes={availableNodes} />
        <BottomCenterPanel />
        <MiniMap />
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default page;
