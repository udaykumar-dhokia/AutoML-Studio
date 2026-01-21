import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import axiosInstance from "@/utils/axios";
import { Loader2, Play, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DatasetNodeDialog = ({
  open,
  onOpenChange,
  datasetId,
  onColumnsUpdate,
  head,
  tail,
  info,
  describe,
  columns,
  loading,
  setLoading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  datasetId: string;
  onColumnsUpdate?: (columns: string[]) => void;
  head: any[] | null;
  tail: any[] | null;
  info: any | null;
  describe: any | null;
  columns: string[] | null;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}) => {
  const [copied, setCopied] = useState<string | null>(null);

  const handleExecute = async () => {
    if (!datasetId) return;
    try {
      setLoading(true);
      const res = await axiosInstance.get("/operations/dataset", {
        params: {
          id: datasetId,
        },
      });
      head = res.data["head"] || null;
      tail = res.data["tail"] || null;
      info = res.data["info"] || null;
      describe = res.data["describe"] || null;
      columns = res.data["columns"] || null;
      if (onColumnsUpdate && res.data["columns"]) {
        onColumnsUpdate(res.data["columns"]);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const renderTable = (data: any[]) => (
    <div className="border rounded-none overflow-auto h-[60vh] relative">
      <Table>
        <TableHeader className="sticky top-0 bg-secondary z-10 shadow-sm">
          <TableRow>
            <TableHead className="w-[50px]">#</TableHead>
            {columns?.map((item) => (
              <TableHead key={item} className="whitespace-nowrap font-bold">
                {item}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, index) => (
            <TableRow key={index} className="hover:bg-muted/50">
              <TableCell className="font-mono text-xs text-muted-foreground w-[50px]">
                {index + 1}
              </TableCell>
              {columns?.map((column) => (
                <TableCell key={column} className="whitespace-nowrap">
                  {item[column] !== null ? (
                    String(item[column])
                  ) : (
                    <span className="text-muted-foreground italic">null</span>
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[80vw] min-w-[60vw] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl">Dataset Inspector</DialogTitle>
          <DialogDescription>
            View and analyze your dataset contents and statistics.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden p-6 bg-muted/10">
          {!head && !loading && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <p>Click "Execute" to load dataset preview.</p>
            </div>
          )}

          {loading && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mb-4" />
              <p>Loading dataset...</p>
            </div>
          )}

          {head && !loading && (
            <Tabs defaultValue="info" className="h-full flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <TabsList className="grid w-[400px] grid-cols-5">
                  <TabsTrigger value="info">Info</TabsTrigger>
                  <TabsTrigger value="head">Head</TabsTrigger>
                  <TabsTrigger value="tail">Tail</TabsTrigger>
                  <TabsTrigger value="describe">Stats</TabsTrigger>
                  <TabsTrigger value="columns">Cols</TabsTrigger>
                </TabsList>
                <div className="text-sm text-muted-foreground">
                  {info?.rows?.toLocaleString()} rows × {info?.columns} columns
                </div>
              </div>

              <div className="flex-1 overflow-hidden">
                <TabsContent
                  value="info"
                  className="h-full m-0 overflow-auto pr-2"
                >
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                    <div className="p-4 border rounded-none bg-card text-card-foreground shadow-sm">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Total Rows
                      </h3>
                      <div className="text-2xl font-bold mt-1">
                        {info?.rows?.toLocaleString()}
                      </div>
                    </div>
                    <div className="p-4 border rounded-none bg-card text-card-foreground shadow-sm">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Total Columns
                      </h3>
                      <div className="text-2xl font-bold mt-1">
                        {info?.columns}
                      </div>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-3">Column Details</h3>
                  <div className="border rounded-none overflow-hidden">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <TableHead>Column Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">
                            Unique Values
                          </TableHead>
                          <TableHead className="text-right">
                            Missing Values
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(info?.column_info || {}).map(
                          ([col, stats]: [string, any]) => (
                            <TableRow key={col}>
                              <TableCell className="font-medium">
                                {col}
                              </TableCell>
                              <TableCell>
                                <span className="inline-flex items-center rounded-none border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                  {stats.dtype}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                {stats.unique_count?.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-right">
                                <span
                                  className={
                                    stats.null_count > 0
                                      ? "text-red-500 font-medium"
                                      : "text-muted-foreground"
                                  }
                                >
                                  {stats.null_count?.toLocaleString()}
                                </span>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent value="head" className="h-full m-0">
                  {renderTable(head)}
                </TabsContent>

                <TabsContent value="tail" className="h-full m-0">
                  {renderTable(tail!)}
                </TabsContent>

                <TabsContent
                  value="describe"
                  className="h-full m-0 overflow-auto"
                >
                  <div className="border rounded-none overflow-auto">
                    <Table>
                      <TableHeader className="bg-muted">
                        <TableRow>
                          <TableHead>Statistic</TableHead>
                          {Object.keys(describe || {}).map((col) => (
                            <TableHead key={col} className="whitespace-nowrap">
                              {col}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[
                          "count",
                          "mean",
                          "std",
                          "min",
                          "25%",
                          "50%",
                          "75%",
                          "max",
                        ].map((stat) => (
                          <TableRow key={stat}>
                            <TableCell className="font-medium bg-muted/30 capitalize">
                              {stat}
                            </TableCell>
                            {Object.keys(describe || {}).map((col) => (
                              <TableCell key={`${col}-${stat}`}>
                                {describe[col][stat] !== null
                                  ? typeof describe[col][stat] === "number"
                                    ? describe[col][stat].toLocaleString(
                                      undefined,
                                      { maximumFractionDigits: 2 }
                                    )
                                    : describe[col][stat]
                                  : "-"}
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                <TabsContent
                  value="columns"
                  className="h-full m-0 overflow-auto"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {columns?.map((item, index) => (
                      <div
                        key={item}
                        className="flex items-center justify-between p-3 border rounded-none hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                            {index + 1}
                          </span>
                          <span className="truncate font-medium" title={item}>
                            {item}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => copyToClipboard(item, item)}
                        >
                          {copied === item ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          )}
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

export default DatasetNodeDialog;
