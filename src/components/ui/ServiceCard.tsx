"use client";

import { motion } from "framer-motion";

type ServiceCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
};

export default function ServiceCard({ icon, title, description, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      whileHover={{ y: -4, transition: { type: "spring", stiffness: 300, damping: 20 } }}
      className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 border border-turtle-100/50 shadow-sm hover:shadow-lg hover:border-turtle-200 transition-all duration-300"
    >
      <div className="w-12 h-12 bg-gradient-to-br from-turtle-100 to-turtle-50 rounded-xl flex items-center justify-center text-turtle-700 text-2xl">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-bark-900 mt-4">{title}</h3>
      <p className="text-bark-600 mt-2 leading-relaxed">{description}</p>
    </motion.div>
  );
}
