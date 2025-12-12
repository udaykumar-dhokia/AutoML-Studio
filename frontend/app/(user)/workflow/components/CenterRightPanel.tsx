import { Panel, useReactFlow } from "@xyflow/react";
import {
  BrainCircuit,
  FileEditIcon,
  FileSpreadsheet,
  LandPlot,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSelector } from "react-redux";
import { RootState, store } from "@/store/store";
import { addNode } from "@/store/slices/currentWorkflow.slice";

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
  {
    type: "evaluation",
    icon: LandPlot,
    label: "Evaluation Node",
  },
];

const CenterRightPanel = () => {
  const { workflow } = useSelector((state: RootState) => state.currentWorkflow);
  const rf = useReactFlow();

  const addNewNode = (nodeType: any) => {
    if (!workflow) return;

    const { x, y, zoom } = rf.getViewport();

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const position = rf.screenToFlowPosition({ x: centerX, y: centerY });

    store.dispatch(
      addNode({
        id: crypto.randomUUID(),
        type: nodeType.type,
        position,
        data: { label: nodeType.label },
      })
    );
  };

  return (
    <>
      <Panel
        position="center-right"
        className="flex flex-col gap-2 bg-gray-50 p-2 rounded-md"
      >
        {NODE_TYPES.map((nodeType) => (
          <div
            className=""
            key={nodeType.type}
            onClick={() => addNewNode(nodeType)}
          >
            <Tooltip>
              <TooltipTrigger>
                <div className="border p-2 rounded-md cursor-pointer">
                  <nodeType.icon />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{nodeType.label}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        ))}
      </Panel>
    </>
  );
};

export default CenterRightPanel;
