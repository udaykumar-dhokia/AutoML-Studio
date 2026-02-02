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
import { Loader2, Play, BrainCircuit } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

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
    const [results, setResults] = useState<any>(null);

    useEffect(() => {
        if (open) {
            setSelectedModel(data.model || "");
        }
    }, [open, data.model]);

    const handleExecute = async () => {
        if (!selectedModel) {
            toast.error("Please select a model first");
            return;
        }
        setLoading(true);
        try {
            onUpdate({
                model: selectedModel,
                hasRun: true,
            });
            toast.success("Model training simulated successfully");
        } catch (error: any) {
            toast.error("Training failed: Backend not yet implemented");
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
                    <div className="w-[300px] border-r p-4 space-y-6 bg-muted/5 overflow-y-auto">
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

                            <div className="pt-4">
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Hyperparameters</h4>
                                <p className="text-[10px] text-muted-foreground italic">
                                    Advanced hyperparameter configuration will be available in future updates.
                                </p>
                            </div>
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
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-sidebar p-4 rounded border shadow-sm flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Accuracy</span>
                                        <span className="text-2xl font-mono mt-1 font-bold text-green-600">{results.accuracy}</span>
                                    </div>
                                    <div className="bg-white dark:bg-sidebar p-4 rounded border shadow-sm flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Precision</span>
                                        <span className="text-2xl font-mono mt-1 font-bold text-blue-600">{results.precision}</span>
                                    </div>
                                    <div className="bg-white dark:bg-sidebar p-4 rounded border shadow-sm flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">Recall</span>
                                        <span className="text-2xl font-mono mt-1 font-bold text-orange-600">{results.recall}</span>
                                    </div>
                                    <div className="bg-white dark:bg-sidebar p-4 rounded border shadow-sm flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground tracking-wider uppercase">F1-Score</span>
                                        <span className="text-2xl font-mono mt-1 font-bold text-purple-600">{results.f1_score}</span>
                                    </div>
                                </div>

                                <div className="p-4 rounded border bg-white dark:bg-sidebar shadow-sm">
                                    <h4 className="text-sm font-semibold mb-2">Training Status</h4>
                                    <div className="flex items-center gap-2 text-green-600">
                                        <div className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></div>
                                        <span className="text-xs font-medium">Model trained and ready for inference</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                                    <Play className="h-8 w-8 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-lg font-medium text-muted-foreground">Ready to Train</h3>
                                <p className="text-sm text-muted-foreground max-w-[300px] mt-2">
                                    Select your model type and click <strong>Train</strong> to start the training process.
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
