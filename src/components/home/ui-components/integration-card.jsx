'use client';

import { motion } from 'framer-motion';
import Card3D from './3d-card';

export default function IntegrationCard({ title, description, icon, className = "" }) {
  return (
    <Card3D className={`bg-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-800 ${className}`}>
      <div className="w-12 h-12 bg-white rounded-xl mb-4 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-bold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
      
      {/* Hover indicator */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-[#8CE563] to-[#8CE563]/50 w-0"
        whileHover={{ width: '100%' }}
        transition={{ duration: 0.3 }}
      />
    </Card3D>
  );
}

