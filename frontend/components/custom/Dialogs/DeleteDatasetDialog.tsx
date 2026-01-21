import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { TDataset } from "@/store/slices/datasets.slice";
import { Loader2, Trash } from "lucide-react"
import { useState } from "react"
import axiosInstance from "@/utils/axios"
import { store } from "@/store/store"
import { deleteDataset } from "@/store/slices/datasets.slice"
import { toast } from "sonner"

export function DeleteDatasetDialog({ dataset }: { dataset: TDataset }) {
    const [loading, setLoading] = useState(false);
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
    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 hover:bg-red-50 hover:text-red-600"
                >
                    {loading ? (
                        <Loader2 className="w-3.5 h-3.5 dark:text-gray-400 animate-spin" />
                    ) : (
                        <Trash className="w-3.5 h-3.5 dark:text-gray-400" />
                    )}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete {dataset.name}.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(dataset._id)} disabled={loading}>{loading ? "Deleting..." : "Continue"}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
