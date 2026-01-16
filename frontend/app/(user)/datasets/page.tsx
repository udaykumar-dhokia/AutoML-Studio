"use client";

import Loader from "@/components/custom/Loader";
import Navbar from "@/components/custom/Navbar";
import usePageTitle from "@/components/custom/PageTitle";
import RegisterDatasetSheet from "@/components/custom/Sheets/RegisterDatasetSheet";
import { Button } from "@/components/ui/button";
import { deleteDataset, TDataset } from "@/store/slices/datasets.slice";
import { RootState, store } from "@/store/store";
import axiosInstance from "@/utils/axios";
import {
  BrainCircuit,
  Database,
  Loader2,
  Share2,
  Trash,
} from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const page = () => {
  const { datasets } = useSelector((state: RootState) => state.dataset);
  const [loading, setLoading] = useState(false);
  const { loading: datasetLoading } = useSelector(
    (state: RootState) => state.dataset
  );

  usePageTitle("Datasets | AutoML Studio");

  const handleDelete = async (id: string) => {
    if (!id) return;
    try {
      setLoading(true);
      const res = await axiosInstance.delete(`/dataset/${id}`);
      store.dispatch(deleteDataset(id));
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (datasetLoading) {
    return <Loader />;
  }
  return (
    <div className=" min-h-screen">
      <Navbar title="Datasets">
        <RegisterDatasetSheet />
      </Navbar>
      <div className="p-6">
        {datasets && datasets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="bg-gray-100 dark:bg-muted p-4 rounded-full mb-4">
              <Database className="w-8 h-8 text-gray-400" />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {datasets?.map((dataset: TDataset) => (
              <div
                key={dataset._id}
                className="group bg-white dark:bg-sidebar border border-gray-200 dark:border-gray-800 rounded-xl p-3 shadow-sm transition-shadow cursor-pointer flex flex-col h-44 hover:border-blue-500 "
              >
                <div className="flex justify-between items-start">
                  <div className="rounded-lg">
                    <Database className="w-7 h-7 text-black dark:text-white" />
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
                    onClick={() => {
                      handleDelete(dataset._id);
                    }}
                    className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 dark:text-gray-400 animate-spin" />
                    ) : (
                      <Trash className="w-3.5 h-3.5 dark:text-gray-400" />
                    )}
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
