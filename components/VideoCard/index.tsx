"use client";
import { useState } from "react";
import { Play, X } from "lucide-react";

interface VideoCardProps {
  key: string;
  name: string;
  site: string;
  type: string;
}

const VideoCard = ({ video }: { video: VideoCardProps }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Video Card */}
      <div className="glass-effect rounded-xl overflow-hidden group cursor-pointer transition-transform duration-300 hover:scale-105">
        <div className="relative aspect-video" onClick={openModal}>
          {/* YouTube Thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${video.key}/maxresdefault.jpg`}
            alt={video.name}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-all duration-300" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white flex items-center justify-center group-hover:scale-110 group-hover:bg-white/30 transition-all duration-300">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="p-4">
          <h3 className="font-semibold text-white line-clamp-2 mb-1">
            {video.name}
          </h3>
          <p className="text-gray-400 text-sm">{video.type}</p>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
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
                src={`https://www.youtube.com/embed/${video.key}?autoplay=1`}
                title={video.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0"
              />
            </div>

            {/* Video Title Below Player */}
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-white">{video.name}</h3>
              <p className="text-gray-400 text-sm mt-1">{video.type}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VideoCard;
