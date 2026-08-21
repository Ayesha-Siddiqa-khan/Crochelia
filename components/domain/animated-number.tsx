"use client";

import * as React from "react";
import { animate, useReducedMotion } from "framer-motion";

export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const [display, setDisplay] = React.useState(0);
  const reduceMotion = useReducedMotion();

  React.useEffect(() => {
    if (reduceMotion) return;
    const controls = animate(0, value, {
      duration: 0.9,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [value, reduceMotion]);

  return <span className={className}>{reduceMotion ? value : display}</span>;
}
