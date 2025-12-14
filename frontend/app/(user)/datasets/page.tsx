"use client";
import Navbar from "@/components/custom/Navbar";
import RegisterDatasetSheet from "@/components/custom/Sheets/RegisterDatasetSheet";
import { Button } from "@/components/ui/button";
import { TDataset } from "@/store/slices/datasets.slice";
import { RootState } from "@/store/store";
import { BrainCircuit, FileSpreadsheet, Share2, Trash } from "lucide-react";
import { useSelector } from "react-redux";

const page = () => {
  const { datasets } = useSelector((state: RootState) => state.dataset);

  return (
    <div className=" min-h-screen">
      <Navbar title="Datasets">
        <RegisterDatasetSheet />
      </Navbar>
      <div className="p-6">
        {datasets && datasets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="bg-gray-100 dark:bg-muted p-4 rounded-full mb-4">
              <FileSpreadsheet className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              No datasets registered yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Register your first dataset to start looking for insights and
              training models.
            </p>
            <RegisterDatasetSheet />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {datasets?.map((dataset: TDataset) => (
              <div
                key={dataset._id}
                className="group bg-white dark:bg-sidebar border border-gray-200 dark:border-gray-800 rounded-xl p-3 shadow-sm transition-shadow cursor-pointer flex flex-col h-44 hover:border-blue-500 "
              >
                <div className="flex justify-between items-start">
                  <div className="rounded-lg">
                    <FileSpreadsheet className="w-7 h-7 text-black dark:text-white" />
                  </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col justify-end">
                  <p
                    className="text-lg font-medium truncate text-gray-900 mb-1 dark:text-white"
                    title={dataset.name}
                  >
                    {dataset.name}
                  </p>
                  <p className="text-md text-gray-500 truncate mb-3 dark:text-gray-400">
                    {dataset.description || "No description"}
                  </p>
                </div>

                <div className="border-t pt-2 flex justify-end gap-1 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-gray-100"
                  >
                    <Share2 className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash className="w-3.5 h-3.5 dark:text-gray-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-blue-50 hover:text-black"
                  >
                    <BrainCircuit className="w-3.5 h-3.5 dark:text-gray-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
