"use client";

import { cn } from "@/lib/utils";
import GridPattern from "@/components/ui/grid-pattern";
import SparklesText from "@/components/ui/sparkles-text";
import GoogleAuth from "../Auth/GoogleAuth";

export default function Banner() {
  return (
    <div className="relative flex h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br">
      <p className="z-10 mt-20 text-8xl font-lexend font-semibold text-center tracking-tighter">
        <SparklesText
          text={"TrafficMine"}
          className="text-8xl font-lexend font-semibold text-center tracking-tighter"
        />
      </p>

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
