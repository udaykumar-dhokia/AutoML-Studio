"use client";

import { SocketProvider } from "../providers";
import UserLayout from "./UserLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SocketProvider>
      <UserLayout>{children}</UserLayout>
    </SocketProvider>
  );
};

export default Layout;
