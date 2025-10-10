"use client";
import { useState } from "react";
import { Play } from "lucide-react";
import VideoModal from "../VideoModal";

interface MediaPlayButtonProps {
  media: {
    id: number;
    name: string;
  } | null;
}

const MediaPlayButton = ({ media }: MediaPlayButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!media) return null;

  return (
    <>
      <button
        className="cursor-pointer group px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
        style={{
          background: "var(--color-header-gradient)",
        }}
         onClick={() => setIsModalOpen(true)}
      >
        <span className="flex items-center justify-center gap-2 text-[var(--color-white)]">
          <Play className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          Watch Now
        </span>
      </button>

      <VideoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        videoKey={media.id}
        videoName={media.name}
        videoType="media"
      />
    </>
  );
};

export default MediaPlayButton;
