import { Loader2 } from "lucide-react";

const Loader = () => {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    </>
  );
};

export default Loader;
