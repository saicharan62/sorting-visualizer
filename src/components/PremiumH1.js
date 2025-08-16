// components/CinematicH1.js
import { motion } from "framer-motion";
import "../styles.css";

export default function CinematicH1({ text }) {
  const letters = text.split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 }
    }
  };

  const letterVariant = {
    hidden: { 
      opacity: 0, 
      y: 80, 
      rotateX: -90, 
      scale: 0.8 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 500, 
        damping: 30 
      } 
    }
  };

  return (
    <motion.h1
      className="cinematic-h1"
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {letters.map((char, index) => (
        <motion.span key={index} variants={letterVariant}>
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.h1>
  );
}
