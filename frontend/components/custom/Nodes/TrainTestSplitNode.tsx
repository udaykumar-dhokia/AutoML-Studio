import { Handle, Position, useReactFlow } from "@xyflow/react";
import { store } from "@/store/store";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Play, X, Split } from "lucide-react";
import { deleteNode as deleteNodeAction } from "@/store/slices/currentWorkflow.slice";
import { useState, memo } from "react";
import TrainTestSplitDialog from "../Dialogs/TrainTestSplitDialog";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

function TrainTestSplitNode({ id, data, isConnectable }: any) {
  const rf = useReactFlow();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasRun, setHasRun] = useState<boolean>(false);

  const [testSize, setTestSize] = useState(data.test_size ?? 0.2);
  const [shuffle, setShuffle] = useState(data.shuffle ?? true);
  const [stratify, setStratify] = useState(data.stratify ?? "None");
  const [columns, _] = useState(data.columns ?? []);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen(true);
  };

  const deleteNode = () => {
    rf.deleteElements({ nodes: [{ id }] });
    store.dispatch(deleteNodeAction({ id }));
  };

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    setOpen(true);
    setHasRun(true);
    setLoading(false);
  };

  const handleUpdate = (newData: any) => {
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
            ...node,
            data: {
              ...node.data,
              ...newData,
            },
          }
          : node,
      ),
    );
  };

  return (
    <>
      <div
        className={`relative w-60 rounded-md shadow-sm bg-white dark:bg-sidebar border border-dashed border-black/25 cursor-pointer ${loading ? "animate-pulse border-primary-500" : ""
          } ${hasRun
            ? "border-green-500 dark:border-green-500"
            : "dark:border-white/15 border-black/25"
          }`}
        onDoubleClickCapture={handleDoubleClick}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-sidebar border-b">
          <span className="flex items-center gap-1 font-semibold text-sm text-gray-700 dark:text-white">
            <Split className="w-4 h-4" />
            <p>Train Test Split</p>
          </span>

          <div className="flex items-center">
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-black dark:text-white"
              onClick={deleteNode}
            >
              <X className="w-4 h-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-black dark:text-white"
              onClick={handleDoubleClick}
            >
              <ArrowUpRight className="w-4 h-4" />
            </Button>
            <Button
              size="icon-sm"
              variant="ghost"
              className="text-black dark:text-white"
              onClick={handlePlay}
              disabled={loading}
            >
              {loading ? (
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="p-4 space-y-1">
          <div className="space-y-2">
            <label className="text-[10px] font-medium text-gray-500 tracking-wider">
              Test Size: {testSize}
            </label>

            <Slider
              min={0}
              max={1}
              step={0.05}
              value={[testSize]}
              onValueChange={([val]) => {
                setTestSize(Number(val.toFixed(2)));
              }}
              onValueCommit={([val]) => {
                handleUpdate({ test_size: Number(val.toFixed(2)) });
              }}
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-500  tracking-wider">
              Shuffle
            </label>
            <Select
              value={String(shuffle)}
              onValueChange={(val) => setShuffle(val === "true")}
            >
              <SelectTrigger className="text-xs w-full">
                <SelectValue placeholder="Shuffle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">True</SelectItem>
                <SelectItem value="false">False</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-medium text-gray-500  tracking-wider">
              Stratify
            </label>
            <Select
              value={stratify}
              onValueChange={(val) => setStratify(val)}
              disabled={columns.length === 0}
            >
              <SelectTrigger className="text-xs w-full">
                <SelectValue
                  placeholder={columns.length ? "Select column" : "No columns"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="None">None</SelectItem>
                {columns.map((col: string) => (
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

      <TrainTestSplitDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v);
          setHasRun(false);
        }}
        nodeId={id}
        data={data}
        onUpdate={handleUpdate}
        datasetId={data.selectedDataset}
        hasRun={hasRun}
      />
    </>
  );
}

export default memo(
  TrainTestSplitNode,
  (prev, next) =>
    prev.isConnectable === next.isConnectable &&
    JSON.stringify(prev.data) === JSON.stringify(next.data),
);
