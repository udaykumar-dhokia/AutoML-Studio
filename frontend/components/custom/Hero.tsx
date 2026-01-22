"use client";
import { Highlighter } from "../ui/highlighter";
import { Button } from "../ui/button";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import DemoWorkflow from "./Demo/DemoWorkflow";
import { DotPattern } from "../ui/dot-pattern";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <div className="flex relative flex-col justify-center items-center min-h-screen z-100 overflow-hidden px-4 md:px-0">
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "mask-[linear-gradient(to_bottom_right,white,transparent,transparent)] -z-100 opacity-20"
        )}
      />
      <p className="text-sm sm:text-lg md:text-xl mt-10 text-center">
        <i>
          Build your{" "}
          <Highlighter action="underline" color="#22c55e">
            first model
          </Highlighter>{" "}
          in{" "}
          <Highlighter action="strike-through" color="#22c55e">
            hours
          </Highlighter>{" "}
          minutes with{" "}
        </i>
      </p>
      <h1 className="text-4xl md:text-6xl font-bold my-2 text-center">AutoML Studio</h1>
      <p className="text-sm md:text-md text-center max-w-xl mx-auto">
        A visual, workflow-based platform that enables you to design, train, and
        evaluate machine learning models using intuitive node-based pipelines.
      </p>
      <div className="my-4 flex gap-2">
        <Link href={"/register"}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button className="">
              Train your first model <ArrowUpRight />
            </Button>
          </motion.button>
        </Link>
        <Button variant="outline">Watch Demo</Button>
      </div>
      <div className="w-full max-w-[700px] shadow-lg mt-10 rounded-lg overflow-hidden border border-border">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <DemoWorkflow />
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
