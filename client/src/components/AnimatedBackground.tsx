import { useEffect, useState, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function Particles({ count = 25 }: { count?: number }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 10,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-blue-400"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 4}px ${p.size}px rgba(59, 130, 246, 0.5)`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function TechGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-[0.08]">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: "perspective(500px) rotateX(60deg) translateY(-50%)",
          transformOrigin: "center bottom",
        }}
      />
    </div>
  );
}

function LightSweep() {
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="absolute w-[200%] h-[2px]"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.6), rgba(139, 92, 246, 0.6), transparent)",
          top: "30%",
          left: "-100%",
          boxShadow: "0 0 40px 10px rgba(59, 130, 246, 0.3)",
        }}
        animate={{
          left: ["−100%", "100%"],
          top: ["20%", "80%"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatDelay: 4,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-[2px] h-[200%]"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(139, 92, 246, 0.5), rgba(6, 182, 212, 0.5), transparent)",
          left: "70%",
          top: "-100%",
          boxShadow: "0 0 30px 8px rgba(139, 92, 246, 0.2)",
        }}
        animate={{
          top: ["-100%", "100%"],
          left: ["80%", "20%"],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "easeInOut",
        }}
      />
    </motion.div>
  );
}

function GlowOrbs() {
  const { scrollYProgress } = useScroll();

  const orb1X = useTransform(scrollYProgress, [0, 1], ["5%", "70%"]);
  const orb1Y = useTransform(scrollYProgress, [0, 1], ["10%", "60%"]);
  const orb2X = useTransform(scrollYProgress, [0, 1], ["85%", "20%"]);
  const orb2Y = useTransform(scrollYProgress, [0, 1], ["50%", "10%"]);
  const orb3X = useTransform(scrollYProgress, [0, 1], ["40%", "80%"]);
  const orb3Y = useTransform(scrollYProgress, [0, 1], ["70%", "40%"]);

  const intensity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1.4, 1.2, 0.8]);

  return (
    <>
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.4) 0%, rgba(59, 130, 246, 0.1) 40%, transparent 70%)",
          filter: "blur(80px)",
          left: orb1X,
          top: orb1Y,
          scale: intensity,
          transform: "translate(-50%, -50%)",
        }}
      />
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(139, 92, 246, 0.35) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)",
          filter: "blur(60px)",
          left: orb2X,
          top: orb2Y,
          transform: "translate(-50%, -50%)",
        }}
      />
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(6, 182, 212, 0.3) 0%, rgba(6, 182, 212, 0.08) 40%, transparent 70%)",
          filter: "blur(50px)",
          left: orb3X,
          top: orb3Y,
          transform: "translate(-50%, -50%)",
        }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full"
        style={{
          background: "radial-gradient(circle at center, rgba(236, 72, 153, 0.25) 0%, transparent 60%)",
          filter: "blur(70px)",
          left: "60%",
          top: "30%",
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </>
  );
}

function MeshGradient() {
  return (
    <motion.div
      className="absolute inset-0"
      style={{
        background: `
          radial-gradient(ellipse 80% 50% at 20% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
          radial-gradient(ellipse 60% 40% at 80% 20%, rgba(139, 92, 246, 0.12) 0%, transparent 50%),
          radial-gradient(ellipse 50% 60% at 60% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
          radial-gradient(ellipse 70% 30% at 30% 90%, rgba(236, 72, 153, 0.08) 0%, transparent 50%)
        `,
      }}
      animate={{
        backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
      }}
      transition={{
        duration: 20,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

function NoiseOverlay() {
  return (
    <div
      className="absolute inset-0 opacity-[0.03] pointer-events-none"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }}
    />
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
      
      <MeshGradient />
      
      <GlowOrbs />
      
      <TechGrid />
      
      <LightSweep />
      
      <Particles count={30} />
      
      <NoiseOverlay />
      
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/60" />
    </div>
  );
}
