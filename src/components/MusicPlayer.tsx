"use client";

import React, { useState, useRef, useEffect } from "react";
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
  const [volume, setVolume] = useState(0.7); // Default volume 70%

  // Ref untuk menyimpan objek Audio
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inisialisasi Audio (Ganti URL dengan file mp3 kamu)
  useEffect(() => {
    audioRef.current = new Audio(
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    );
    audioRef.current.volume = volume;

    // Bersihkan saat komponen tidak lagi digunakan
    return () => {
      audioRef.current?.pause();
      audioRef.current = null;
    };
  }, []);

  // Sinkronisasi State UI dengan Suara
  useEffect(() => {
    if (!audioRef.current) return;

    if (state === "playing") {
      audioRef.current
        .play()
        .catch((err) => console.error("Playback failed:", err));
    } else if (state === "paused") {
      audioRef.current.pause();
    }
  }, [state]);

  // Handler Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (audioRef.current) audioRef.current.volume = newVol;
  };

  // Handler Play/Pause dengan Sequence 500ms (Sesuai Requirement)
  const handleTogglePlay = () => {
    if (state === "loading") return;

    const nextState = state === "playing" ? "paused" : "playing";
    setState("loading");

    setTimeout(() => {
      setState(nextState);
    }, 500);
  };

  // --- Animation Variants (Tetap seperti sebelumnya) ---
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
      rotate: 360,
      transition: {
        rotate: { repeat: Infinity, duration: 20, ease: "linear" },
      },
    },
    paused: { rotate: 0 },
    loading: { scale: 0.95 },
  };

  return (
    <motion.div
      variants={containerVariants}
      animate={state}
      className="w-125 h-87.5 p-6 rounded-3xl flex flex-col justify-between text-white shadow-2xl"
    >
      {/* Header: Artwork & Info */}
      <div className="flex flex-row gap-6 items-start">
        <motion.div
          variants={artworkVariants}
          animate={state}
          className="w-30 h-30 flex-none rounded-2xl bg-linear-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center"
        >
          <Music size={48} color="white" />
        </motion.div>

        <div className="flex flex-col gap-2 pt-2">
          <h2 className="text-[24px] font-bold">Awesome Song Title</h2>
          <p className="text-[16px] text-gray-400">Amazing Artist</p>

          {/* Equalizer - 5 Bar yang hanya bergerak saat 'playing' */}
          <div className="flex items-end gap-1 h-6 mt-3">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                // Animasi tinggi hanya aktif jika state === 'playing'
                animate={{
                  height: state === "playing" ? ["4px", "20px", "4px"] : "4px",
                }}
                // Transisi repeat: Infinity hanya aktif jika state === 'playing'
                transition={
                  state === "playing"
                    ? {
                        repeat: Infinity,
                        duration: 0.5,
                        delay: i * 0.1,
                        ease: "easeInOut",
                      }
                    : { duration: 0.3 } // Transisi halus saat berhenti ke 4px
                }
                className="w-1.5 bg-[#8B5CF6] rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Progress (Visual Only) */}
      <div className="flex flex-col gap-2">
        <div className="h-1.5 w-full bg-[#262626] rounded-full overflow-hidden">
          <motion.div
            animate={{ width: state === "playing" ? "70%" : "30%" }}
            className="h-full bg-[#8B5CF6]"
          />
        </div>
        <div className="flex justify-between text-[12px] text-gray-500">
          <span>1:23</span>
          <span>3:45</span>
        </div>
      </div>

      {/* Controls */}
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
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
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

      {/* Volume - Sekarang benar-benar berfungsi! */}
      <div className="flex items-center gap-3 px-2">
        <Volume2 size={18} className="text-gray-500" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-1 bg-[#262626] rounded-full appearance-none cursor-pointer accent-[#8B5CF6]"
        />
      </div>
    </motion.div>
  );
}
