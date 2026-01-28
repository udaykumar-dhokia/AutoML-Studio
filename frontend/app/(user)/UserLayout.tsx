"use client";

import { useRouter } from "next/navigation";
import { useSocket } from "../providers";
import { useEffect, useState } from "react";
import { RootState, store } from "@/store/store";
import { useSelector } from "react-redux";
import { fetchUser } from "@/store/slices/user.slice";
import { fetchDatasets } from "@/store/slices/datasets.slice";
import { fetchAllWorkflows } from "@/store/slices/allWorkflows.slice";
import { setIsInitializing } from "@/store/slices/currentWorkflow.slice";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/AppSidebar";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const socket = useSocket();
  const [loading, setLoading] = useState(false);

  const { workflow } = useSelector((state: RootState) => state.currentWorkflow);

  const { loading: userLoading } = useSelector(
    (state: RootState) => state.user,
  );
  const { loading: datasetLoading } = useSelector(
    (state: RootState) => state.dataset,
  );
  const { loading: workflowLoading, workflows } = useSelector(
    (state: RootState) => state.allWorkflows,
  );

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        await store.dispatch(fetchUser()).unwrap();
        await store.dispatch(fetchDatasets()).unwrap();
        await store.dispatch(fetchAllWorkflows()).unwrap();
      } catch (error) {
        toast.error("Unauthorized. Please login.");
        router.push("/");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    if (!socket) {
      console.warn("Socket not connected yet");
      return;
    }

    console.log("Setting up socket listeners", socket.id);

    const onAdded = (data: any) => {
      // Check if this container belongs to the current user's workflows
      const isUserWorkflow = workflows.some(w => w._id === data.workflowId);

      if (!isUserWorkflow) {
        console.log("Ignoring container event for unrelated workflow:", data.workflowId);
        return;
      }

      console.log("Container added:", data);
      if (workflow?._id === data.workflowId) {
        store.dispatch(setIsInitializing(true));
      }
      toast.success("We are initialising your env");
    };

    const onRemoved = (data: any) => {
      console.log("Container removed:", data);
      toast.success("We are removing your env");
    };

    const onReady = (data: any) => {
      console.log("Container ready:", data);
      if (workflow?._id === data.workflowId) {
        store.dispatch(setIsInitializing(false));
      }
      toast.success("Environment initialized!");
    };

    socket.on("container_added", onAdded);
    socket.on("container_removed", onRemoved);
    socket.on("container_ready", onReady);

    return () => {
      socket.off("container_added", onAdded);
      socket.off("container_removed", onRemoved);
      socket.off("container_ready", onReady);
    };
  }, [socket, workflows, workflow]);

  if (userLoading || datasetLoading || workflowLoading || loading) {
    return <Loader />;
  }

  return (
    <div className="bg-black">
      <SidebarProvider>
        <AppSidebar />
        <div className="w-full">
          <main>{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default UserLayout;
