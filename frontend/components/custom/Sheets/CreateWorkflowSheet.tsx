"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { addWorkflow } from "@/store/slices/allWorkflows.slice";
import { setCurrentWorkflow } from "@/store/slices/currentWorkflow.slice";
import { RootState, store } from "@/store/store";
import axiosInstance from "@/utils/axios";
import { Label } from "@radix-ui/react-label";
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const CreateWorkflowSheet = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const { workflows } = useSelector((state: RootState) => state.allWorkflows);
  const [nameExists, setNameExists] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkNameExists = async (workflowName: string) => {
      if (workflowName.trim() === "") {
        return;
      }
      const workflowExists = workflows.some(
        (workflow) => workflow.name === workflowName
      );
      if (workflowExists) {
        setNameExists(true);
      } else {
        setNameExists(false);
      }
    };

    const handler = setTimeout(() => {
      checkNameExists(name);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [name]);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);

      const res = await axiosInstance.post("/workflow/", formData);
      store.dispatch(addWorkflow(res.data));
      toast.success("Workflow created successfully");
      setName("");
      setDescription("");
      store.dispatch(setCurrentWorkflow(res.data));
      setOpen(false);
      router.push("/workflow");
    } catch (error: any) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="bg-black rounded-md">
        <Button
          className="bg-black dark:bg-white rounded-md"
          disabled={loading}
        >
          <Plus className="" />
          Create Workflow
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Workflow</SheetTitle>
          <SheetDescription>
            Create your workflow here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="grid flex-1 auto-rows-min gap-4 p-4">
          <div className="grid gap-2">
            <Label htmlFor="sheet-name">Name</Label>
            <Input
              id="sheet-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Workflow Name"
            />
            {nameExists && (
              <p className="text-red-500 text-sm">
                A workflow with this name already exists.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="sheet-description">Description</Label>
            <Input
              id="sheet-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Workflow Description"
            />
          </div>
        </div>

        <SheetFooter>
          <Button
            disabled={!name || !description || loading || nameExists}
            type="submit"
            className="bg-black dark:bg-white"
            onClick={handleSubmit}
          >
            {loading ? <Loader2 className="animate-spin" /> : "Create Workflow"}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default CreateWorkflowSheet;
