import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export function AnimatedBackground() {
  const { scrollYProgress } = useScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const gradient1X = useTransform(scrollYProgress, [0, 1], ["10%", "60%"]);
  const gradient1Y = useTransform(scrollYProgress, [0, 1], ["10%", "40%"]);
  const gradient2X = useTransform(scrollYProgress, [0, 1], ["80%", "30%"]);
  const gradient2Y = useTransform(scrollYProgress, [0, 1], ["60%", "20%"]);
  const gradient3X = useTransform(scrollYProgress, [0, 1], ["50%", "70%"]);
  const gradient3Y = useTransform(scrollYProgress, [0, 1], ["80%", "60%"]);
  
  const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.6, 1], [0.15, 0.25, 0.15, 0.1]);
  const opacity2 = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.1, 0.2, 0.25, 0.15]);
  const opacity3 = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.2, 0.1]);

  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.3, 1]);
  const scale2 = useTransform(scrollYProgress, [0, 0.5, 1], [1.2, 1, 1.3]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full blur-[150px]"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
          left: gradient1X,
          top: gradient1Y,
          opacity: opacity1,
          scale: scale1,
        }}
      />
      
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)",
          left: gradient2X,
          top: gradient2Y,
          opacity: opacity2,
          scale: scale2,
        }}
      />
      
      <motion.div
        className="absolute w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{
          background: "radial-gradient(circle, rgba(6, 182, 212, 0.25) 0%, transparent 70%)",
          left: gradient3X,
          top: gradient3Y,
          opacity: opacity3,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950/80" />
    </div>
  );
}
