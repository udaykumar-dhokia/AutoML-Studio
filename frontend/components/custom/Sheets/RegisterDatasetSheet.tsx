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
import { Textarea } from "@/components/ui/textarea";
import { addDataset } from "@/store/slices/datasets.slice";
import { store } from "@/store/store";
import axiosInstance from "@/utils/axios";
import { Label } from "@radix-ui/react-label";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const RegisterDatasetSheet = () => {
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
      <SheetTrigger className="rounded-md">
        <Button className="" size={"sm"} disabled={loading}>
          <Plus className="" />
          Register Dataset
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Register Dataset</SheetTitle>
          <SheetDescription>
            Register your dataset here. Click save when you&apos;re done.
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
            <Textarea
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
          <Button
            type="submit"
            disabled={!name || !description || !file || loading}
            className="w-full cursor-pointer"
            size={"sm"}
            onClick={handleSubmit}
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Register Dataset"
            )}
          </Button>
          <SheetClose asChild>
            <Button size={"sm"} variant="outline" className="w-full">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default RegisterDatasetSheet;
