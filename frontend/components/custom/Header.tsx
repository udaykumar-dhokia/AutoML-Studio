"use client"

import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowUpRight, Github, Menu } from "lucide-react";
import logoLight from "@/public/logo/logo-light/icons8-workflow-100.png";
import logoDark from "@/public/logo/logo-dark/icons8-workflow-100.png";
import Image from "next/image";
import { useEffect, useState } from "react";

const Header = () => {
  const [stars, setStars] = useState<number | null>(null)

  useEffect(() => {
    fetch("https://api.github.com/repos/udaykumar-dhokia/AutoML-Studio")
      .then((res) => res.json())
      .then((data) => setStars(data.stargazers_count))
      .catch(() => setStars(null))
  }, [])
  return (
    <>
      <header className="bg-transparent border-b border-dashed border-primary/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="md:flex md:items-center md:gap-12">
              <Link className="block" href="/">
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
                  <h1 className="text-2xl font-bold">AutoML Studio</h1>
                </div>
              </Link>
            </div>

            <div className="hidden md:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-6 text-sm">
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <div className="sm:flex sm:gap-2">
                <Link
                  href="https://github.com/udaykumar-dhokia/AutoML-Studio"
                  target="_blank"
                  rel="noreferrer"
                  className="hidden lg:flex"
                >
                  <Button variant="outline" className="flex items-center gap-2 px-3">
                    <Github />
                    {stars !== null && (
                      <span className="text-sm font-semibold">
                        {stars}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href={"/login"}>
                  <Button variant={"outline"} className="">
                    Login
                  </Button>
                </Link>

                <div className="hidden sm:flex">
                  <Link href={"/register"}>
                    <Button>Get Started for Free <ArrowUpRight /></Button>
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
