"use client";

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
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
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Loader from "@/components/custom/Loader";
import PreprocessingNode from "@/components/custom/Nodes/PreprocessingNode";
import Edge from "@/components/custom/Edge/Edge";

const nodeTypes = {
  datasetNode: DatasetNode,
  preprocessingNode: PreprocessingNode,
};

const edgeTypes = {
  edge: Edge,
};

const page = () => {
  const { workflow } = useSelector((state: RootState) => state.currentWorkflow);
  const [nodes, setNodes] = useState<TNode[]>([]);
  const [edges, setEdges] = useState<TEdge[]>([]);
  const { nodes: availableNodes } = useSelector(
    (state: RootState) => state.node
  );
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    const getWorkflow = async (workflowId: string) => {
      try {
        const res = await axiosInstance.get(`/workflow/${workflowId}`);
        store.dispatch(setCurrentWorkflow(res.data));
      } catch (error: any) {
        toast.error(error.response.data.message);
        localStorage.removeItem("currentWorkflowId");
        router.push("/models");
      } finally {
        setLoading(false);
      }
    };

    const workflowId = localStorage.getItem("currentWorkflowId");
    if (workflowId) {
      store.dispatch(fetchAvailableNodes());
      getWorkflow(workflowId);
    } else {
      setLoading(false);
      router.push("/models");
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

  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  if (loading) return <Loader />;

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        fitView={false}
        defaultEdgeOptions={{
          type: "edge",
          animated: true,
        }}
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
