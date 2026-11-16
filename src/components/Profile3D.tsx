import React, { useState, useRef } from 'react';

interface Profile3DProps {
  name?: string;
  imageSrc?: string;
}

export const Profile3D: React.FC<Profile3DProps> = ({
  name = 'ANUBHAV PATEL',
  imageSrc = '/assets/avatar-character.jpg'
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-18deg to +18deg)
    const rotX = -((y - centerY) / centerY) * 16;
    const rotY = ((x - centerX) / centerX) * 16;

    setRotateX(rotX);
    setRotateY(rotY);

    // Dynamic glare position
    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlarePos({ x: glareX, y: glareY, opacity: 0.35 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
    setGlarePos(prev => ({ ...prev, opacity: 0 }));
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative flex items-center justify-center p-4 cursor-pointer select-none"
      style={{ perspective: '1100px' }}
    >
      {/* Outer ambient glow reacting to mouse */}
      <div
        className="absolute -inset-4 rounded-full blur-2xl transition-opacity duration-700 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, rgba(168, 85, 247, 0.25) 50%, transparent 70%)',
          opacity: isHovered ? 0.9 : 0.45,
          transform: `translate3d(${rotateY * 1.5}px, ${-rotateX * 1.5}px, -20px)`,
        }}
      />

      {/* 3D Root Card */}
      <div
        className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full transition-transform ease-out"
        style={{
          transformStyle: 'preserve-3d',
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovered ? 1.04 : 1}, ${isHovered ? 1.04 : 1}, 1)`,
          transitionDuration: isHovered ? '90ms' : '600ms',
        }}
      >
        {/* Layer 1: Outer Rotating Tech Orbit Ring (-10px Z) */}
        <div
          className="absolute -inset-3 rounded-full border border-cyan-500/30 border-dashed animate-spin-slow pointer-events-none"
          style={{
            transform: 'translateZ(-10px)',
            boxShadow: '0 0 25px rgba(6, 182, 212, 0.15)',
          }}
        />

        {/* Layer 2: Counter-Rotating Accent Ring (-5px Z) */}
        <div
          className="absolute -inset-1 rounded-full border border-purple-500/30 border-dotted pointer-events-none"
          style={{
            transform: 'translateZ(-5px)',
            animation: 'spin 24s linear infinite reverse',
          }}
        />

        {/* Layer 3: Main Circular Vessel / Bezel */}
        <div
          className="relative w-full h-full rounded-full p-2 bg-gradient-to-b from-[#161c2e] via-[#0b0e17] to-[#05070c] border-2 border-cyan-500/40 shadow-2xl shadow-cyan-950/60 overflow-hidden"
          style={{
            transform: 'translateZ(15px)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Inner Circular Frame holding the 3D Character Avatar */}
          <div className="relative w-full h-full rounded-full overflow-hidden bg-[#0a0d16]">
            {/* PROFILE PHOTO: 3D Model Render of Anubhav Patel */}
            <img
              src={imageSrc}
              alt="Portrait of Anubhav Patel"
              className="w-full h-full object-cover transition-transform duration-300"
              style={{
                transform: `scale(${isHovered ? 1.05 : 1}) translate3d(${rotateY * 0.4}px, ${-rotateX * 0.4}px, 0)`,
              }}
            />

            {/* Specular 3D Light Sheen tracking cursor */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.3) 0%, rgba(56,189,248,0.15) 30%, transparent 65%)`,
                opacity: glarePos.opacity,
                mixBlendMode: 'overlay',
              }}
            />

            {/* Subtle border ring */}
            <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-cyan-400/40 pointer-events-none" />
          </div>

          {/* Layer 4: Floating Name Pill (Elevated at +35px Z) */}
          <div
            className="absolute bottom-3 inset-x-0 mx-auto w-max px-3.5 py-1 rounded-full bg-black/85 backdrop-blur-md border border-cyan-400/40 text-[10px] font-mono font-bold tracking-widest text-cyan-300 shadow-lg shadow-cyan-950/80 flex items-center gap-1.5 transition-transform"
            style={{
              transform: `translateZ(35px) translate3d(${rotateY * 0.6}px, ${-rotateX * 0.6}px, 0)`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>{name}</span>
          </div>
        </div>

        {/* Layer 5: Floating Reticle Crosshairs (+25px Z) */}
        <div
          className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-cyan-400/70 pointer-events-none transition-transform"
          style={{ transform: 'translateZ(25px)' }}
        />
        <div
          className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-purple-400/70 pointer-events-none transition-transform"
          style={{ transform: 'translateZ(25px)' }}
        />
      </div>
    </div>
  );
};
