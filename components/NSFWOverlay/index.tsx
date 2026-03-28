"use client";
import { Eye, ShieldAlert } from "lucide-react";
import { useState } from "react";

export default function NSFWOverlay({
  isAdult,
  children,
}: {
  isAdult?: boolean;
  children: React.ReactNode;
}) {
  const [revealed, setRevealed] = useState(false);

  if (!isAdult || revealed) return <>{children}</>;

  return (
    <div className="relative">
      <div style={{ filter: "blur(12px)" }}>{children}</div>
      <div
        className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer z-10"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setRevealed(true);
        }}
      >
        <div className="flex flex-col items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-xl px-4 py-3">
          <ShieldAlert className="w-6 h-6 text-red-400" />
          <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
            NSFW
          </span>
          <span className="text-white/80 text-xs flex items-center gap-1">
            <Eye className="w-3 h-3" />
            Click to reveal
          </span>
        </div>
      </div>
    </div>
  );
}
