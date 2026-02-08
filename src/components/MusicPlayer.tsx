"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// Playlist dengan lirik spesifik tiap lagu
const PLAYLIST = [
  {
    id: 1,
    title: "Awesome Song Title",
    artist: "Amazing Artist",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    lyrics: [
      { time: 0, text: "Memulai alunan melodi..." },
      { time: 5, text: "Coding with passion and style" },
      { time: 10, text: "This is the first verse of your journey" },
      { time: 15, text: "Feel the beat in your heart" },
    ],
  },
  {
    id: 2,
    title: "Next Big Hit",
    artist: "Cool Musician",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    lyrics: [
      { time: 0, text: "Lagu kedua dimulai..." },
      { time: 5, text: "Irama yang baru terasa" },
      { time: 10, text: "Next level of music player" },
      { time: 15, text: "Keep pushing the code!" },
    ],
  },
];

export function MusicPlayer() {
  const [trackIndex, setTrackIndex] = useState(0);
  const [state, setState] = useState<PlayerState>("paused");
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeLyric, setActiveLyric] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = PLAYLIST[trackIndex];

  // 1. Inisialisasi Audio & Timer
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio(currentTrack.url);
    } else {
      audioRef.current.src = currentTrack.url;
    }

    const updateTime = () => {
      if (!audioRef.current) return;
      const time = audioRef.current.currentTime;
      setCurrentTime(time);

      // Update Lirik Otomatis
      const index = currentTrack.lyrics.findIndex(
        (l, i) =>
          time >= l.time &&
          (!currentTrack.lyrics[i + 1] ||
            time < currentTrack.lyrics[i + 1].time),
      );
      if (index !== -1) setActiveLyric(index);
    };

    audioRef.current.addEventListener("timeupdate", updateTime);
    audioRef.current.volume = volume;
    audioRef.current.loop = isRepeat;

    if (state === "playing") audioRef.current.play();

    return () => {
      audioRef.current?.removeEventListener("timeupdate", updateTime);
    };
  }, [trackIndex]);

  // 2. Play/Pause Control
  useEffect(() => {
    if (!audioRef.current) return;
    state === "playing" ? audioRef.current.play() : audioRef.current.pause();
  }, [state]);

  // 3. Handlers
  const handleTogglePlay = () => {
    const next = state === "playing" ? "paused" : "playing";
    setState("loading");
    setTimeout(() => setState(next), 500); // 500ms sequence
  };

  const changeTrack = (next: boolean) => {
    setState("loading");
    setTimeout(() => {
      if (isShuffle) {
        setTrackIndex(Math.floor(Math.random() * PLAYLIST.length));
      } else {
        setTrackIndex((prev) =>
          next
            ? (prev + 1) % PLAYLIST.length
            : (prev - 1 + PLAYLIST.length) % PLAYLIST.length,
        );
      }
      setActiveLyric(0);
      setCurrentTime(0);
      setState("playing");
    }, 500);
  };

  return (
    <motion.div
      animate={state}
      variants={{
        paused: {
          backgroundColor: "#121212",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.5)",
        },
        playing: {
          backgroundColor: "#1A1625",
          boxShadow: "0px 0px 40px rgba(139, 92, 246, 0.4)",
        }, // Glow
      }}
      className="w-125 h-87.5 p-6 rounded-3xl flex flex-col justify-between text-white shadow-2xl overflow-hidden"
    >
      {/* SECTION ATAS: Artwork, Info, & Lirik */}
      <div className="flex flex-row gap-6 items-start">
        <motion.div
          animate={state === "playing" ? { rotate: 360 } : { rotate: 0 }}
          transition={
            state === "playing"
              ? { repeat: Infinity, duration: 20, ease: "linear" }
              : { duration: 0.5 }
          }
          className="w-30 h-30 flex-none rounded-2xl bg-linear-to-br from-[#A855F7] to-[#EC4899] flex items-center justify-center"
        >
          <Music size={48} color="white" />
        </motion.div>

        <div className="flex flex-col flex-1 min-w-0 h-30">
          <h2 className="text-[22px] font-bold truncate leading-tight">
            {currentTrack.title}
          </h2>
          <p className="text-[14px] text-gray-400 mb-3">
            {currentTrack.artist}
          </p>

          {/* Lirik Area yang Hilang tadi */}
          <div className="relative h-12 overflow-hidden">
            <motion.div
              animate={{ y: -(activeLyric * 24) }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              {currentTrack.lyrics.map((line, i) => (
                <p
                  key={i}
                  className={`text-[13px] h-6 transition-colors duration-300 ${activeLyric === i ? "text-[#8B5CF6] font-bold" : "text-gray-600"}`}
                >
                  {line.text}
                </p>
              ))}
            </motion.div>
          </div>

          {/* Equalizer */}
          <div className="flex items-end gap-1 h-4 mt-auto">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.div
                key={i}
                animate={{ height: state === "playing" ? [4, 16, 4] : 4 }}
                transition={
                  state === "playing"
                    ? { repeat: Infinity, duration: 0.5, delay: i * 0.1 }
                    : { duration: 0.2 }
                }
                className="w-1.25 bg-[#8B5CF6] rounded-full"
              />
            ))}
          </div>
        </div>
      </div>

      {/* SECTION TENGAH: Progress Bar */}
      <div className="flex flex-col gap-1.5">
        <div className="h-1.25 w-full bg-[#262626] rounded-full overflow-hidden">
          <motion.div
            animate={{ width: state === "playing" ? "65%" : "30%" }}
            className="h-full bg-[#8B5CF6]"
          />
        </div>
        <div className="flex justify-between text-[11px] text-gray-500">
          <span>
            {Math.floor(currentTime / 60)}:
            {Math.floor(currentTime % 60)
              .toString()
              .padStart(2, "0")}
          </span>
          <span>3:45</span>
        </div>
      </div>

      {/* SECTION TOMBOL: Semuanya Aktif */}
      <div className="flex items-center justify-center gap-7">
        <Shuffle
          size={18}
          onClick={() => setIsShuffle(!isShuffle)}
          className={`cursor-pointer ${isShuffle ? "text-[#8B5CF6]" : "text-gray-500 hover:text-white"}`}
        />
        <SkipBack
          size={22}
          onClick={() => changeTrack(false)}
          className="text-gray-500 hover:text-white cursor-pointer"
        />

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleTogglePlay}
          className={`w-15 h-15 rounded-full flex items-center justify-center ${state === "loading" ? "bg-gray-700" : "bg-[#8B5CF6]"}`}
        >
          {state === "loading" ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full"
            />
          ) : state === "playing" ? (
            <Pause size={28} fill="white" stroke="none" />
          ) : (
            <Play size={28} fill="white" stroke="none" className="ml-1" />
          )}
        </motion.button>

        <SkipForward
          size={22}
          onClick={() => changeTrack(true)}
          className="text-gray-500 hover:text-white cursor-pointer"
        />
        <Repeat
          size={18}
          onClick={() => setIsRepeat(!isRepeat)}
          className={`cursor-pointer ${isRepeat ? "text-[#8B5CF6]" : "text-gray-500 hover:text-white"}`}
        />
      </div>

      {/* SECTION BAWAH: Volume */}
      <div className="flex items-center gap-3 px-2">
        <Volume2 size={16} className="text-gray-500" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => {
            const v = parseFloat(e.target.value);
            setVolume(v);
            if (audioRef.current) audioRef.current.volume = v;
          }}
          className="w-full h-1 bg-[#262626] rounded-full appearance-none accent-[#8B5CF6] cursor-pointer"
        />
      </div>
    </motion.div>
  );
}
