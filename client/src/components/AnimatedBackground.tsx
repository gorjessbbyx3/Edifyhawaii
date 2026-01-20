import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function TechGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.06]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
          transform: "perspective(500px) rotateX(60deg) translateY(-50%)",
          transformOrigin: "center bottom",
        }}
      />
    </div>
  );
}

function LightSweep() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute w-[200%] h-[1px] animate-sweep-horizontal"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.5), rgba(139, 92, 246, 0.5), transparent)",
          top: "35%",
          left: "-100%",
          boxShadow: "0 0 30px 6px rgba(59, 130, 246, 0.2)",
        }}
      />
    </div>
  );
}

function GlowOrbs() {
  const { scrollYProgress } = useScroll();

  const orb1X = useTransform(scrollYProgress, [0, 1], ["10%", "60%"]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["15%", "50%"]);
  const orb2X = useTransform(scrollYProgress, [0, 1], ["80%", "30%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["45%", "15%"]);

  return (
    <>
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.25) 0%, transparent 60%)",
          filter: "blur(40px)",
          left: orb1X,
          top: orb1Y,
          transform: "translate(-50%, -50%)",
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.2) 0%, transparent 60%)",
          filter: "blur(35px)",
          left: orb2X,
          top: orb2Y,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}

function StaticParticles() {
  const particles = [
    { x: 15, y: 20, delay: 0 },
    { x: 85, y: 15, delay: 1 },
    { x: 45, y: 70, delay: 2 },
    { x: 70, y: 40, delay: 0.5 },
    { x: 25, y: 55, delay: 1.5 },
    { x: 90, y: 75, delay: 2.5 },
    { x: 55, y: 25, delay: 0.8 },
    { x: 10, y: 80, delay: 1.2 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-blue-400/40 animate-float"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-slate-950" />
      
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 20% 30%, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
            radial-gradient(ellipse 50% 35% at 75% 25%, rgba(139, 92, 246, 0.06) 0%, transparent 50%),
            radial-gradient(ellipse 45% 50% at 50% 75%, rgba(6, 182, 212, 0.05) 0%, transparent 50%)
          `,
        }}
      />
      
      <GlowOrbs />
      
      <TechGrid />
      
      <LightSweep />
      
      <StaticParticles />
      
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-transparent to-slate-950/50" />
    </div>
  );
}
