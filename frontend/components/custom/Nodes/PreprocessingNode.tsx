import { Handle, Position, useReactFlow } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Play, X } from "lucide-react";
import { deleteNode as deleteNodeAction } from "@/store/slices/currentWorkflow.slice";
import { store } from "@/store/store";
import { memo } from "react";

function PreprocessingNode({ id, data, isConnectable }: any) {
  const rf = useReactFlow();

  const selectedOperation = data.operation ?? "";
  const selectedColumn = data.column ?? "";
  const columns: string[] = data.columns ?? [];

  const operations = [
    "Handle Missing Values",
    "Handle Outliers",
    "Feature Scaling",
    "Feature Selection",
    "Normalization",
    "Standardization",
    "No Operation",
  ];

  const handleSelectOperation = (value: string) => {
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, operation: value } }
          : node
      )
    );
  };

  const handleSelectColumn = (value: string) => {
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, column: value } }
          : node
      )
    );
  };

  const deleteNode = () => {
    rf.deleteElements({ nodes: [{ id }] });
    store.dispatch(deleteNodeAction({ id }));
  };

  return (
    <div
      className={`relative w-[220px] rounded-lg shadow-sm bg-white dark:bg-sidebar border cursor-pointer ${
        selectedOperation ? "" : "border-red-500"
      }`}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-sidebar rounded-t-lg border-b">
        <p className="font-semibold text-sm">Preprocessing</p>
        <div className="">
          <Button size="icon-sm" variant="ghost" onClick={deleteNode}>
            <X className="w-4 h-4" />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={deleteNode}>
            <ArrowUpRight className="w-4 h-4" />
          </Button>
          <Button size="icon-sm" variant="ghost" onClick={deleteNode}>
            <Play className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <Select value={selectedOperation} onValueChange={handleSelectOperation}>
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
  );
}

export default memo(
  PreprocessingNode,
  (prev, next) =>
    prev.isConnectable === next.isConnectable &&
    JSON.stringify(prev.data) === JSON.stringify(next.data)
);
