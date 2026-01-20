import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function TechGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.04]">
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

function SectionGradients() {
  const { scrollYProgress } = useScroll();

  const blueOpacity = useTransform(scrollYProgress, [0, 0.2, 0.4], [0.15, 0.08, 0.02]);
  const purpleOpacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6], [0.02, 0.12, 0.02]);
  const cyanOpacity = useTransform(scrollYProgress, [0.4, 0.6, 0.8], [0.02, 0.1, 0.02]);
  const pinkOpacity = useTransform(scrollYProgress, [0.6, 0.8, 1], [0.02, 0.08, 0.15]);

  const blueX = useTransform(scrollYProgress, [0, 1], ["20%", "80%"]);
  const purpleX = useTransform(scrollYProgress, [0, 1], ["70%", "20%"]);
  const cyanX = useTransform(scrollYProgress, [0, 1], ["30%", "60%"]);
  const pinkX = useTransform(scrollYProgress, [0, 1], ["80%", "30%"]);

  return (
    <>
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle at center, rgba(59, 130, 246, 1) 0%, transparent 60%)",
          filter: "blur(80px)",
          left: blueX,
          top: "10%",
          opacity: blueOpacity,
          transform: "translate(-50%, 0)",
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle at center, rgba(139, 92, 246, 1) 0%, transparent 60%)",
          filter: "blur(70px)",
          left: purpleX,
          top: "30%",
          opacity: purpleOpacity,
          transform: "translate(-50%, 0)",
        }}
      />
      <motion.div
        className="absolute w-[450px] h-[450px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle at center, rgba(6, 182, 212, 1) 0%, transparent 60%)",
          filter: "blur(60px)",
          left: cyanX,
          top: "55%",
          opacity: cyanOpacity,
          transform: "translate(-50%, 0)",
        }}
      />
      <motion.div
        className="absolute w-[550px] h-[550px] rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle at center, rgba(236, 72, 153, 1) 0%, transparent 60%)",
          filter: "blur(75px)",
          left: pinkX,
          top: "75%",
          opacity: pinkOpacity,
          transform: "translate(-50%, 0)",
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
  ];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-blue-400/30 animate-float"
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
      
      <SectionGradients />
      
      <TechGrid />
      
      <LightSweep />
      
      <StaticParticles />
      
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/10 via-transparent to-slate-950/40" />
    </div>
  );
}
