"use client";
import React from "react";
import { motion } from "motion/react";

export default function ColourfulText({ text }: { text: string }) {
  const colors = [
    // Lightest to darkest pink
    "#f13b7e", // primary
  ];

  // Assign a color from the gradient based on the character's position in the text
  const chars = text.split("");
  const colorCount = colors.length;
  const getGradientColor = (i: number) => {
    if (chars.length === 1) return colors[0];
    // If there are more colors than chars, use only the needed colors for a true gradient
    if (colorCount >= chars.length) {
      const colorIdx = Math.round(i * (colorCount - 1) / (chars.length - 1));
      return colors[colorIdx];
    }
    // Otherwise, interpolate as before
    const t = i / (chars.length - 1);
    const idx = t * (colorCount - 1);
    const lower = Math.floor(idx);
    const upper = Math.ceil(idx);
    if (lower === upper) return colors[lower];
    // Linear interpolation between two colors
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const hexToRgb = (hex: string) => {
      const n = hex.replace('#', '');
      return [parseInt(n.substring(0,2),16), parseInt(n.substring(2,4),16), parseInt(n.substring(4,6),16)];
    };
    const rgbToHex = (rgb: number[]) => `#${rgb.map(x => x.toString(16).padStart(2, '0')).join('')}`;
    const c1 = hexToRgb(colors[lower]);
    const c2 = hexToRgb(colors[upper]);
    const frac = idx - lower;
    const rgb = [
      Math.round(lerp(c1[0], c2[0], frac)),
      Math.round(lerp(c1[1], c2[1], frac)),
      Math.round(lerp(c1[2], c2[2], frac)),
    ];
    return rgbToHex(rgb);
  };

  return chars.map((char, index) => (
    <motion.span
      key={`${char}-${index}`}
      initial={{
        y: 0,
      }}
      animate={{
        color: getGradientColor(index),
        y: [0, -3, 0],
        scale: [1, 1.01, 1],
        filter: ["blur(0px)", `blur(5px)`, "blur(0px)"],
        opacity: [1, 0.8, 1],
      }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
      }}
      className="inline-block whitespace-pre font-sans tracking-tight"
    >
      {char}
    </motion.span>
  ));
}
