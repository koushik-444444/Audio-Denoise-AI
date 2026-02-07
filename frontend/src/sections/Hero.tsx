import { motion } from 'framer-motion';
import { ArrowRight, Play, Activity } from 'lucide-react';

const WaveformBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-ai-accent/20 blur-[120px]"
      />
      <motion.div
        animate={{
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-ai-violet/20 blur-[100px]"
      />
      
      {/* Animated Waveform Lines */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-[1px]"
            style={{
              top: `${50 + (i - 10) * 3}%`,
              background: `linear-gradient(90deg, transparent 0%, ${i % 2 === 0 ? '#00f0ff' : '#8652ff'} 50%, transparent 100%)`,
            }}
            animate={{
              scaleX: [0.5, 1, 0.5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.1,
            }}
          />
        ))}
      </div>

      {/* Vertical Wave Bars */}
      <div className="absolute right-[10%] top-1/2 -translate-y-1/2 flex items-center gap-1 opacity-30">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full bg-gradient-to-t from-ai-accent to-ai-cyan"
            animate={{
              height: [20, 60 + Math.random() * 80, 20],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.05,
            }}
          />
        ))}
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(104, 4, 171, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(104, 4, 171, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />
    </div>
  );
};

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <WaveformBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ai-accent/10 border border-ai-accent/30 mb-8"
            >
              <Activity className="w-4 h-4 text-ai-cyan" />
              <span className="text-sm text-ai-cyan">Powered by TensorFlow U-Net</span>
            </motion.div>

            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-medium leading-tight mb-6"
            >
              <motion.span
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.165, 0.84, 0.44, 1] }}
                className="block overflow-hidden"
              >
                <span className="block">Eliminate Noise.</span>
              </motion.span>
              <motion.span
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.165, 0.84, 0.44, 1] }}
                className="block overflow-hidden"
              >
                <span className="block text-gradient glow-text">Amplify Clarity.</span>
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1 }}
              className="text-lg text-white/60 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Studio-grade audio cleanup powered by deep learning. Remove background noise, 
              enhance speech, and deliver professional-quality audio in seconds.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.a
                href="#demo"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary inline-flex items-center justify-center gap-2 group"
              >
                Denoise Audio Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4" />
                View Demo
              </motion.button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: '50M+', label: 'Parameters' },
                { value: '<50ms', label: 'Latency' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl font-semibold text-gradient">{stat.value}</div>
                  <div className="text-sm text-white/50">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Visual Demo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Glass Card */}
              <div className="glass-card p-6 relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ai-cyan to-ai-violet flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">Audio Processing</div>
                      <div className="text-xs text-white/50">U-Net Model Active</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-green-400">Live</span>
                  </div>
                </div>

                {/* Waveform Visualization */}
                <div className="h-32 bg-ai-black/50 rounded-xl border border-ai-accent/20 p-4 mb-4">
                  <div className="flex items-center justify-center h-full gap-[2px]">
                    {[...Array(60)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="w-1 rounded-full bg-gradient-to-t from-ai-accent to-ai-cyan"
                        animate={{
                          height: [`${20 + Math.random() * 30}%`, `${40 + Math.random() * 50}%`, `${20 + Math.random() * 30}%`],
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: i * 0.02,
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Progress Indicators */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Noise Reduction</span>
                    <span className="text-ai-cyan">-24.5 dB</span>
                  </div>
                  <div className="h-2 bg-ai-accent/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '85%' }}
                      transition={{ duration: 2, delay: 1.5 }}
                      className="h-full bg-gradient-to-r from-ai-cyan to-ai-violet rounded-full"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">SNR Improvement</span>
                    <span className="text-ai-violet">+18.2 dB</span>
                  </div>
                  <div className="h-2 bg-ai-accent/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '78%' }}
                      transition={{ duration: 2, delay: 1.8 }}
                      className="h-full bg-gradient-to-r from-ai-violet to-ai-accent rounded-full"
                    />
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full bg-ai-cyan/20 blur-xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full bg-ai-violet/20 blur-xl" />
              
              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-8 -left-8 glass-card px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-xs text-white/70">GPU Accelerated</span>
                </div>
              </motion.div>
              
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-8 -right-8 glass-card px-4 py-2"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-ai-cyan" />
                  <span className="text-xs text-white/70">TensorFlow 2.x</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-ai-black to-transparent" />
    </section>
  );
}
