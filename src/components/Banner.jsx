"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// List of images to cycle through
const images = [
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3"
];

function Banner({
  title = "Where Love Begins",
  description = "Find your perfect match in a world of endless possibilities. Every great love story starts with a simple hello.",
  onGetStarted,
  onSignIn,
  height = "300px",
  duration = 5000, // Time in ms before switching images
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, duration);
    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div className="relative overflow-hidden" style={{ height }}>
      {/* Animated Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={images[currentImageIndex]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-cover bg-center animate ease-in"
          style={{
            backgroundImage: `url("${images[currentImageIndex]}")`,
          }}
        />
      </AnimatePresence>

      {/* Overlays for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-rose-900/80 via-transparent to-rose-900/80"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

      {/* Content Section */}
      <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
        <h1 className="text-5xl font-bold mb-4 text-white drop-shadow-lg">
          {title}
        </h1>
        <p className="text-xl mb-8 max-w-2xl text-white/90 drop-shadow-md">
          {description}
        </p>
        <div className="space-y-4">
          <button
            className="px-8 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-full font-semibold text-lg transition-colors shadow-lg hover:shadow-xl"
            onClick={onGetStarted}
          >
            Start Your Good Meal All Day!
          </button>
          <p className="text-xl text-white/80">
            Already have an account?{" "}
            <button onClick={onSignIn} className="underline text-xl text-blue-300 bold hover:underline hover:text-white">
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Banner;
