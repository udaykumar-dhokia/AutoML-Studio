"use client";

import Navbar from "@/components/custom/Navbar";
import { RootState, store } from "@/store/store";
import { useSelector } from "react-redux";
import CreateWorkflowSheet from "@/components/custom/Sheets/CreateWorkflowSheet";
import { useRouter } from "next/navigation";
import { setCurrentWorkflow } from "@/store/slices/currentWorkflow.slice";
import { Button } from "@/components/ui/button";
import { Play, Share2, Trash, Bot, Box } from "lucide-react";
import usePageTitle from "@/components/custom/PageTitle";
import Loader from "@/components/custom/Loader";
import { DeleteWorkflowDialog } from "@/components/custom/Dialogs/DeleteWorkflowDialog";
import { toast } from "sonner";
import { useState } from "react";
import axiosInstance from "@/utils/axios";
import { deleteWorkflow } from "@/store/slices/allWorkflows.slice";

const page = () => {
  const { workflows } = useSelector((state: RootState) => state.allWorkflows);
  const router = useRouter();
  const { loading: workflowLoading } = useSelector(
    (state: RootState) => state.allWorkflows
  );
  const [loading, setLoading] = useState(false);

  const handleNavigate = (workflow: any) => {
    store.dispatch(setCurrentWorkflow(workflow));
    localStorage.setItem("currentWorkflowId", workflow._id);
    router.push(`/workflow`);
  };

  usePageTitle("Models | AutoML Studio");

  if (workflowLoading) {
    return <Loader />;
  }



  return (
    <div className="min-h-screen bg-black">
      <Navbar title="Models">
        <CreateWorkflowSheet />
      </Navbar>
      <div className="p-6">
        {workflows.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="bg-gray-100 dark:bg-muted p-4 rounded-full mb-4">
              <Bot className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">
              No models created yet
            </h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Create your first workflow to start building and training models.
            </p>
            <CreateWorkflowSheet />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
            {workflows.map((workflow) => (
              <div
                key={workflow._id}
                className="group bg-white dark:bg-sidebar border hover:dark:border-primary/40 rounded-none p-3 shadow-sm transition-all duration-200 hover:shadow-md hover:border-blue-500 cursor-pointer flex flex-col h-44"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="rounded-none">
                    <Box className="w-7 h-7 text-black dark:text-white" />
                  </div>
                </div>

                <div className="flex-1 min-h-0 flex flex-col justify-end">
                  <h2
                    className="text-lg font-semibold text-gray-900 dark:text-white truncate mb-1"
                    title={workflow.name}
                  >
                    {workflow.name}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate mb-3">
                    {workflow.description || "No description provided"}
                  </p>
                </div>

                <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-end gap-1 opacity-100 transition-opacity">
                  <DeleteWorkflowDialog id={workflow._id} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-blue-50 hover:text-blue-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNavigate(workflow);
                    }}
                  >
                    <Play className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
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
