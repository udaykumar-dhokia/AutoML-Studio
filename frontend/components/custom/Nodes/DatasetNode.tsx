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
import { ArrowUpRight, FileSpreadsheet, Play, X } from "lucide-react";
import { deleteNode as deleteNodeAction } from "@/store/slices/currentWorkflow.slice";
import { useState, memo } from "react";
import DatasetNodeDialog from "../Dialogs/DatasetNodeDialog";
import axiosInstance from "@/utils/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function DatasetNode({ id, data, isConnectable }: any) {
  const { datasets } = useSelector((state: RootState) => state.dataset);
  const selectedDataset = data.selectedDataset ?? "";
  const rf = useReactFlow();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [head, setHead] = useState<any[] | null>(null);
  const [tail, setTail] = useState<any[] | null>(null);
  const [info, setInfo] = useState<any | null>(null);
  const [describe, setDescribe] = useState<any | null>(null);
  const [columns, setColumns] = useState<string[] | null>(null);
  const [hasRun, setHasRun] = useState<boolean | null>(null);
  const router = useRouter();

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

  const handlePlay = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedDataset) {
      toast.error("Please select a dataset first");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.get("/operations/dataset", {
        params: {
          id: selectedDataset,
        },
      });

      if (res.data) {
        setHead(res.data["head"] || null);
        setTail(res.data["tail"] || null);
        setInfo(res.data["info"] || null);
        setDescribe(res.data["describe"] || null);
        setColumns(res.data["columns"] || null);

        const cols = res.data.columns;

        const connectedNodeIds = rf
          .getEdges()
          .filter((e) => e.source === id)
          .map((e) => e.target);

        rf.setNodes((nds) =>
          nds.map((node) => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  columns: cols,
                  selectedDataset: selectedDataset,
                },
              };
            }
            if (connectedNodeIds.includes(node.id)) {
              return {
                ...node,
                data: {
                  ...node.data,
                  columns: cols,
                  selectedDataset: selectedDataset,
                },
              };
            }
            return node;
          }),
        );
        setHasRun(true);
        toast.success("Dataset executed successfully");
      }
    } catch (error: any) {
      setHasRun(false);
      toast.error(error.response?.data?.message || "Failed to execute dataset");
      if (error.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleColumnsUpdate = (columns: string[]) => {
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                columns: columns,
                selectedDataset: selectedDataset,
              },
            }
          : node,
      ),
    );
  };

  return (
    <>
      <div
        className={`relative w-[220px] rounded-none shadow-sm bg-white dark:bg-sidebar border border-dashed border-black/25 cursor-pointer ${
          selectedDataset ? "" : "border-red-500"
        } ${loading ? "animate-pulse border-primary-500" : ""} ${
          hasRun
            ? "border-green-500 dark:border-green-500"
            : "dark:border-white/15 border-black/25"
        }`}
        onDoubleClickCapture={handleDoubleClick}
      >
        <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-sidebar border-b">
          <span className="flex items-center gap-1 font-semibold text-sm text-gray-700 dark:text-white">
            <FileSpreadsheet className="w-4 h-4" />
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

        <div className="p-4 space-y-3">
          <Select
            value={selectedDataset!}
            onValueChange={handleSelect}
            disabled={loading}
          >
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
        onColumnsUpdate={handleColumnsUpdate}
        head={head}
        tail={tail}
        info={info}
        describe={describe}
        columns={columns}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
}

export default memo(
  DatasetNode,
  (prev, next) =>
    prev.isConnectable === next.isConnectable && prev.data === next.data,
);
