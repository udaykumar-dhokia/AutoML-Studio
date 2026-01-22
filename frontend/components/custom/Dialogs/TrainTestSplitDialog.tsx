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
import { Loader2, Play } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import axiosInstance from "@/utils/axios";
import { Slider } from "@/components/ui/slider";

const TrainTestSplitDialog = ({
    open,
    onOpenChange,
    nodeId,
    data,
    onUpdate,
    datasetId,
    hasRun,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nodeId: string;
    data: any;
    onUpdate: (newData: any) => void;
    datasetId: string;
    hasRun: boolean;
}) => {
    const [loading, setLoading] = useState(false);
    const [testSize, setTestSize] = useState(data.test_size || 0.2);
    const [shuffle, setShuffle] = useState(data.shuffle !== undefined ? data.shuffle : true);
    const [stratify, setStratify] = useState(data.stratify || "None");
    const [results, setResults] = useState<any>(null);

    const columns = data.columns || [];

    useEffect(() => {
        if (open) {
            setTestSize(data.test_size || 0.2);
            setShuffle(data.shuffle !== undefined ? data.shuffle : true);
            setStratify(data.stratify || "None");
        }
    }, [open]);

    useEffect(() => {
        if (hasRun) {
            handleExecute();
        }
    }, [hasRun]);

    const handleExecute = async () => {
        if (!datasetId) {
            toast.error("No dataset selected");
            return;
        }
        setLoading(true);
        try {
            const res = await axiosInstance.post("/operations/train-test-split", {
                id: datasetId,
                test_size: Number(testSize),
                shuffle: shuffle === "true" || shuffle === true,
                stratify_column: stratify === "None" ? null : stratify,
            });
            setResults(res.data);
            onUpdate({
                test_size: Number(testSize),
                shuffle: shuffle === "true" || shuffle === true,
                stratify: stratify === "None" ? null : stratify,
                hasRun: true,
            });
            toast.success("Split executed successfully");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Execution failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[1200px] min-w-[1000px] h-[80vh] flex flex-col gap-0 p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Train Test Split Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the parameters for splitting your dataset into training and testing sets.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-[300px] border-r p-4 space-y-6 bg-muted/5 overflow-y-auto">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-medium">
                                    Test Size: {(Number(testSize) * 100).toFixed(0)}%
                                </Label>
                                <Slider
                                    min={0}
                                    max={1}
                                    step={0.05}
                                    value={[Number(testSize)]}
                                    onValueChange={([val]) => {
                                        setTestSize(Number(val.toFixed(2)));
                                    }}
                                />
                                <p className="text-[10px] text-muted-foreground italic">
                                    Proportion of the dataset to include in the test split.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="shuffle" className="text-sm font-medium">Shuffle</Label>
                                <Select
                                    value={String(shuffle)}
                                    onValueChange={(val) => {
                                        setShuffle(val === "true");
                                    }}
                                >
                                    <SelectTrigger id="shuffle" className="w-full">
                                        <SelectValue placeholder="Shuffle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="true">True</SelectItem>
                                        <SelectItem value="false">False</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-[10px] text-muted-foreground italic">
                                    Whether to shuffle the data before splitting.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="stratify" className="text-sm font-medium">Stratify (Optional)</Label>
                                <Select
                                    value={stratify}
                                    onValueChange={(val) => {
                                        setStratify(val);
                                    }}
                                >
                                    <SelectTrigger id="stratify" className="w-full">
                                        <SelectValue placeholder="Select column to stratify" />
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
                                <p className="text-[10px] text-muted-foreground italic">
                                    Column to use for stratified splitting.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-6 flex flex-col bg-muted/10 relative">
                        {loading ? (
                            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <p className="text-sm font-medium">Processing split...</p>
                            </div>
                        ) : results ? (
                            <div className="space-y-6 w-full max-w-4xl mx-auto">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="bg-white dark:bg-sidebar p-4 rounded border shadow-sm flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground tracking-wider">Total Rows</span>
                                        <span className="text-2xl font-mono mt-1 font-bold">{results.total_size}</span>
                                    </div>
                                    <div className="bg-white dark:bg-sidebar p-4 rounded border shadow-sm border-l-4 border-l-primary flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground tracking-wider">Train Rows</span>
                                        <span className="text-2xl font-mono mt-1 font-bold">{results.train_size}</span>
                                        <span className="text-[10px] text-muted-foreground">({((results.train_size / results.total_size) * 100).toFixed(1)}%)</span>
                                    </div>
                                    <div className="bg-white dark:bg-sidebar p-4 rounded border shadow-sm border-l-4 border-l-orange-500 flex flex-col">
                                        <span className="text-[10px] font-bold text-muted-foreground tracking-wider">Test Rows</span>
                                        <span className="text-2xl font-mono mt-1 font-bold">{results.test_size}</span>
                                        <span className="text-[10px] text-muted-foreground">({((results.test_size / results.total_size) * 100).toFixed(1)}%)</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold  tracking-widest text-muted-foreground">Train Set Preview</h4>
                                        <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-medium">First 5 rows</span>
                                    </div>
                                    <div className="overflow-x-auto border rounded-md shadow-sm bg-white dark:bg-sidebar max-h-[220px]">
                                        <table className="min-w-full text-[11px] border-collapse">
                                            <thead className="bg-muted/50 sticky top-0">
                                                <tr className="border-b">
                                                    {results.columns?.map((col: string) => (
                                                        <th key={col} className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300 border-r last:border-r-0">{col}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.train_head?.map((row: any, i: number) => (
                                                    <tr key={i} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                                                        {results.columns?.map((col: string) => (
                                                            <td key={col} className="px-3 py-1.5 border-r last:border-r-0 truncate max-w-[150px] font-mono text-gray-600 dark:text-gray-400">
                                                                {String(row[col])}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-bold  tracking-widest text-muted-foreground">Test Set Preview</h4>
                                        <span className="text-[10px] bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded font-medium">First 5 rows</span>
                                    </div>
                                    <div className="overflow-x-auto border rounded-md shadow-sm bg-white dark:bg-sidebar max-h-[220px]">
                                        <table className="min-w-full text-[11px] border-collapse">
                                            <thead className="bg-muted/50 sticky top-0">
                                                <tr className="border-b">
                                                    {results.columns?.map((col: string) => (
                                                        <th key={col} className="px-3 py-2 text-left font-semibold text-gray-600 dark:text-gray-300 border-r last:border-r-0">{col}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {results.test_head?.map((row: any, j: number) => (
                                                    <tr key={j} className="border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                                                        {results.columns?.map((col: string) => (
                                                            <td key={col} className="px-3 py-1.5 border-r last:border-r-0 truncate max-w-[150px] font-mono text-gray-600 dark:text-gray-400">
                                                                {String(row[col])}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                                <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
                                    <Play className="h-8 w-8 text-muted-foreground/40" />
                                </div>
                                <h3 className="text-lg font-medium text-muted-foreground">Ready to Split</h3>
                                <p className="text-sm text-muted-foreground max-w-[300px] mt-2">
                                    Configure your split parameters on the left and click <strong>Execute</strong> to see the results and data distribution.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 border-t mt-auto">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                    <Button onClick={handleExecute} disabled={loading}>
                        {loading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Play className="h-4 w-4" />
                        )}
                        Execute
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TrainTestSplitDialog;
