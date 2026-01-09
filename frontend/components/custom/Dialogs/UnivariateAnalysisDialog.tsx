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
import axiosInstance from "@/utils/axios";
import { Loader2, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const visualizationOptions = ["Histogram", "Box Plot", "Bar Chart", "Pie Chart", "Count Plot"];

const UnivariateAnalysisDialog = ({
    open,
    onOpenChange,
    datasetId,
    column,
    visualiseType,
    columns,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    datasetId: string;
    column: string;
    visualiseType: string;
    columns: string[];
}) => {
    const [loading, setLoading] = useState(false);
    const [imageData, setImageData] = useState<string | null>(null);
    const [selectedColumn, setSelectedColumn] = useState(column);
    const [selectedVisualiseType, setSelectedVisualiseType] = useState(visualiseType);

    useEffect(() => {
        if (open) {
            setSelectedColumn(column);
            setSelectedVisualiseType(visualiseType);
            setImageData(null);
        }
    }, [open, column, visualiseType]);

    const handleExecute = async () => {
        if (!datasetId || !selectedColumn || !selectedVisualiseType) {
            toast.error("Missing required parameters for analysis");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post("/operations/visualise/univariate", {
                id: datasetId,
                column: selectedColumn,
                visualiseType: selectedVisualiseType,
            });

            if (res.data.univariate_analysis) {
                setImageData(`data:image/png;base64,${res.data.univariate_analysis}`);
                toast.success("Executed successfully");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[1200px] min-w-[1000px] h-[80vh] flex flex-col gap-0 p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Univariate Analysis</DialogTitle>
                    <DialogDescription>
                        Visualize the distribution of a single variable.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-[300px] border-r p-4 space-y-4 bg-muted/5 overflow-y-auto">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Column</label>
                            <Select
                                value={selectedColumn}
                                onValueChange={setSelectedColumn}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Column" />
                                </SelectTrigger>
                                <SelectContent>
                                    {columns.map((col) => (
                                        <SelectItem key={col} value={col}>
                                            {col}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Visualization Type</label>
                            <Select
                                value={selectedVisualiseType}
                                onValueChange={setSelectedVisualiseType}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {visualizationOptions.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-muted/10 relative">
                        {loading ? (
                            <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <p className="text-sm">Generating visualization...</p>
                            </div>
                        ) : imageData ? (
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <div className="relative w-full h-full min-h-[400px] flex items-center justify-center rounded-none bg-white p-4 shadow-none">
                                    <img
                                        src={imageData}
                                        alt="Univariate Analysis Result"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground font-medium">
                                    {selectedVisualiseType} of {selectedColumn}
                                </p>
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground">
                                <p>Select options on the left and click Execute.</p>
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

export default UnivariateAnalysisDialog;