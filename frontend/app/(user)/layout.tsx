"use client";
import { AppSidebar } from "@/components/custom/AppSidebar";
import Loader from "@/components/custom/Loader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { fetchAllWorkflows } from "@/store/slices/allWorkflows.slice";
import { fetchDatasets } from "@/store/slices/datasets.slice";
import { fetchUser } from "@/store/slices/user.slice";
import { RootState, store } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { loading: userLoading } = useSelector(
    (state: RootState) => state.user
  );
  const { loading: datasetLoading } = useSelector(
    (state: RootState) => state.dataset
  );
  const { loading: workflowLoading } = useSelector(
    (state: RootState) => state.allWorkflows
  );

  useEffect(() => {
    const checkUser = async () => {
      try {
        await store.dispatch(fetchUser());
        await store.dispatch(fetchDatasets());
        await store.dispatch(fetchAllWorkflows());
      } catch (error: any) {
        toast.error(error);
        router.push("/");
      }
    };

    checkUser();
  }, []);

  if (userLoading || datasetLoading || workflowLoading) {
    return <Loader />;
  }

  return (
    <>
      <div className="">
        <SidebarProvider>
          <AppSidebar />
          <div className="w-full">
            <main>{children}</main>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
};

export default UserLayout;
