"use client";
import { useEffect } from "react";

const UserLayout = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {}, []);
  return (
    <>
      <div className="">{children}</div>
    </>
  );
};

export default UserLayout;
