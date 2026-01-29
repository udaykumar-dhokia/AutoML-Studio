"use client";

import { useRouter } from "next/navigation";
import { useSocket } from "../providers";
import { useEffect, useState } from "react";
import { RootState, store } from "@/store/store";
import { useSelector } from "react-redux";
import { fetchUser } from "@/store/slices/user.slice";
import { fetchDatasets } from "@/store/slices/datasets.slice";
import { fetchAllWorkflows, spinDownWorkflow, spinUpWorkflow } from "@/store/slices/allWorkflows.slice";

import { setIsInitializing, spinDownWorkflow as currentSpinDownWorkflow, spinUpWorkflow as currentSpinUpWorkflow } from "@/store/slices/currentWorkflow.slice";
import { toast } from "sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/custom/AppSidebar";
import Loader from "@/components/custom/Loader";

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
      store.dispatch(spinUpWorkflow(data.workflowId));

      if (workflow?._id === data.workflowId) {
        store.dispatch(setIsInitializing(true));
        store.dispatch(currentSpinUpWorkflow(data.workflowId));
      } else {
        console.log("Ignoring container event for unrelated workflow:", data.workflowId);
      }
    };

    const onExpired = (data: any) => {
      store.dispatch(spinDownWorkflow(data.workflowId));
      console.log("Container removed:", data);

      if (workflow?._id === data.workflowId) {
        store.dispatch(setIsInitializing(false));
        store.dispatch(currentSpinDownWorkflow(data.workflowId));
      } else {
        console.log("Ignoring container event for unrelated workflow:", data.workflowId);
      }
    };

    const onReady = (data: any) => {
      console.log("Container ready:", data);

      store.dispatch(spinUpWorkflow(data.workflowId));

      if (workflow?._id === data.workflowId) {
        store.dispatch(currentSpinUpWorkflow(data.workflowId));
        store.dispatch(setIsInitializing(false));
      } else {
        console.log("Ignoring container event for unrelated workflow:", data.workflowId);
      }
    };

    const onDeleted = (data: any) => {
      store.dispatch(spinDownWorkflow(data.workflowId));
      console.log("Container deleted:", data);

      if (workflow?._id === data.workflowId) {
        store.dispatch(setIsInitializing(false));
        store.dispatch(currentSpinDownWorkflow(data.workflowId));
      } else {
        console.log("Ignoring container event for unrelated workflow:", data.workflowId);
      }
    };

    socket.on("container_added", onAdded);
    socket.on("container_expired", onExpired);
    socket.on("container_ready", onReady);
    socket.on("container_deleted", onDeleted);

    return () => {
      socket.off("container_added", onAdded);
      socket.off("container_expired", onExpired);
      socket.off("container_ready", onReady);
      socket.off("container_deleted", onDeleted);
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
