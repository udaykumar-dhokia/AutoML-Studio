"use client";
import { AppSidebar } from "@/components/custom/AppSidebar";
import Loader from "@/components/custom/Loader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { fetchAllWorkflows } from "@/store/slices/allWorkflows.slice";
import { fetchDatasets } from "@/store/slices/datasets.slice";
import { fetchUser } from "@/store/slices/user.slice";
import { RootState, store } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { loading: userLoading } = useSelector(
    (state: RootState) => state.user,
  );
  const { loading: datasetLoading } = useSelector(
    (state: RootState) => state.dataset,
  );
  const { loading: workflowLoading } = useSelector(
    (state: RootState) => state.allWorkflows,
  );

  useEffect(() => {
    const checkUser = async () => {
      setLoading(true);
      try {
        await store.dispatch(fetchUser()).unwrap();
      } catch (error) {
        toast.error(
          typeof error === "string" ? error : "Unauthorized. Please login.",
        );
        router.push("/");
        setLoading(false);
        return;
      }

      try {
        await store.dispatch(fetchDatasets()).unwrap();
        await store.dispatch(fetchAllWorkflows()).unwrap();
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  if (userLoading || datasetLoading || workflowLoading || loading) {
    return <Loader />;
  }

  return (
    <>
      <div className="bg-black">
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
