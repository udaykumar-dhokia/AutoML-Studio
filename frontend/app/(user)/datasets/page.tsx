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
    <div>
      <Navbar title="Datasets">
        <RegisterDatasetSheet />
      </Navbar>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {datasets?.map((dataset: TDataset) => (
          <div
            key={dataset._id}
            className="border border-dashed rounded-md p-4 flex flex-col justify-between items-start"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileSpreadsheet className="w-8 h-8" />
              <div className="">
                <p className="text-lg font-medium">{dataset.name}</p>
                <p className="text-sm font-light">{dataset.description}</p>
              </div>
            </div>

            <div className="flex justify-between w-full items-center">
              <div className="">
                <a href={dataset.url} target="_blank" className="text-gray-500">
                  {dataset.url.substring(0, 35)}...
                </a>
              </div>

              <div className="flex gap-2">
                <Button variant={"outline"}>
                  <Share2 />
                </Button>
                <Button
                  variant={"outline"}
                  className="hover:bg-red-600 hover:text-white"
                >
                  <Trash />
                </Button>
                <Button className="bg-blue-900 text-white" variant={"default"}>
                  <BrainCircuit />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
