import { Button } from "@/components/ui/button";
import { Panel } from "@xyflow/react";
import { Play } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const BottomCenterPanel = () => {
  const { workflow } = useSelector((state: RootState) => state.currentWorkflow);
  return (
    <>
      <Panel position="bottom-left">
        <Button className="" disabled={!workflow?.status}>
          <Play /> Execute
        </Button>
      </Panel>
    </>
  );
};

export default BottomCenterPanel;
