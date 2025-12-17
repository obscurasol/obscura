"use client";

import { FC, useEffect, useState } from "react";

interface Particle {
  id: number;
  left: string;
  duration: string;
  delay: string;
}

export const AnimatedBackground: FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate particles on client side only
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${18 + Math.random() * 15}s`,
      delay: `${Math.random() * 12}s`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="bg-wrapper">
      {/* Chessboard layers */}
      <div className="chessboard" />
      <div className="chessboard-2" />
      <div className="chessboard-3" />
      
      {/* Glowing orbs */}
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />
      <div className="glow-orb glow-orb-3" />
      
      {/* Floating particles */}
      <div className="particles-container">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              animationDuration: particle.duration,
              animationDelay: particle.delay,
            }}
          />
        ))}
      </div>
      
      {/* Effects */}
      <div className="blur-overlay" />
      <div className="noise-overlay" />
      <div className="vignette" />
    </div>
  );
};
