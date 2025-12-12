"use client";

import Navbar from "@/components/custom/Navbar";
import { RootState, store } from "@/store/store";
import { useSelector } from "react-redux";
import CreateWorkflowSheet from "@/components/custom/Sheets/CreateWorkflowSheet";
import { useRouter } from "next/navigation";
import { setCurrentWorkflow } from "@/store/slices/currentWorkflow.slice";
import { Button } from "@/components/ui/button";
import { Play, Share2, Trash } from "lucide-react";

const page = () => {
  const { workflows } = useSelector((state: RootState) => state.allWorkflows);
  const router = useRouter();

  return (
    <div>
      <Navbar title="Models">
        <CreateWorkflowSheet />
      </Navbar>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {workflows.map((workflow) => (
            <div
              key={workflow._id}
              onClick={() => {
                store.dispatch(setCurrentWorkflow(workflow));
                localStorage.setItem(
                  "currentWorkflow",
                  JSON.stringify(workflow)
                );
                router.push(`/workflow`);
              }}
              className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md hover:border-blue-500 transition-all duration-200 cursor-pointer flex flex-col justify-between h-44"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800 truncate">
                  {workflow.name}
                </h2>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {workflow.description}
                </p>
              </div>
              <div className="border-t pt-2 flex justify-end gap-1 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-gray-100"
                >
                  <Share2 className="w-3.5 h-3.5 text-gray-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                >
                  <Trash className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-blue-50 hover:text-black"
                >
                  <Play className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default page;
