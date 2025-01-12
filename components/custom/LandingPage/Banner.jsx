"use client";

import { cn } from "@/lib/utils";
import GridPattern from "@/components/ui/grid-pattern";
import SparklesText from "@/components/ui/sparkles-text";
import GoogleAuth from "../Auth/GoogleAuth";
import { FaRocket } from "react-icons/fa";

export default function Banner() {
  return (
    <div className="relative flex h-[600px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br">
      <p className="text-xl  mt-20 font-medium  text-gray-500 dark:text-gray-300 flex items-center justify-center gap-2 ">
      <FaRocket className="animate" />  Unearth valuable insights from your website traffic
      </p>
      <p className="z-10 flex flex-col mt-20 text-8xl font-serif font-extrabold text-center tracking-tighter">
        <SparklesText
          text={"TrafficMine"}
          className="text-8xl  text-center tracking-tighter"
        />
      </p>
      <div className="text-center my-5 space-y-4 max-w-2xl px-4">
          <p className="text-md text-gray-400">
            Understand User Flow • Find Most Occur Errors • Build Perfect For User
          </p>
        </div>

     <GoogleAuth />

      <GridPattern
        squares={[
          [4, 4],
          [5, 1],
          [8, 2],
          [5, 3],
          [5, 5],
          [10, 10],
          [12, 15],
          [15, 10],
          [10, 15],
          [15, 11],
          [10, 16],
          [15, 12],
        ]}
        className={cn(
          "[mask-image:radial-gradient(400px_circle_at_center,white,transparent)]",
          "absolute inset-x-0 inset-y-[-30%] h-[200%] skew-y-12"
        )}
      />
    </div>
  );
}
