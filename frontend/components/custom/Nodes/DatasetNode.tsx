import { memo, useCallback, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

function DatasetNode({ data, isConnectable }: any) {
  const { datasets } = useSelector((state: RootState) => state.dataset);
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  const handleSelect = useCallback((value: string) => {
    setSelectedDataset(value);
  }, []);

  return (
    <>
      <Handle
        type="target"
        position={Position.Right}
        isConnectable={isConnectable}
      />

      <div
        className={`bg-white ${
          selectedDataset !== null ? "border" : "border border-red-500"
        } p-4 rounded-md space-y-2`}
      >
        <div className="font-medium text-sm">Dataset Node</div>

        <Select value={selectedDataset ?? ""} onValueChange={handleSelect}>
          <SelectTrigger className="w-[180px]">
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
    </>
  );
}

export default memo(DatasetNode, (prev, next) => {
  return (
    prev.isConnectable === next.isConnectable && prev.data === next.data // prevent rerender unless node data changes
  );
});
