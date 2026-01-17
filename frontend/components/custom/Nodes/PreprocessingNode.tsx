import { Handle, Position, useReactFlow } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, FileEditIcon, Play, X } from "lucide-react";
import { deleteNode as deleteNodeAction } from "@/store/slices/currentWorkflow.slice";
import { store } from "@/store/store";
import { memo, useState } from "react";
import HandleMissingValuesDialog from "../Dialogs/HandleMissingValuesDialog";
import HandleOutliersDialog from "../Dialogs/HandleOutliersDialog";
import NormalizationDialog from "../Dialogs/NormalizationDialog";
import StandardizationDialog from "../Dialogs/StandardizationDialog";

const operationOptionsMap: Record<string, string[]> = {
  "Handle Missing Values": [
    "Replace with Mean",
    "Replace with Median",
    "Replace with Min",
    "Replace with Max",
    "Drop Rows",
  ],
  "Handle Outliers": ["IQR Method", "Z-Score Method", "Capping"],
  Normalization: ["Min-Max Scaling", "Max Abs Scaling"],
  Standardization: ["Z-Score Standardization"],
  "No Operation": [],
};

function PreprocessingNode({ id, data, isConnectable }: any) {
  const rf = useReactFlow();

  const selectedOperation = data.operation ?? "";
  const selectedColumn = data.column ?? "";
  const columns: string[] = data.columns ?? [];
  const selectedStrategy = data.strategy ?? "";
  const selectedDataset = data.selectedDataset ?? "";
  const [open, setOpen] = useState(false);

  const operations = [
    "Handle Missing Values",
    "Handle Outliers",
    "Normalization",
    "Standardization",
  ];

  const handlePlay = () => {
    setOpen(true);
  };

  const handleSelectOperation = (value: string) => {
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                operation: value,
                strategy: "",
              },
            }
          : node,
      ),
    );
  };

  const handleSelectStrategy = (value: string) => {
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, strategy: value } }
          : node,
      ),
    );
  };

  const handleSelectColumn = (value: string) => {
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, column: value } }
          : node,
      ),
    );
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const deleteNode = () => {
    rf.deleteElements({ nodes: [{ id }] });
    store.dispatch(deleteNodeAction({ id }));
  };

  return (
    <>
      <div
        onDoubleClickCapture={handleDoubleClick}
        className={`relative w-60 rounded-none shadow-sm bg-white dark:bg-sidebar border-dashed border border-black/25 dark:border-white/15 cursor-pointer ${
          selectedOperation && selectedStrategy ? "" : "border-red-500"
        }`}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-sidebar border-b">
          <span className="flex items-center gap-1 font-semibold text-sm text-gray-700 dark:text-white">
            <FileEditIcon className="w-4 h-4" />
            <p>Preprocessing</p>
          </span>
          <div className="">
            <Button size="icon-sm" variant="ghost" onClick={deleteNode}>
              <X className="w-4 h-4" />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={handlePlay}>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
            <Button size="icon-sm" variant="ghost" onClick={handlePlay}>
              <Play className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Operation
            </label>
            <Select
              value={selectedOperation}
              onValueChange={handleSelectOperation}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Operation" />
              </SelectTrigger>
              <SelectContent>
                {operations.map((op) => (
                  <SelectItem key={op} value={op}>
                    {op}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Strategy / Method (conditional) */}
          {selectedOperation &&
            operationOptionsMap[selectedOperation]?.length > 0 && (
              <div className="space-y2">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  Method
                </label>
                <Select
                  value={selectedStrategy}
                  onValueChange={handleSelectStrategy}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Method" />
                  </SelectTrigger>
                  <SelectContent>
                    {operationOptionsMap[selectedOperation].map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

          {/* Column */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Column
            </label>
            <Select
              value={selectedColumn}
              onValueChange={handleSelectColumn}
              disabled={columns.length === 0}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    columns.length ? "Select Column" : "No columns available"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </div>
      {selectedOperation === "Handle Missing Values" && (
        <HandleMissingValuesDialog
          selectedStrategy={selectedStrategy}
          selectedColumn={selectedColumn}
          open={open}
          onOpenChange={setOpen}
          datasetId={selectedDataset}
          columns={columns}
        />
      )}
      {selectedOperation === "Handle Outliers" && (
        <HandleOutliersDialog
          selectedStrategy={selectedStrategy}
          selectedColumn={selectedColumn}
          open={open}
          onOpenChange={setOpen}
          datasetId={selectedDataset}
          columns={columns}
        />
      )}
      {selectedOperation === "Normalization" && (
        <NormalizationDialog
          selectedStrategy={selectedStrategy}
          selectedColumn={selectedColumn}
          open={open}
          onOpenChange={setOpen}
          datasetId={selectedDataset}
          columns={columns}
        />
      )}
      {selectedOperation === "Standardization" && (
        <StandardizationDialog
          selectedStrategy={selectedStrategy}
          selectedColumn={selectedColumn}
          open={open}
          onOpenChange={setOpen}
          datasetId={selectedDataset}
          columns={columns}
        />
      )}
    </>
  );
}

export default memo(
  PreprocessingNode,
  (prev, next) =>
    prev.isConnectable === next.isConnectable &&
    JSON.stringify(prev.data) === JSON.stringify(next.data),
);
