import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import PremiumH1 from "./PremiumH1";

export default function HeroSection() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  return (
    <div className="hero-section">
      <Particles
        id="tsparticles"
        init={particlesInit}
        options={{
          fullScreen: { enable: false }, // keep inside hero only
          background: { color: "transparent" },
          particles: {
            number: { value: 60 },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: { value: 0.6 },
            size: { value: { min: 1, max: 3 } },
            move: { enable: true, speed: 1, outModes: { default: "out" } },
            links: {
              enable: true,
              distance: 150,
              color: "#ffffff",
              opacity: 0.3,
              width: 1
            }
          },
          interactivity: {
            events: {
              onHover: { enable: true, mode: "repulse" },
              onClick: { enable: true, mode: "push" }
            },
            modes: {
              repulse: { distance: 100, duration: 0.4 },
              push: { quantity: 4 }
            }
          }
        }}
      />
<h1 className="cinematic-h1">
  {"Sorting Visualizer".split("").map((char, i) => (
    <span key={i} style={{ animationDelay: `${i * 0.08}s` }}>
      {char === " " ? "\u00A0" : char}
    </span>
  ))}
</h1>


    </div>
  );
}
