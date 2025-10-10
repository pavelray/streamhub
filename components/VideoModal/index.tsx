"use client";
import { X } from "lucide-react";

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoKey: string | number;
  videoName: string;
  videoType: "trailer" | "media";
}

const VideoModal = ({
  isOpen,
  onClose,
  videoKey,
  videoName,
  videoType,
}: VideoModalProps) => {
  if (!isOpen) return null;
  const getVideoSource = () => {
    switch (videoType) {
      case "trailer":
        return `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
      case "media":
        return `https://www.2embed.cc/embed/${videoKey}?autoplay=1`;
      default:
        return `https://www.youtube.com/embed/${videoKey}?autoplay=1`;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center transition-all duration-300 hover:scale-110"
          aria-label="Close video"
        >
          <X className="w-6 h-6 text-white" />
        </button>

        {/* Video Player */}
        <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
          <iframe
            width="100%"
            height="100%"
            src={getVideoSource()}
            title={videoName}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0"
          />
        </div>

        {/* Video Title Below Player */}
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold text-white">{videoName}</h3>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
