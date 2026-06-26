'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'lucide-react';

export default function Loader({ loading }: { loading: boolean }) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          exit={{ y: '-100%' }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="fixed inset-0 bg-black z-2000 flex items-center justify-center text-black"
        >
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 0.5, repeatType: 'reverse' }}
            >
              <Command size={40} />
            </motion.div>
            <div className="mt-5 font-bold tracking-widest">
              <img src="/assets/logo.png" alt="Logo" width={100} height={100} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
