import { Handle, Position, useReactFlow } from "@xyflow/react";
import { store } from "@/store/store";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Play, X, BrainCircuit } from "lucide-react";
import { deleteNode as deleteNodeAction } from "@/store/slices/currentWorkflow.slice";
import { useState, memo } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import ModelNodeDialog from "../Dialogs/ModelNodeDialog";

const MODELS = [
    { label: "Linear Regression", value: "linear_regression" },
    { label: "Logistic Regression", value: "logistic_regression" },
    { label: "Random Forest Classifier", value: "random_forest_classifier" },
    { label: "Random Forest Regressor", value: "random_forest_regressor" },
    { label: "XGBoost Classifier", value: "xgboost_classifier" },
    { label: "XGBoost Regressor", value: "xgboost_regressor" },
    { label: "Support Vector Machine", value: "svc" },
];

function ModelNode({ id, data, isConnectable }: any) {
    const rf = useReactFlow();
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [hasRun, setHasRun] = useState<boolean>(false);

    const [selectedModel, setSelectedModel] = useState(data.model ?? "");

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
        // Logic for running model training would go here or in the dialog
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
                className={`relative w-64 rounded-md shadow-sm bg-white dark:bg-sidebar border border-dashed border-black/25 cursor-pointer ${loading ? "animate-pulse border-primary-500" : ""
                    } ${hasRun
                        ? "border-green-500 dark:border-green-500"
                        : "dark:border-white/15 border-black/25"
                    }`}
                onDoubleClickCapture={handleDoubleClick}
            >
                <div className="flex items-center justify-between rounded-t-md px-3 py-2 bg-gray-100 dark:bg-sidebar border-b">
                    <span className="flex items-center gap-1 font-semibold text-sm text-gray-700 dark:text-white">
                        <BrainCircuit className="w-4 h-4" />
                        <p>Model</p>
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
                            disabled={loading || !selectedModel}
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
                    <div className="space-y-1">
                        <label className="text-[10px] font-medium text-gray-500 tracking-wider">
                            Select Model
                        </label>
                        <Select
                            value={selectedModel}
                            onValueChange={(val) => {
                                setSelectedModel(val);
                                handleUpdate({ model: val });
                            }}
                        >
                            <SelectTrigger className="text-xs w-full">
                                <SelectValue placeholder="Choose a model..." />
                            </SelectTrigger>
                            <SelectContent>
                                {MODELS.map((model) => (
                                    <SelectItem key={model.value} value={model.value}>
                                        {model.label}
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

            <ModelNodeDialog
                open={open}
                onOpenChange={(v) => {
                    setOpen(v);
                }}
                nodeId={id}
                data={data}
                onUpdate={handleUpdate}
                hasRun={hasRun}
            />
        </>
    );
}

export default memo(
    ModelNode,
    (prev, next) =>
        prev.isConnectable === next.isConnectable &&
        JSON.stringify(prev.data) === JSON.stringify(next.data),
);