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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axiosInstance from "@/utils/axios";
import { Loader2, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const STRATEGIES = ["IQR Method", "Z-Score Method", "Capping"];

const HandleOutliersDialog = ({
  open,
  onOpenChange,
  datasetId,
  columns,
  selectedColumn,
  selectedStrategy,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datasetId: string;
  columns: string[];
  selectedColumn: string;
  selectedStrategy: string;
}) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    columns: string[];
    data: any[];
    null_count: number;
  } | null>(null);
  const [column, setColumn] = useState<string>();
  const [strategy, setStrategy] = useState<string>();

  useEffect(() => {
    setColumn(selectedColumn);
    setStrategy(selectedStrategy);
  }, [selectedColumn, selectedStrategy]);

  const setSelectedColumn = (column: string) => {
    setColumn(column);
  };

  const setSelectedStrategy = (strategy: string) => {
    setStrategy(strategy);
  };

  const handleExecute = async () => {
    if (!datasetId || !selectedColumn || !selectedStrategy) {
      toast.error("Please select both a column and a strategy");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/operations/handle_outliers", {
        id: datasetId,
        column: column,
        method: strategy,
      });

      if (res.data.handle_outliers) {
        setResult(res.data.handle_outliers || res.data);
        toast.success("Successfully processed outliers");
      } else {
        setResult(res.data);
        toast.success("Successfully processed outliers");
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
      <DialogContent className="max-w-[100vw] h-[70vh] flex flex-col gap-0 p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Handle Outliers</DialogTitle>
          <DialogDescription>
            Choose a column and a strategy to handle outliers.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Column</label>
              <Select
                value={column}
                onValueChange={(value) => setSelectedColumn(value)}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a column" />
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
              <label className="text-sm font-medium">Select Strategy</label>
              <Select
                value={strategy}
                onValueChange={(value) => setSelectedStrategy(value)}
                disabled={loading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent>
                  {STRATEGIES.map((strategy) => (
                    <SelectItem key={strategy} value={strategy}>
                      {strategy}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {result && (
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-none border">
                <span className="text-sm font-medium">Result Info:</span>
                <span className="font-mono text-lg font-bold">Processed</span>
              </div>

              <div className="border rounded-none overflow-hidden">
                <Table>
                  <TableHeader className="bg-muted">
                    <TableRow>
                      <TableHead className="w-[50px]">#</TableHead>
                      {result.columns.map((col) => (
                        <TableHead key={col} className="whitespace-nowrap">
                          {col}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {result.data.map((row, idx) => (
                      <TableRow key={idx}>
                        <TableCell className="text-muted-foreground text-xs">
                          {idx + 1}
                        </TableCell>
                        {result.columns.map((col) => (
                          <TableCell key={`${idx}-${col}`}>
                            {row[col] === null ? (
                              <span className="text-muted-foreground italic">
                                null
                              </span>
                            ) : (
                              String(row[col])
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="px-6 py-4 border-t mt-auto">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button
            onClick={handleExecute}
            disabled={loading || !selectedColumn || !selectedStrategy}
          >
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

export default HandleOutliersDialog;
