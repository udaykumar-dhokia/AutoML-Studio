import { SidebarTrigger } from "../ui/sidebar";

const Navbar = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
    </div>
  );
};

export default Navbar;
