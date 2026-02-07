"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Hero() {
  const t = useTranslations("Hero");

  return (
    <section className="relative min-h-[90vh] flex items-center bg-turtle-950 overflow-hidden">
      {/* Animated gradient orbs */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-turtle-600/20 blur-[120px]"
          animate={{
            x: [0, 100, -50, 0],
            y: [0, -80, 40, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ top: "-10%", left: "10%" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[100px]"
          animate={{
            x: [0, -60, 80, 0],
            y: [0, 60, -40, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{ bottom: "0%", right: "10%" }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] rounded-full bg-turtle-400/10 blur-[80px]"
          animate={{
            x: [0, 50, -30, 0],
            y: [0, -30, 50, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          style={{ top: "40%", left: "50%" }}
        />
      </div>

      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <Container className="relative z-10 py-20">
        <div className="max-w-3xl">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {t("tagline")}
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl text-turtle-200 mt-6 max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {t("subtitle")}
          </motion.p>
          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <Button href="#contact" className="text-lg px-10 py-4">
              {t("cta")}
            </Button>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
