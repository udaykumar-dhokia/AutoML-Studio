import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Loader2, Play, BrainCircuit, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";

const ModelNodeDialog = ({
    open,
    onOpenChange,
    nodeId,
    data,
    onUpdate,
    hasRun,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nodeId: string;
    data: any;
    onUpdate: (newData: any) => void;
    hasRun: boolean;
}) => {
    const [loading, setLoading] = useState(false);
    const [selectedModel, setSelectedModel] = useState(data.model || "");
    const [results, setResults] = useState<any>(data.results || null);

    // Config states
    const [features, setFeatures] = useState<string[]>(data.features || []);
    const [target, setTarget] = useState<string>(data.target || "");
    const [testSize, setTestSize] = useState<number>(data.test_size || 0.2);
    const [randomState, setRandomState] = useState<number>(data.random_state || 42);

    const columns = data.columns || [];
    const datasetId = data.selectedDataset || "";

    useEffect(() => {
        if (open) {
            setSelectedModel(data.model || "");
            setResults(data.results || null);
            setFeatures(data.features || []);
            setTarget(data.target || "");
            setTestSize(data.test_size || 0.2);
            setRandomState(data.random_state || 42);
        }
    }, [open, data]);

    const toggleFeature = (column: string) => {
        if (features.includes(column)) {
            setFeatures(features.filter(f => f !== column));
        } else {
            setFeatures([...features, column]);
        }
    };

    const handleExecute = async () => {
        if (!selectedModel) {
            toast.error("Please select a model first");
            return;
        }

        if (selectedModel === "linear_regression") {
            if (features.length === 0) {
                toast.error("Please select at least one feature");
                return;
            }
            if (!target) {
                toast.error("Please select a target column");
                return;
            }
            if (features.includes(target)) {
                toast.error("Target column cannot be one of the feature columns");
                return;
            }
        }

        setLoading(true);
        try {
            let res;
            if (selectedModel === "linear_regression") {
                res = await axiosInstance.post(`/operations/model/linear-regression`, {
                    id: datasetId,
                    features,
                    target,
                    test_size: testSize,
                    random_state: randomState
                });
            } else {
                await new Promise(resolve => setTimeout(resolve, 1500));
                throw new Error(`Model ${selectedModel} is not yet fully integrated in the backend.`);
            }

            setResults(res.data);
            onUpdate({
                model: selectedModel,
                features,
                target,
                test_size: testSize,
                random_state: randomState,
                results: res.data,
                hasRun: true,
            });
            toast.success("Model trained successfully");
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || "Training failed";
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[1000px] min-w-[800px] h-[70vh] flex flex-col gap-0 p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle className="flex items-center gap-2">
                        Model Configuration
                    </DialogTitle>
                    <DialogDescription>
                        Select and configure your machine learning model for training.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-[350px] border-r p-4 space-y-6 bg-muted/5 overflow-y-auto">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="model-select" className="text-sm font-medium">Model Type</Label>
                                <Select
                                    value={selectedModel}
                                    onValueChange={(val) => {
                                        setSelectedModel(val);
                                        onUpdate({ model: val });
                                    }}
                                >
                                    <SelectTrigger id="model-select" className="w-full">
                                        <SelectValue placeholder="Select Model" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="linear_regression">Linear Regression</SelectItem>
                                        <SelectItem value="logistic_regression">Logistic Regression</SelectItem>
                                        <SelectItem value="random_forest_classifier">Random Forest Classifier</SelectItem>
                                        <SelectItem value="random_forest_regressor">Random Forest Regressor</SelectItem>
                                        <SelectItem value="xgboost_classifier">XGBoost Classifier</SelectItem>
                                        <SelectItem value="xgboost_regressor">XGBoost Regressor</SelectItem>
                                        <SelectItem value="svc">Support Vector Machine</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {selectedModel === "linear_regression" && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Target Column</Label>
                                        <Select value={target} onValueChange={setTarget}>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select Target" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {columns.map((col: string) => (
                                                    <SelectItem key={col} value={col}>{col}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-medium">Feature Columns</Label>
                                        <div className="border rounded-md p-2 h-40 overflow-y-auto bg-white dark:bg-background">
                                            {columns.map((col: string) => (
                                                <div key={col} className="flex items-center space-x-2 p-1 hover:bg-muted/50 rounded cursor-pointer" onClick={() => toggleFeature(col)}>
                                                    <input
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                        checked={features.includes(col)}
                                                        onChange={() => { }} // Handled by div click
                                                    />
                                                    <span className="text-xs truncate">{col}</span>
                                                </div>
                                            ))}
                                            {columns.length === 0 && <p className="text-xs text-muted-foreground p-2">No columns available. Connect to a dataset first.</p>}
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">{features.length} features selected</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-2">
                                        <div className="space-y-2">
                                            <Label className="text-xs">Test Size</Label>
                                            <Input
                                                type="number"
                                                step="0.05"
                                                min="0.1"
                                                max="0.5"
                                                value={testSize}
                                                onChange={(e) => setTestSize(parseFloat(e.target.value))}
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs">Random State</Label>
                                            <Input
                                                type="number"
                                                value={randomState}
                                                onChange={(e) => setRandomState(parseInt(e.target.value))}
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {selectedModel && selectedModel !== "linear_regression" && (
                                <div className="pt-4 p-4 border rounded-md bg-yellow-500/10 border-yellow-500/20">
                                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                                        Configuration for <strong>{selectedModel.replace(/_/g, " ")}</strong> is coming soon. Currently only Linear Regression is fully integrated.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-6 flex flex-col bg-muted/10 relative">
                        {loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <p className="text-sm font-medium">Training model...</p>
                            </div>
                        ) : results ? (
                            <div className="space-y-6 w-full max-w-2xl mx-auto">
                                <div className="p-4 rounded-lg border bg-green-500/5 border-green-500/20">
                                    <div className="flex items-center gap-2 text-green-600 mb-4">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <h4 className="font-semibold text-sm">Model Training Complete</h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-white dark:bg-sidebar p-4 rounded border shadow-sm flex flex-col">
                                            <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Mean Squared Error</span>
                                            <span className="text-2xl font-mono mt-1 font-bold text-primary">{results.mse?.toFixed(4)}</span>
                                        </div>
                                        <div className="bg-white dark:bg-sidebar p-4 rounded border shadow-sm flex flex-col">
                                            <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">R² Score</span>
                                            <span className="text-2xl font-mono mt-1 font-bold text-green-600">{results.r2?.toFixed(4)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded border bg-white dark:bg-sidebar shadow-sm">
                                    <h4 className="text-sm font-semibold mb-3">Sample Predictions</h4>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2 font-medium text-muted-foreground uppercase tracking-wider">Actual Value</th>
                                                    <th className="text-left py-2 font-medium text-muted-foreground uppercase tracking-wider">Predicted Value</th>
                                                    <th className="text-left py-2 font-medium text-muted-foreground uppercase tracking-wider">Error</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.predictions?.map((pred: any, i: number) => (
                                                    <tr key={i} className="border-b last:border-0 hover:bg-muted/30">
                                                        <td className="py-2 font-mono">{pred.actual?.toFixed(4)}</td>
                                                        <td className="py-2 font-mono">{pred.predicted?.toFixed(4)}</td>
                                                        <td className={`py-2 font-mono ${Math.abs(pred.actual - pred.predicted) > 0.5 ? 'text-red-500' : 'text-green-500'}`}>
                                                            {Math.abs(pred.actual - pred.predicted).toFixed(4)}
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {results.coefficients && (
                                    <div className="p-4 rounded border bg-white dark:bg-sidebar shadow-sm">
                                        <h4 className="text-sm font-semibold mb-3">Model Coefficients</h4>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="p-2 bg-muted/30 rounded flex justify-between items-center">
                                                <span className="text-[10px] font-medium uppercase text-muted-foreground">Intercept</span>
                                                <span className="text-xs font-mono font-bold">{results.intercept?.toFixed(4)}</span>
                                            </div>
                                            {Object.entries(results.coefficients).map(([feat, coef]: [string, any]) => (
                                                <div key={feat} className="p-2 bg-muted/30 rounded flex justify-between items-center">
                                                    <span className="text-[10px] font-medium uppercase text-muted-foreground truncate mr-2">{feat}</span>
                                                    <span className="text-xs font-mono font-bold">{coef?.toFixed(4)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                                    <Play className="h-8 w-8 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-lg font-medium text-muted-foreground">Ready to Train</h3>
                                <p className="text-sm text-muted-foreground max-w-[300px] mt-2">
                                    Select your target and features, then click <strong>Train</strong> to start the training process.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t mt-auto">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button onClick={handleExecute} disabled={loading || !selectedModel}>
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                        Train
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModelNodeDialog;
