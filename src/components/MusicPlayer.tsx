"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Music,
} from "lucide-react";

type PlayerState = "playing" | "paused" | "loading";

export function MusicPlayer() {
  const [state, setState] = useState<PlayerState>("paused");

  // Variasi Animasi (Sesuai Requirement)
  const containerVariants = {
    paused: {
      backgroundColor: "#121212",
      boxShadow: "0px 4px 20px rgba(0,0,0,0.5)",
    },
    playing: {
      backgroundColor: "#1A1625",
      boxShadow: "0px 0px 40px rgba(139, 92, 246, 0.4)",
    },
    loading: { backgroundColor: "#121212", opacity: 0.8 },
  };

  const artworkVariants = {
    playing: {
      scale: 1,
      rotate: 360,
      transition: {
        rotate: { repeat: Infinity, duration: 20, ease: "linear" },
        scale: { type: "spring" },
      },
    },
    paused: { scale: 0.95, rotate: 0 },
    loading: { scale: 0.9 },
  };

  const barVariants = {
    playing: (i: number) => ({
      height: ["4px", "20px", "4px"],
      transition: { repeat: Infinity, duration: 0.5, delay: i * 0.1 },
    }),
    paused: { height: "4px" },
    loading: { height: "10px", opacity: 0.5 },
  };

  const handleTogglePlay = () => {
    if (state === "loading") return;
    const next = state === "playing" ? "paused" : "playing";
    setState("loading");
    setTimeout(() => setState(next), 500); // Sequence 500ms sesuai requirement
  };

  return (
    <motion.div
      variants={containerVariants}
      animate={state}
      className="w-125 h-87.5 p-6 rounded-3xl flex flex-col justify-between text-white"
    >
      {/* Top Section: Artwork & Info */}
      <div className="flex flex-row gap-6 items-start">
        <motion.div
          variants={artworkVariants}
          animate={state}
          className="w-30 h-30 flex-none rounded-2xl bg-linear-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center shadow-2xl"
        >
          <Music size={48} color="white" />
        </motion.div>

        <div className="flex flex-col gap-2 pt-2">
          <h2 className="text-[24px] font-bold leading-none">
            Awesome Song Title
          </h2>
          <p className="text-[16px] text-gray-400">Amazing Artist</p>

          {/* Equalizer Bars */}
          <div className="flex items-end gap-1 h-6 mt-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={barVariants}
                animate={state}
                className="w-1.5 bg-[#8B5CF6] rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div className="flex flex-col gap-2">
        <div className="h-1.5 w-full bg-[#262626] rounded-full overflow-hidden">
          <motion.div
            animate={{ width: state === "playing" ? "70%" : "30%" }}
            className="h-full bg-[#8B5CF6]"
          />
        </div>
        <div className="flex justify-between text-[12px] text-gray-500 font-medium">
          <span>1:23</span>
          <span>3:45</span>
        </div>
      </div>

      {/* Controls Section */}
      <div className="flex items-center justify-center gap-8">
        <Shuffle
          size={20}
          className="text-gray-500 hover:text-white cursor-pointer"
        />
        <SkipBack
          size={24}
          className="text-gray-500 hover:text-white cursor-pointer"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleTogglePlay}
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            state === "loading" ? "bg-gray-700" : "bg-[#8B5CF6]"
          }`}
        >
          {state === "loading" ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : state === "playing" ? (
            <Pause size={32} fill="white" />
          ) : (
            <Play size={32} fill="white" className="ml-1" />
          )}
        </motion.button>

        <SkipForward
          size={24}
          className="text-gray-500 hover:text-white cursor-pointer"
        />
        <Repeat
          size={20}
          className="text-gray-500 hover:text-white cursor-pointer"
        />
      </div>

      {/* Volume Section */}
      <div className="flex items-center gap-3 px-2">
        <Volume2 size={18} className="text-gray-500" />
        <div className="h-1 flex-1 bg-[#262626] rounded-full">
          <div className="h-full w-[60%] bg-gray-500 rounded-full" />
        </div>
      </div>
    </motion.div>
  );
}
