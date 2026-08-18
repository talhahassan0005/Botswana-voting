"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

function randomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function ConfettiRain() {
  useEffect(() => {
    const duration = 4000;
    const end = Date.now() + duration;
    let frameId: number;

    (function frame() {
      confetti({
        particleCount: 4,
        startVelocity: 0,
        gravity: randomInRange(0.5, 0.9),
        drift: randomInRange(-0.4, 0.4),
        ticks: 300,
        scalar: randomInRange(0.8, 1.3),
        origin: { x: Math.random(), y: -0.1 },
        colors: ["#818cf8", "#f472b6", "#facc15", "#4ade80", "#38bdf8"],
        shapes: ["square", "circle"],
        zIndex: 100,
      });

      if (Date.now() < end) {
        frameId = requestAnimationFrame(frame);
      }
    })();

    return () => cancelAnimationFrame(frameId);
  }, []);

  return null;
}
