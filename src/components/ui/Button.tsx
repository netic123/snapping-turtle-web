"use client";

import { motion } from "framer-motion";

type ButtonProps = {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "outline";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
};

export default function Button({
  children,
  href,
  onClick,
  variant = "primary",
  type = "button",
  disabled = false,
  className = "",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-8 py-3 rounded-xl font-medium transition-all duration-200";
  const variants = {
    primary: "bg-turtle-600 hover:bg-turtle-700 text-white shadow-md hover:shadow-lg shadow-turtle-600/25",
    outline:
      "border-2 border-turtle-600 text-turtle-700 hover:bg-turtle-50",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.a>
    );
  }

  if (onClick) {
    return (
      <motion.button
        onClick={onClick}
        className={classes}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      className={`${classes} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      whileHover={disabled ? {} : { scale: 1.03 }}
      whileTap={disabled ? {} : { scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
}
