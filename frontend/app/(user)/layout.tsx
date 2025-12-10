"use client";
import { AppSidebar } from "@/components/custom/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { setDatasets } from "@/store/slices/datasets.slice";
import { setUser } from "@/store/slices/user.slice";
import { RootState, store } from "@/store/store";
import axiosInstance from "@/utils/axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { datasets } = useSelector((state: RootState) => state.dataset);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await axiosInstance.get("/user/");
        if (res.status == 401) {
          router.push("/login");
        }
        store.dispatch(setUser(res.data.user));
      } catch (error: any) {
        toast.error(error.response.data.message);
        router.push("/login");
      }
    };

    checkUser();
  }, []);

  useEffect(() => {
    const fetchDatasets = async () => {
      try {
        const res = await axiosInstance.get("/dataset/");
        store.dispatch(setDatasets(res.data));
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };

    if (datasets.length == 0) {
      fetchDatasets();
    }
  }, []);

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
