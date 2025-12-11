"use client";
import { AppSidebar } from "@/components/custom/AppSidebar";
import Loader from "@/components/custom/Loader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { fetchUser } from "@/store/slices/user.slice";
import { RootState, store } from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const checkUser = async () => {
      try {
        await store.dispatch(fetchUser());
      } catch (error: any) {
        toast.error(error);
        router.push("/models");
      }
    };

    checkUser();
  }, []);

  if (loading) {
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
