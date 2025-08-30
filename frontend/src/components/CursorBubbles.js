import { useCallback } from "react";
import Particles from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

export default function CursorBubbles() {
  const particlesInit = useCallback(async (engine) => {
    // Load only slim version to avoid errors
    await loadSlim(engine);
  }, []);

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={{
        fullScreen: { enable: true, zIndex: 0 },
        background: { color: "#1e1e2f" },
        particles: {
          number: { value: 40, density: { enable: true, area: 800 } },
          color: { value: ["#64b5f6", "#ffb74d"] }, // theme colors
          shape: { type: "circle" },
          opacity: { value: 0.5, random: true },
          size: { value: { min: 2, max: 6 } },
          move: { enable: true, speed: 1.5, outModes: "out" },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "repulse" },
            onClick: { enable: true, mode: "push" },
          },
          modes: {
            repulse: { distance: 120 },
            push: { quantity: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
}
