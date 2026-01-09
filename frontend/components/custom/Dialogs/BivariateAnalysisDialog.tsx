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

const visualizationOptions = ["Scatter Plot", "Line Chart", "Bar Chart", "Box Plot", "Violin Plot", "Heatmap"];

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    datasetId: string;
    columnX: string;
    columnY: string;
    visualiseType: string;
    columns: string[];
    openAndExecute: boolean;
}

const BivariateAnalysisDialog = ({
    open,
    onOpenChange,
    datasetId,
    columnX,
    columnY,
    visualiseType,
    columns,
    openAndExecute
}: Props) => {
    const [loading, setLoading] = useState(false);
    const [imageData, setImageData] = useState<string | null>(null);
    const [selectedColumnX, setSelectedColumnX] = useState(columnX);
    const [selectedColumnY, setSelectedColumnY] = useState(columnY);
    const [selectedVisualiseType, setSelectedVisualiseType] = useState(visualiseType);
    const [execute, setExecute] = useState(openAndExecute);

    useEffect(() => {
        if (open) {
            setSelectedColumnX(columnX);
            setSelectedColumnY(columnY);
            setSelectedVisualiseType(visualiseType);
            setImageData(null);
            setExecute(openAndExecute);
        }
    }, [open, columnX, columnY, visualiseType]);

    useEffect(() => {
        if (open && execute) {
            handleExecute();
        }
    }, [open, execute]);

    const handleExecute = async () => {
        if (!datasetId || !selectedColumnX || !selectedColumnY || !selectedVisualiseType) {
            toast.error("Missing required parameters for analysis");
            return;
        }

        try {
            setLoading(true);
            const res = await axiosInstance.post("/operations/visualise/bivariate", {
                id: datasetId,
                column: selectedColumnX,
                target: selectedColumnY,
                visualiseType: selectedVisualiseType,
            });

            if (res.data.bivariate_analysis) {
                setImageData(`data:image/png;base64,${res.data.bivariate_analysis}`);
                toast.success("Bivariate Analysis generated successfully");
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to generate analysis");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[1200px] min-w-[1000px] h-[80vh] flex flex-col gap-0 p-0">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Bivariate Analysis</DialogTitle>
                    <DialogDescription>
                        Visualize the relationship between two variables.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-[300px] border-r p-4 space-y-4 bg-muted/5 overflow-y-auto">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Column X</label>
                            <Select
                                value={selectedColumnX}
                                onValueChange={setSelectedColumnX}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Column X" />
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
                            <label className="text-sm font-medium">Column Y (Target)</label>
                            <Select
                                value={selectedColumnY}
                                onValueChange={setSelectedColumnY}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select Column Y" />
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
                                        alt="Bivariate Analysis Result"
                                        className="max-w-full max-h-full object-contain"
                                    />
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground font-medium">
                                    {selectedVisualiseType} of {selectedColumnX} vs {selectedColumnY}
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

export default BivariateAnalysisDialog;
