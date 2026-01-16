"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="border border-dashed p-6 w-84 space-y-4 rounded-md">
          <div className="space-y-2">
            <div className="cursor-pointer" onClick={() => router.push("/")}>
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
            </div>
            <h1 className="text-xl font-bold">Welcome back</h1>
            <p className="text-sm text-gray-500">
              Enter your email and password to login
            </p>
          </div>

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
            disabled={!email || !password}
            onClick={() => {
              if (email && password) {
                handleLogin();
              }
            }}
            className="w-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Continue"
            )}
          </Button>

          <p className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default page;
