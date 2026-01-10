import { Button } from "@/components/ui/button";
import { Panel } from "@xyflow/react";
import { Play } from "lucide-react";

const BottomCenterPanel = () => {
  return (
    <>
      <Panel position="bottom-left">
        <Button className="">
          <Play /> Execute
        </Button>
      </Panel>
    </>
  );
};

export default BottomCenterPanel;
