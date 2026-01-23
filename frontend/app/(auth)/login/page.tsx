"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import logoLight from "@/public/logo/logo-light/icons8-workflow-100.png";
import logoDark from "@/public/logo/logo-dark/icons8-workflow-100.png";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import usePageTitle from "@/components/custom/PageTitle";

const page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  usePageTitle("Login | AutoML Studio");

  const handleLogin = async () => {
    if (!email || !password) return;
    try {
      setLoading(true);
      const payload = {
        email: email,
        password: password,
      };
      const res = await axiosInstance.post("/auth/login/", payload);
      toast.success(res.data.message);
      router.push("/models");
    } catch (error: any) {
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen grid lg:grid-cols-2">
      <div className="flex w-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col w-full max-w-sm space-y-6">
          <div className="space-y-2">
            <div className="cursor-pointer" onClick={() => router.push("/")}>
              <Image
                src={logoLight}
                alt="logo"
                width={32}
                height={32}
                className="block dark:hidden"
              />
              <Image
                src={logoDark}
                alt="logo"
                width={32}
                height={32}
                className="hidden dark:block"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Enter your email and password to login
            </p>
          </div>

          <div className="space-y-4 w-full">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              disabled={!email || !password || loading}
              onClick={handleLogin}
              className="w-full"
            >
              <span className={loading ? "opacity-0" : "opacity-100"}>
                Continue
              </span>

              {loading && (
                <Loader2 className="absolute h-4 w-4 animate-spin" />
              )}
            </Button>


            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="underline hover:text-primary">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative h-full pl-2 py-2 bg-transparent rounded-md">
        <img
          src="/images/demo2.png"
          alt="Authentication background"
          className="object-cover object-left h-full w-full rounded-md blur-xs"
        />
      </div>
    </div>
  );
};

export default page;
