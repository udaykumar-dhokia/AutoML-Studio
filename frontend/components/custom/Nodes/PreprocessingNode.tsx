import { Handle, Position, useEdges } from "@xyflow/react";
import { memo, useMemo } from "react";

const PreprocessingNode = ({ id, isConnectable }: any) => {
  const edges = useEdges();

  const isTargetConnected = useMemo(() => {
    return edges.some((edge) => edge.target === id);
  }, [edges, id]);

  return (
    <div
      className={`relative w-[220px] rounded-lg shadow-sm bg-white dark:bg-sidebar border cursor-pointer p-4 ${
        !isTargetConnected ? "border-red-500" : ""
      }`}
    >
      <div className="flex items-center justify-center">
        <p>Preprocessing</p>
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
};

export default memo(PreprocessingNode);
