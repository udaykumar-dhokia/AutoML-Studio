import { ChevronUp, User2, Database, Box } from "lucide-react";
import logoLight from "@/public/logo/logo-light/icons8-workflow-100.png";
import logoDark from "@/public/logo/logo-dark/icons8-workflow-100.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { handleWorkflowRoute } from "@/utils/handleWorkflowRoute";

const items = [
  {
    title: "Models",
    url: "/models",
    icon: Box,
  },
  {
    title: "Datasets",
    url: "/datasets",
    icon: Database,
  },
  // {
  //   title: "Search",
  //   url: "/search",
  //   icon: Search,
  // },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
];

export function AppSidebar() {
  const { user } = useSelector((state: RootState) => state.user);
  const pathname = usePathname();
  const router = useRouter();
  const { workflows } = useSelector((state: RootState) => state.allWorkflows);
  const { datasets } = useSelector((state: RootState) => state.dataset);

  const handleSignOut = () => {
    router.push("/");
  };

  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="my-4 text-black dark:text-white">
            <div className="flex items-center gap-2">
              <Image
                src={logoLight}
                alt="logo"
                width={28}
                height={28}
                className="block dark:hidden"
              />
              <Image
                src={logoDark}
                alt="logo"
                width={28}
                height={28}
                className="hidden dark:block"
              />
              <h1 className="text-xl font-bold">AutoML Studio</h1>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <div className="my-2">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`${
                        pathname === item.url
                          ? "border-primary/50 border inset-shadow-sm inset-shadow-white/5"
                          : ""
                      } transition-colors hover:bg-black hover:text-white`}
                    >
                      <Link
                        href={item.url}
                        className={`hover:text-black transition-colors ${
                          pathname === item.url ? "text-white" : ""
                        }`}
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                    {item.url == "/models"
                      ? workflows.map((workflow, idx) => {
                          return (
                            <SidebarMenuSubItem className="my-1">
                              <SidebarMenuSub>
                                <SidebarMenuSubButton
                                  onClick={() => {
                                    handleWorkflowRoute(workflow, router);
                                  }}
                                  className="cursor-pointer"
                                >
                                  {workflow.name}
                                </SidebarMenuSubButton>
                              </SidebarMenuSub>
                            </SidebarMenuSubItem>
                          );
                        })
                      : item.url == "/datasets"
                        ? datasets.map((dataset, idx) => {
                            return (
                              <SidebarMenuSubItem className="my-1">
                                <SidebarMenuSub>{dataset.name}</SidebarMenuSub>
                              </SidebarMenuSubItem>
                            );
                          })
                        : ""}
                  </SidebarMenuItem>
                ))}
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger className="cursor-pointer" asChild>
                <SidebarMenuButton>
                  <User2 />
                  <span>{user?.email}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer"
                >
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
