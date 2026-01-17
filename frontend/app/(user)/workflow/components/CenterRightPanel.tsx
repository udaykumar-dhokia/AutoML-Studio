import { Panel, useReactFlow } from "@xyflow/react";
import {
  BrainCircuit,
  ChartLine,
  FileEditIcon,
  FileSpreadsheet,
  LandPlot,
  Network,
  NotebookPen,
  Split,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TWorkflowNode } from "@/store/slices/node.slice";
import { toast } from "sonner";

const iconMap: Record<string, React.ElementType> = {
  BrainCircuit,
  FileEditIcon,
  Split,
  ChartLine,
  FileSpreadsheet,
  LandPlot,
  NotebookPen,
  Network,
};

const nodeOrderPriority: Record<string, number> = {
  datasetNode: 0,
  dataVisualisationNode: 1,
  preprocessingNode: 2,
  aggregation: 3,
  trainTestSplitNode: 4,
  model: 5,
};

const CenterRightPanel = ({
  availableNodes,
}: {
  availableNodes: TWorkflowNode[];
}) => {
  const rf = useReactFlow();

  const addNewNode = (nodeType: any) => {
    const actualType =
      nodeType.type === "dataset"
        ? "datasetNode"
        : nodeType.type === "preprocessing"
          ? "preprocessingNode"
          : nodeType.type === "dataVisualisation"
            ? "dataVisualisationNode"
            : nodeType.type === "trainTestSplit"
              ? "trainTestSplitNode"
              : nodeType.type === "sequence"
                ? "sequenceNode"
                : nodeType.type;

    if (actualType == "datasetNode") {
      const exists = rf.getNodes().some((n) => n.type === actualType);

      if (exists) {
        toast.info("You cannot add more than one dataset node");
        return;
      }
    }

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    const position = rf.screenToFlowPosition({ x: centerX, y: centerY });

    rf.setNodes((nodes) => [
      ...nodes,
      {
        id: crypto.randomUUID(),
        type: actualType,
        position,
        data: {
          label: nodeType.label,
          ...(actualType === "datasetNode" && {
            selectedDataset: null,
          }),
        },
      },
    ]);
  };

  return (
    <>
      <Panel
        position="center-right"
        className="flex flex-col gap-2 bg-gray-50 dark:bg-sidebar p-2 rounded-md"
      >
        {availableNodes.map((nodeType) => {
          const Icon = iconMap[nodeType.icon];

          return (
            <div
              className="dark:bg-sidebar"
              key={nodeType.type}
              onClick={() => addNewNode(nodeType)}
            >
              <Tooltip>
                <TooltipTrigger>
                  <div className="border p-2 rounded-md cursor-pointer">
                    {Icon && <Icon />}
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{nodeType.label}</p>
                </TooltipContent>
              </Tooltip>
            </div>
          );
        })}
      </Panel>
    </>
  );
};

export default CenterRightPanel;
