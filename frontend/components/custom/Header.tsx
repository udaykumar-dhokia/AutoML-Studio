import Link from "next/link";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";
import logo from "@/public/logo/icons8-workflow-48.png";
import Image from "next/image";

const Header = () => {
  return (
    <>
      <header className="bg-white dark:bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="md:flex md:items-center md:gap-12">
              <Link className="block" href="/" >
                <div className="flex items-center gap-2">
                  <Image src={logo} alt="logo" width={24} height={24} />
                  <h1 className="text-2xl font-bold">AutoML Studio</h1>
                </div>
              </Link>
            </div>

            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-6 text-sm">
                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75"
                      href="#"
                    >
                      {" "}
                      About{" "}
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75"
                      href="#"
                    >
                      {" "}
                      Careers{" "}
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75"
                      href="#"
                    >
                      {" "}
                      History{" "}
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75"
                      href="#"
                    >
                      {" "}
                      Services{" "}
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75"
                      href="#"
                    >
                      {" "}
                      Projects{" "}
                    </a>
                  </li>

                  <li>
                    <a
                      className="text-gray-500 transition hover:text-gray-500/75"
                      href="#"
                    >
                      {" "}
                      Blog{" "}
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                <Link href={"/login"}>
                  <Button variant={"outline"} className="">
                    Login
                  </Button>
                </Link>

                <div className="hidden sm:flex">
                  <Link href={"/login"}>
                    <Button>Get Started for Free</Button>
                  </Link>
                </div>
              </div>

              <div className="block md:hidden">
                <Button>
                  <Menu />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
