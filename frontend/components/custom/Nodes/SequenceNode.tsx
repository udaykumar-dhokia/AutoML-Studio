import {
  Handle,
  Position,
  useHandleConnections,
  useNodesData,
  useReactFlow,
} from "@xyflow/react";
import { Button } from "@/components/ui/button";
import { Network, Plus, Trash2, X } from "lucide-react";
import { deleteNode as deleteNodeAction } from "@/store/slices/currentWorkflow.slice";
import { store } from "@/store/store";
import { memo, useEffect, useCallback } from "react";

function SequenceStep({
  id,
  handleId,
  index,
  isConnectable,
  removeHandle,
  inputsLength,
}: {
  id: string;
  handleId: string;
  index: number;
  isConnectable: boolean;
  removeHandle: (id: string) => void;
  inputsLength: number;
}) {
  const rf = useReactFlow();
  const connections = useHandleConnections({
    type: "target",
    id: handleId,
  });

  const nodeData = useNodesData(connections?.[0]?.source);

  const isValidConnection = useCallback(
    (connection: any) => {
      const sourceNode = rf.getNode(connection.source);
      return sourceNode?.type === "preprocessingNode";
    },
    [rf],
  );

  return (
    <div className="relative flex items-center justify-between p-2 bg-muted/20 border rounded-none">
      <div className="flex items-center">
        <div className="relative w-4 h-4 mr-2">
          <Handle
            type="target"
            position={Position.Left}
            id={handleId}
            isConnectable={isConnectable && connections.length === 0}
            isValidConnection={isValidConnection}
            className="absolute! top-1/2! -left-4! transform! -translate-y-1/2! w-3! h-3! bg-muted-foreground"
          />
        </div>
        <span className="text-sm font-medium">
          {nodeData?.data?.operation
            ? (nodeData.data.operation as string)
            : `Step ${index + 1}`}
        </span>
      </div>

      {inputsLength > 1 && (
        <Button
          size="icon-sm"
          variant="ghost"
          onClick={() => removeHandle(handleId)}
          className="h-6 w-6 text-red-500"
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      )}
    </div>
  );
}

function SequenceNode({ id, data, isConnectable }: any) {
  const rf = useReactFlow();
  const inputs: string[] = data.inputs || ["input-0"];

  useEffect(() => {
    if (!data.inputs) {
      rf.setNodes((nodes) =>
        nodes.map((node) =>
          node.id === id
            ? { ...node, data: { ...node.data, inputs: ["input-0"] } }
            : node,
        ),
      );
    }
  }, [data.inputs, id, rf]);

  const addHandle = () => {
    const uniqueId = `input-${Date.now()}`;
    const newInputs = [...inputs, uniqueId];

    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, inputs: newInputs } }
          : node,
      ),
    );
  };

  const removeHandle = (handleIdToRemove: string) => {
    const newInputs = inputs.filter((id) => id !== handleIdToRemove);
    rf.setNodes((nodes) =>
      nodes.map((node) =>
        node.id === id
          ? { ...node, data: { ...node.data, inputs: newInputs } }
          : node,
      ),
    );
  };

  const deleteNode = () => {
    rf.deleteElements({ nodes: [{ id }] });
    store.dispatch(deleteNodeAction({ id }));
  };

  return (
    <div
      className={`relative min-w-[250px] rounded-none shadow-sm bg-white dark:bg-sidebar border border-dashed border-black/25 dark:border-white/15`}
    >
      <div className="flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-sidebar border-b">
        <span className="flex items-center gap-1 font-semibold text-sm text-gray-700 dark:text-white">
          <Network className="w-4 h-4" />
          <p>Sequence</p>
        </span>
        <Button size="icon-sm" variant="ghost" onClick={deleteNode}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-xs text-gray-500">
          Connect preprocessing nodes in order:
        </div>

        <div className="flex flex-col gap-3">
          {inputs.map((handleId, index) => (
            <SequenceStep
              id={id}
              key={handleId}
              handleId={handleId}
              index={index}
              isConnectable={isConnectable}
              removeHandle={removeHandle}
              inputsLength={inputs.length}
            />
          ))}
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-2 border-dashed"
          onClick={addHandle}
        >
          <Plus className="w-3 h-3" />
          Add Step
        </Button>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </div>
  );
}

export default memo(
  SequenceNode,
  (prev, next) =>
    prev.isConnectable === next.isConnectable &&
    JSON.stringify(prev.data) === JSON.stringify(next.data),
);
