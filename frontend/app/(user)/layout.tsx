"use client";
import { AppSidebar } from "@/components/custom/AppSidebar";
import Loader from "@/components/custom/Loader";
import { SidebarProvider } from "@/components/ui/sidebar";
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

  useEffect(() => {
    const checkUser = async () => {
      try {
        await store.dispatch(fetchUser());
        await store.dispatch(fetchDatasets());
      } catch (error: any) {
        toast.error(error);
        router.push("/models");
      }
    };

    checkUser();
  }, []);

  if (userLoading || datasetLoading) {
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
