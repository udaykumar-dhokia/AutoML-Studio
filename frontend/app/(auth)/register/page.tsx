"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/utils/axios";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

const page = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password) return;
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password,
      };
      const res = await axiosInstance.post("/auth/register/", payload);
      toast.success(res.data.message);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <div className="border border-dashed p-6 w-84 space-y-4 rounded-md">
          <div className="space-y-1">
            <h1 className="text-xl font-bold">Get Started for FREE</h1>
            <p className="text-sm text-gray-500">
              Enter below details to register
            </p>
          </div>

          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              type="text"
              placeholder="Enter your first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              type="text"
              placeholder="Enter your last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
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
            disabled={!firstName || !lastName || !email || !password}
            className="w-full"
            onClick={handleRegister}
          >
            Get Started
          </Button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default page;
