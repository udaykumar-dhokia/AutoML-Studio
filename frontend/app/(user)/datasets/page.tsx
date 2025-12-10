import Navbar from "@/components/custom/Navbar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const page = () => {
  return (
    <div>
      <Navbar title="Datasets">
        <Button>
          <Plus className="" />
          Register Dataset
        </Button>
      </Navbar>
    </div>
  );
};

export default page;
