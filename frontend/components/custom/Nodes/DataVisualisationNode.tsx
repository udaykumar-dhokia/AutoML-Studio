import { Handle, Position, useReactFlow } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ChartLine, Play, X } from "lucide-react";
import { deleteNode as deleteNodeAction } from "@/store/slices/currentWorkflow.slice";
import { store } from "@/store/store";
import { memo, useState } from "react";
import UnivariateAnalysisDialog from "../Dialogs/UnivariateAnalysisDialog";
import BivariateAnalysisDialog from "../Dialogs/BivariateAnalysisDialog";
import { toast } from "sonner";

const visualizationOptions: Record<string, string[]> = {
  "Univariate Analysis": [
    "Histogram",
    "Box Plot",
    "Bar Chart",
    "Pie Chart",
    "Count Plot",
  ],
  "Bivariate Analysis": [
    "Scatter Plot",
    "Line Chart",
    "Bar Chart",
    "Box Plot",
    "Violin Plot",
    "Heatmap",
  ],
  "Multivariate Analysis": [
    "Correlation Heatmap",
    "Pair Plot",
    "Parallel Coordinates",
  ],
};

function DataVisualisationNode({ id, data, isConnectable }: any) {
  const rf = useReactFlow();

  const selectedAnalysisType = data.analysisType ?? "";
  const selectedVisualizationType = data.visualizationType ?? "";
  const selectedColumnX = data.columnX ?? "";
  const selectedColumnY = data.columnY ?? "";
  const selectedDataset = data.selectedDataset ?? "";

  const columns: string[] = data.columns ?? [];
  const [open, setOpen] = useState(false);
  const [openAndExecute, setOpenAndExecute] = useState(false);

  const analysisTypes = ["Univariate Analysis", "Bivariate Analysis"];

  const handleSelectAnalysisType = (value: string) => {
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
            ...node,
            data: {
              ...node.data,
              analysisType: value,
              visualizationType: "",
              columnX: "",
              columnY: "",
            },
          }
          : node
      )
    );
  };

  const handleSelectVisualizationType = (value: string) => {
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
            ...node,
            data: {
              ...node.data,
              visualizationType: value,
            },
          }
          : node
      )
    );
  };

  const handleSelectColumnX = (value: string) => {
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, columnX: value } }
          : node
      )
    );
  };

  const handleSelectColumnY = (value: string) => {
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, columnY: value } }
          : node
      )
    );
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleExecute = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (!selectedAnalysisType) {
      toast.error("Please select an analysis type");
      return;
    }

    if (!selectedColumnX) {
      toast.error("Please select a column");
      return;
    }

    if (!selectedVisualizationType) {
      toast.error("Please select a visualization type");
      return;
    }
    setOpenAndExecute(true);
    setOpen(true);
  };

  const deleteNode = () => {
    rf.deleteElements({ nodes: [{ id }] });
    store.dispatch(deleteNodeAction({ id }));
  };

  const isValid = (() => {
    if (!selectedAnalysisType || !selectedVisualizationType) return false;
    if (selectedAnalysisType === "Univariate Analysis")
      return !!selectedColumnX;
    if (selectedAnalysisType === "Bivariate Analysis")
      return !!selectedColumnX && !!selectedColumnY;
    if (selectedAnalysisType === "Multivariate Analysis")
      return !!selectedColumnX;
    return false;
  })();

  return (
    <>
      <div
        onDoubleClickCapture={handleDoubleClick}
        className={`relative w-[240px] rounded-none shadow-sm bg-white dark:bg-sidebar border-dashed border border-black/25 dark:border-white/15 cursor-pointer ${isValid ? "" : "border-red-500"
          }`}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-sidebar border-b">
          <span className="flex items-center gap-2 font-semibold text-sm text-gray-700 dark:text-white">
            <ChartLine className="w-4 h-4" />
            <p>Visualisation</p>
          </span>
          <div className="">
            <Button size="icon-sm" variant="ghost" onClick={deleteNode}>
              <X className="w-4 h-4" />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={handleDoubleClick}>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={handleExecute}>
              <Play className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Analysis Type
            </label>
            <Select
              value={selectedAnalysisType}
              onValueChange={handleSelectAnalysisType}
            >
              <SelectTrigger className="w-full h-8 text-xs">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {analysisTypes.map((type) => (
                  <SelectItem key={type} value={type} className="text-xs">
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAnalysisType && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Visualization Type
              </label>
              <Select
                value={selectedVisualizationType}
                onValueChange={handleSelectVisualizationType}
              >
                <SelectTrigger className="w-full h-8 text-xs">
                  <SelectValue placeholder="Select Graph" />
                </SelectTrigger>
                <SelectContent>
                  {visualizationOptions[selectedAnalysisType]?.map((type) => (
                    <SelectItem key={type} value={type} className="text-xs">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedAnalysisType && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  {selectedAnalysisType === "Bivariate Analysis"
                    ? "Column One"
                    : selectedAnalysisType === "Multivariate Analysis"
                      ? "Target Column"
                      : "Column"}
                </label>
                <Select
                  value={selectedColumnX}
                  onValueChange={handleSelectColumnX}
                  disabled={columns.length === 0}
                >
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue
                      placeholder={
                        columns.length ? "Select Column" : "No columns"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {columns.map((col) => (
                      <SelectItem key={col} value={col} className="text-xs">
                        {col}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedAnalysisType === "Bivariate Analysis" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    Column Two
                  </label>
                  <Select
                    value={selectedColumnY}
                    onValueChange={handleSelectColumnY}
                    disabled={columns.length === 0}
                  >
                    <SelectTrigger className="w-full h-8 text-xs">
                      <SelectValue
                        placeholder={
                          columns.length ? "Select Column" : "No columns"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => (
                        <SelectItem key={col} value={col} className="text-xs">
                          {col}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </>
          )}

          {!selectedAnalysisType && (
            <p className="text-[10px] text-gray-400 italic text-center py-2">
              Select analysis type to configure
            </p>
          )}
        </div>

        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
      </div>

      {selectedAnalysisType === "Univariate Analysis" && (
        <UnivariateAnalysisDialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            setOpenAndExecute(false);
          }}
          datasetId={selectedDataset}
          column={selectedColumnX}
          visualiseType={selectedVisualizationType}
          columns={columns}
          openAndExecute={openAndExecute}
        />
      )}

      {selectedAnalysisType === "Bivariate Analysis" && (
        <BivariateAnalysisDialog
          open={open}
          onOpenChange={(value) => {
            setOpen(value);
            setOpenAndExecute(false);
          }}
          datasetId={selectedDataset}
          columnX={selectedColumnX}
          columnY={selectedColumnY}
          visualiseType={selectedVisualizationType}
          columns={columns}
          openAndExecute={openAndExecute}
        />
      )}
    </>
  );
}

export default memo(
  DataVisualisationNode,
  (prev, next) =>
    prev.isConnectable === next.isConnectable &&
    JSON.stringify(prev.data) === JSON.stringify(next.data)
);
