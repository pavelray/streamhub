"use client";
import React, { useState } from "react";
import { Play } from "lucide-react";
import { FALLBACK_VIDEO_THUMBNAIL } from "@/utils/constants";

export const YouTubeThumbnail = ({ videoId }: { videoId: string }) => {
  const [imgSrc, setImgSrc] = useState(
    `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  );

  const handleError = () => {
    setImgSrc(FALLBACK_VIDEO_THUMBNAIL);
  };

  return (
    <div className="relative w-full aspect-video cursor-pointer overflow-hidden rounded-md shadow-lg bg-gray-200 transition-shadow duration-300 ease-in-out hover:shadow-2xl">
      <img
        src={imgSrc}
        alt="YouTube Thumbnail"
        onError={handleError}
        className="w-full h-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Play className="w-16 h-16 text-white drop-shadow-lg" />
      </div>
    </div>
  );
};

export default YouTubeThumbnail;
