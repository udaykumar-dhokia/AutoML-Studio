import { SidebarTrigger } from "../ui/sidebar";

const Navbar = ({
  title,
  children,
}: {
  title: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className="flex items-center justify-between p-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer" />
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default Navbar;
