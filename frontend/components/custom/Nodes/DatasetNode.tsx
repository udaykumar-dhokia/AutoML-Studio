import { Handle, Position, useReactFlow } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState, store } from "@/store/store";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Eye, Play, TriangleAlert, X } from "lucide-react";
import { deleteNode as deleteNodeAction } from "@/store/slices/currentWorkflow.slice";
import { useState, memo } from "react";
import DatasetNodeDialog from "../Dialogs/DatasetNodeDialog";

function DatasetNode({ id, data, isConnectable }: any) {
  const { datasets } = useSelector((state: RootState) => state.dataset);
  const selectedDataset = data.selectedDataset ?? "";
  const rf = useReactFlow();
  const [open, setOpen] = useState(false);

  const handleSelect = (value: string) => {
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                selectedDataset: value,
              },
            }
          : node
      )
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
        className="relative w-[220px] rounded-lg shadow-sm bg-white dark:bg-sidebar border cursor-pointer"
        onDoubleClickCapture={handleDoubleClick}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-sidebar rounded-t-lg border-b">
          <span className="flex items-center gap-1 font-semibold text-sm text-gray-700 dark:text-white">
            {!selectedDataset && (
              <TriangleAlert className="w-3 h-3 text-yellow-600" />
            )}
            <p>Dataset</p>
          </span>

          <div className="">
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
          </div>
        </div>

        <div className="p-4 space-y-3">
          <Select value={selectedDataset!} onValueChange={handleSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Dataset" />
            </SelectTrigger>

            <SelectContent>
              {datasets.map((dataset) => (
                <SelectItem key={dataset._id} value={dataset._id}>
                  {dataset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </div>

      <DatasetNodeDialog
        open={open}
        onOpenChange={setOpen}
        datasetId={selectedDataset}
      />
    </>
  );
}

export default memo(
  DatasetNode,
  (prev, next) =>
    prev.isConnectable === next.isConnectable && prev.data === next.data
);
