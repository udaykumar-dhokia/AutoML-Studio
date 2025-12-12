import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { RootState } from "@/store/store";
import { Panel, useReactFlow } from "@xyflow/react";
import { CloudUpload, Download } from "lucide-react";
import { useSelector } from "react-redux";

const TopCenterPanel = () => {
  const { workflow } = useSelector((state: RootState) => state.currentWorkflow);
  const rf = useReactFlow();

  const handleSave = async () => {
    const nodes = rf.getNodes();
    const edges = rf.getEdges();

    const updatedWorkflow = {
      id: workflow?._id,
      nodes,
      edges,
    };
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
          <Button onClick={handleSave}>
            <CloudUpload /> Save
          </Button>
        </div>
      </Panel>
    </>
  );
};

export default TopCenterPanel;
