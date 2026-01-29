import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ContainerStartupProgress } from "./ContainerStartupProgress";
import { spinDownWorkflow, updateWorkflow } from "@/store/slices/allWorkflows.slice";
import { setCurrentWorkflow, spinUpWorkflow as currentSpinUpWorkflow } from "@/store/slices/currentWorkflow.slice";
import { RootState, store } from "@/store/store";
import axiosInstance from "@/utils/axios";
import { Panel, useReactFlow } from "@xyflow/react";
import { CircleDot, CircleDotDashed, CloudUpload, Download, Loader2, LoaderCircle, Pause, Play, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";


const TopCenterPanel = () => {
  const { workflow, isInitializing } = useSelector(
    (state: RootState) => state.currentWorkflow,
  );
  const rf = useReactFlow();
  const [loading, setLoading] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);

  const handleRefresh = async () => {
    try {
      setIsRefresh(true);
      const res = await axiosInstance.get(`/workflow/${workflow?._id}`);
      store.dispatch(setCurrentWorkflow(res.data));
      store.dispatch(updateWorkflow(res.data));
      rf.setNodes(res.data.nodes);
      rf.setEdges(res.data.edges);
    } catch (error: any) {
      toast.error(error?.response?.data?.message);
    } finally {
      setIsRefresh(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const nodes = rf.getNodes();
      const edges = rf.getEdges();

      const updatedWorkflow = {
        nodes,
        edges,
      };
      const res = await axiosInstance.put(
        `/workflow/${workflow?._id}`,
        updatedWorkflow,
      );
      store.dispatch(setCurrentWorkflow(res.data));
      store.dispatch(updateWorkflow(res.data));
      toast.success("Workflow saved");
    } catch (error) {
      toast.error("Failed to save workflow");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Panel
        position="top-center"
        className="w-full flex items-center justify-between px-6 py-4"
      >
        <div className="flex items-center gap-2">
          <SidebarTrigger className="cursor-pointer" />
          <div className="flex items-center gap-1">
            <h1 className="text-2xl font-bold">{workflow?.name}</h1>
            {workflow?.status ? (
              <div className="flex items-center gap-1 ml-2 px-2 py-0.5 border-green-500 border rounded-full">
                <span className="text-xs font-medium text-green-500">Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 ml-2 px-2 py-0.5 border-red-500/50 border rounded-full">
                <span className="text-xs font-medium text-red-500/50">Inactive</span>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isInitializing &&
            <ContainerStartupProgress />
          }
          {workflow?.status && (
            <Button onClick={
              async () => {
                try {
                  await axiosInstance.put(`/workflow/${workflow?._id}/deactivate`);
                } catch (error: any) {
                  toast.error(error?.response?.data?.message);
                }
              }
            } variant={"outline"} size={"sm"} disabled={!workflow?.status || isInitializing}>
              <Pause />
            </Button>
          )}
          {!workflow?.status && (
            <Button onClick={async () => {
              try {
                await axiosInstance.put(`/workflow/${workflow?._id}/activate`);
              } catch (error: any) {
                toast.error(error?.response?.data?.message);
              }
            }} variant={"default"} size={"sm"} disabled={workflow?.status || isInitializing}>
              <Play />
            </Button>
          )}
          <Button
            variant={"outline"}
            onClick={handleRefresh}
            disabled={isRefresh}
            size={"sm"}
          >
            <RefreshCw className={`${isRefresh ? "animate-spin" : ""}`} />
          </Button>
          <Button variant={"outline"} size={"sm"}>
            <Download /> Export
          </Button>
          <Button onClick={handleSave} disabled={loading} size={"sm"}>
            <CloudUpload />{" "}
            {loading ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </Panel>
    </>
  );
};

export default TopCenterPanel;
