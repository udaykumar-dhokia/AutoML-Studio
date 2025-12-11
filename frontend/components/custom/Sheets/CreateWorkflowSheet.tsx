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
import { addDataset } from "@/store/slices/datasets.slice";
import { store } from "@/store/store";
import axiosInstance from "@/utils/axios";
import { Label } from "@radix-ui/react-label";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CreateWorkflowSheet = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      if (file) {
        formData.append("file", file);
      }

      const res = await axiosInstance.post("/dataset/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      store.dispatch(addDataset(res.data));
      toast.success("Dataset uploaded successfully");
      setOpen(false);
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
        <Button className="bg-black rounded-md" disabled={loading}>
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
              placeholder="Dataset Name"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sheet-description">Description</Label>
            <Input
              id="sheet-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dataset Description"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="sheet-file">File</Label>
            <Input
              id="sheet-file"
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <SheetFooter>
          <Button type="submit" className="bg-black" onClick={handleSubmit}>
            {loading ? <Loader2 className="animate-spin" /> : "Save changes"}
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
