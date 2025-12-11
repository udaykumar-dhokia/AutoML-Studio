"use client";

import Navbar from "@/components/custom/Navbar";
import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import CreateWorkflowSheet from "@/components/custom/Sheets/CreateWorkflowSheet";

const page = () => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <div>
      <Navbar title="Models">
        <CreateWorkflowSheet />
      </Navbar>
    </div>
  );
};

export default page;
