'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Button({ 
  children, 
  variant = "primary", 
  size = "md", 
  className = "", 
  onClick,
  ...props 
}) {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseClasses = "rounded-full font-medium transition-all duration-300 inline-flex items-center justify-center relative overflow-hidden";
  
  const variants = {
    primary: "bg-[#8CE563] text-black hover:bg-[#9df774] active:bg-[#7ad152]",
    secondary: "bg-transparent border border-gray-700 text-white hover:border-gray-500 hover:bg-gray-800",
    outline: "bg-transparent border border-[#8CE563] text-[#8CE563] hover:bg-[#8CE563]/10",
    dark: "bg-gray-800 text-white hover:bg-gray-700",
  };
  
  const sizes = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3",
  };
  
  return (
    <motion.button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      {...props}
    >
      {/* Animated background effect */}
      {variant === "primary" && (
        <motion.div 
          className="absolute inset-0 bg-gradient-to-r from-[#8CE563] via-[#a5ff7a] to-[#8CE563] opacity-100"
          initial={{ x: '-100%' }}
          animate={{ x: isHovered ? '100%' : '-100%' }}
          transition={{ duration: 1, ease: "easeInOut", repeat: isHovered ? Infinity : 0 }}
        />
      )}
      
      <span className="relative z-10">{children}</span>
      
      {/* Glow effect */}
      {variant === "primary" && (
        <motion.div 
          className="absolute inset-0 rounded-full"
          animate={{ boxShadow: isHovered ? '0 0 15px 2px rgba(140, 229, 99, 0.5)' : '0 0 0px 0px rgba(140, 229, 99, 0)' }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.button>
  );
}

