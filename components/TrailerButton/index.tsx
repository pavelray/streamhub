"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import VideoModal from "../VideoModal";


interface TrailerButtonProps {
  videos: {
    key: string;
    name: string;
    site: string;
    type: string;
  }[];
}

const TrailerButton = ({ videos }: TrailerButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Set the first trailer
  const trailer = videos?.[0];

  if (!trailer) return null;

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="cursor-pointer group inline-flex items-center gap-3 px-8 py-4 font-bold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full border border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 hover:shadow-xl"
      >
        <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        Play Trailer
      </button>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoKey={trailer.key}
        videoName={trailer.name}
        videoType={trailer.type}
      />
    </>
  );
};

export default TrailerButton;
