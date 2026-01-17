import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { updateWorkflow } from "@/store/slices/allWorkflows.slice";
import { setCurrentWorkflow } from "@/store/slices/currentWorkflow.slice";
import { RootState, store } from "@/store/store";
import axiosInstance from "@/utils/axios";
import { Panel, useReactFlow } from "@xyflow/react";
import { CloudUpload, Download, Loader2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const TopCenterPanel = () => {
  const { workflow } = useSelector((state: RootState) => state.currentWorkflow);
  const { workflows } = useSelector((state: RootState) => state.allWorkflows);
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
          <h1 className="text-2xl font-bold">{workflow?.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={"outline"}
            onClick={handleRefresh}
            disabled={isRefresh}
          >
            <RefreshCw className={`${isRefresh ? "animate-spin" : ""}`} />
          </Button>
          <Button variant={"outline"}>
            <Download /> Export
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            <CloudUpload />{" "}
            {loading ? <Loader2 className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </Panel>
    </>
  );
};

export default TopCenterPanel;
