'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <section className="px-15 py-30 relative z-1">
        <div className="max-w-200 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-[0.7rem] text-neutral-500 tracking-widest mb-5 font-semibold">CONTACT</div>
            <h1 className="font-extrabold leading-tight tracking-tighter mb-10" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
              Get In Touch
            </h1>
            <p className="max-w-150 text-lg leading-relaxed opacity-70 font-light mb-15">
              Have a question about the platform? Want to partner with us? Drop us a message and our team will respond within 24 hours.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {submitted ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-5">&check;</div>
                <h2 className="text-2xl font-bold mb-3">MESSAGE SENT</h2>
                <p className="opacity-60 font-light">We&apos;ll be in touch within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-neutral-500 mb-2 font-medium tracking-wide">NAME</label>
                    <input required className="form-input" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="block text-sm text-neutral-500 mb-2 font-medium tracking-wide">EMAIL</label>
                    <input required type="email" className="form-input" placeholder="you@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-neutral-500 mb-2 font-medium tracking-wide">SUBJECT</label>
                  <input required className="form-input" placeholder="What is this regarding?" />
                </div>
                <div>
                  <label className="block text-sm text-neutral-500 mb-2 font-medium tracking-wide">MESSAGE</label>
                  <textarea required rows={5} className="form-input resize-y" placeholder="Tell us more..." />
                </div>
                <button type="submit" className="inline-flex items-center gap-2 self-start bg-white text-black px-8 py-3.5 font-bold border-none rounded cursor-pointer text-sm tracking-wider transition-all duration-300 hover:translate-y-[-2px]">
                  <Send size={16} />
                  SEND MESSAGE
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
