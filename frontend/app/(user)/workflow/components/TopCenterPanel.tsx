import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { RootState } from "@/store/store";
import axiosInstance from "@/utils/axios";
import { Panel, useReactFlow } from "@xyflow/react";
import { CloudUpload, Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const TopCenterPanel = () => {
  const { workflow } = useSelector((state: RootState) => state.currentWorkflow);
  const rf = useReactFlow();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSave = async () => {
    setLoading(true);

    try {
      const nodes = rf.getNodes();
      const edges = rf.getEdges();

      console.log(nodes);

      const updatedWorkflow = {
        nodes,
        edges,
      };
      await axiosInstance.put(`/workflow/${workflow?._id}`, updatedWorkflow);

      toast.success("Workflow saved successfully");
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
