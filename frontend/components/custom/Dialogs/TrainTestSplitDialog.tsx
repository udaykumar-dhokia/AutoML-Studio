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
import { Input } from "@/components/ui/input";
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
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    nodeId: string;
    data: any;
    onUpdate: (newData: any) => void;
}) => {
    const [loading, setLoading] = useState(false);
    const [testSize, setTestSize] = useState(data.test_size || 0.2);
    const [shuffle, setShuffle] = useState(data.shuffle !== undefined ? data.shuffle : true);
    const [stratify, setStratify] = useState(data.stratify || "None");

    const columns = data.columns || [];

    useEffect(() => {
        setTestSize(data.test_size || 0.2);
        setShuffle(data.shuffle !== undefined ? data.shuffle : true);
        setStratify(data.stratify || "None");
    }, [data, open]);

    const handleSave = () => {
        onUpdate({
            test_size: Number(testSize),
            shuffle: shuffle === "true" || shuffle === true,
            stratify: stratify === "None" ? null : stratify,
        });
        onOpenChange(false);
        toast.success("Split parameters saved");
    };

    const handleExecute = async () => {
        setLoading(true);
        try {
            // const res = await axiosInstance.post("/operations/train-test-split", { ... });
            onUpdate({
                test_size: Number(testSize),
                shuffle: shuffle === "true" || shuffle === true,
                stratify: stratify === "None" ? null : stratify,
            });
            toast.success("Split executed (Simulation)");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Execution failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[400px] w-[400px]">
                <DialogHeader>
                    <DialogTitle>Train Test Split Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the parameters for splitting your dataset.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>
                            Test Size: {(Number(testSize) * 100).toFixed(0)}%
                        </Label>

                        <Slider
                            min={0}
                            max={1}
                            step={0.05}
                            value={[Number(testSize)]}
                            onValueChange={([val]) => {
                                onUpdate({
                                    test_size: Number(val.toFixed(2)),
                                    shuffle,
                                    stratify: stratify === "None" ? null : stratify,
                                });
                            }}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="shuffle">Shuffle</Label>
                        <Select
                            value={String(shuffle)}
                            onValueChange={(val) => {
                                onUpdate({
                                    test_size: Number(testSize),
                                    shuffle: val,
                                    stratify: stratify === "None" ? null : stratify,
                                });
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
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="stratify">Stratify (Optional)</Label>
                        <Select
                            value={stratify}
                            onValueChange={(val) => {
                                onUpdate({
                                    test_size: Number(testSize),
                                    shuffle: shuffle,
                                    stratify: val,
                                });
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
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleExecute} disabled={loading}>
                        {loading && <Loader2 className="mr h-4 w-4 animate-spin" />}
                        <Play className="h-4 w-4" />
                        Execute
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default TrainTestSplitDialog;
