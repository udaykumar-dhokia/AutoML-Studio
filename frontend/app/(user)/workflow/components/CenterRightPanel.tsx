import { Panel } from "@xyflow/react";
import { BrainCircuit, FileEditIcon, FileSpreadsheet } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NODE_TYPES = [
  {
    type: "dataset",
    icon: FileSpreadsheet,
    label: "Dataset Node",
  },
  {
    type: "preprocessing",
    icon: FileEditIcon,
    label: "Preprocessing Node",
  },
  {
    type: "model",
    icon: BrainCircuit,
    label: "Model Node",
  },
];

const CenterRightPanel = () => {
  return (
    <>
      <Panel
        position="center-right"
        className="flex flex-col gap-2 bg-gray-50 p-2 rounded-md"
      >
        {NODE_TYPES.map((nodeType) => (
          <Tooltip>
            <TooltipTrigger>
              <div
                className="border p-2 rounded-md cursor-pointer"
                key={nodeType.type}
              >
                <nodeType.icon />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{nodeType.label}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </Panel>
    </>
  );
};

export default CenterRightPanel;
