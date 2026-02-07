import { motion } from 'framer-motion';
import { Mic, Radio, Headphones, Music, Volume2, Podcast } from 'lucide-react';

const logos = [
  { icon: Mic, name: 'PodcastPro' },
  { icon: Radio, name: 'BroadcastHub' },
  { icon: Headphones, name: 'AudioMax' },
  { icon: Music, name: 'SoundWave' },
  { icon: Volume2, name: 'ClearAudio' },
  { icon: Podcast, name: 'VoiceCast' },
];

export default function LogoMarquee() {
  return (
    <section className="py-16 border-y border-ai-accent/10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center text-sm text-white/40 uppercase tracking-wider"
        >
          Trusted by creators worldwide
        </motion.p>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-ai-black to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-ai-black to-transparent z-10" />

        {/* Scrolling Content */}
        <motion.div
          animate={{ x: [0, '-50%'] }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex gap-16 items-center"
        >
          {/* Double the logos for seamless loop */}
          {[...logos, ...logos].map((logo, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-8 py-4 glass-card hover:border-ai-cyan/30 transition-colors cursor-pointer group"
            >
              <logo.icon className="w-6 h-6 text-white/40 group-hover:text-ai-cyan transition-colors" />
              <span className="text-lg font-medium text-white/40 group-hover:text-white transition-colors whitespace-nowrap">
                {logo.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
