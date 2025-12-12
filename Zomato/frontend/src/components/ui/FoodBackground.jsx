import React, { useEffect, useState } from "react";

// Floating food emojis + parallax background wrapper
export default function FoodBackground({ children }) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // Parallax movement based on mouse
  useEffect(() => {
    const handleMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 15;
      const y = (e.clientY / window.innerHeight - 0.5) * 15;
      setOffset({ x, y });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-bg-primary">

      {/* Animated Icon Layer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.7] text-7xl select-none transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px)`,
        }}
      >
        {/* -------- TOP SECTION -------- */}
        <div className="absolute top-6 left-48 animate-float">🍕</div>
        <div className="absolute top-19 right-26 animate-wave">🍔</div>
        <div className="absolute top-13 right-1/4 animate-float-delayed">🥯</div>
        <div className="absolute top-30 left-10 animate-wave">🌭</div>

        {/* -------- MIDDLE SECTION -------- */}

        <div className="absolute top-1/3 right-1/6 animate-float-delayed">🍟</div>
        <div className="absolute top-[42%] left-6 animate-wave">🌮</div>
        <div className="absolute top-[58%] right-1/5 animate-float">🥐</div>
        <div className="absolute top-[38%] left-1/5 animate-float-slow">🍜</div>
        <div className="absolute top-[45%] right-12 animate-wave">🍙</div>

        {/* -------- BOTTOM SECTION -------- */}

        <div className="absolute bottom-30 left-1/7 animate-float-delayed">🥗</div>
        <div className="absolute bottom-16 right-10 animate-float-slow">🍩</div>
        <div className="absolute bottom-10 left-10 animate-wave">🍪</div>
        <div className="absolute bottom-6 right-1/5 animate-float">🍰</div>
      </div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
