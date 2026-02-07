import { motion } from 'framer-motion';
import { Brain, Zap, Shield, BarChart3, Eye, Cpu } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Precision',
    description: 'Our U-Net architecture analyzes spectrograms to distinguish speech from noise with 98.7% accuracy.',
    size: 'large',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'GPU-accelerated inference processes 1 hour of audio in under 2 minutes.',
    size: 'small',
  },
  {
    icon: Shield,
    title: 'Studio Quality',
    description: 'Output matches professional recording standards with enhanced SNR and PESQ scores.',
    size: 'small',
  },
  {
    icon: BarChart3,
    title: 'Secure Processing',
    description: 'End-to-end encryption. Your audio is deleted immediately after processing.',
    size: 'small',
  },
  {
    icon: Eye,
    title: 'Real-time Visualization',
    description: 'Watch the AI work with live spectrogram comparison and noise reduction metrics. See the transformation happen in real-time as our neural network identifies and removes unwanted noise.',
    size: 'wide',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.165, 0.84, 0.44, 1] as const,
    },
  },
};

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      {/* Background Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-ai-accent/5 blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ai-accent/10 border border-ai-accent/30 mb-6"
          >
            <Cpu className="w-4 h-4 text-ai-cyan" />
            <span className="text-sm text-ai-cyan">Features</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-6">
            Everything You Need for
            <span className="text-gradient block mt-2">Perfect Audio</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Professional-grade noise reduction powered by state-of-the-art deep learning technology.
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => {
            const isLarge = feature.size === 'large';
            const isWide = feature.size === 'wide';
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`
                  glass-card p-6 lg:p-8 group hover:border-ai-cyan/30 transition-all duration-500
                  ${isLarge ? 'md:col-span-2 lg:col-span-2 lg:row-span-2' : ''}
                  ${isWide ? 'md:col-span-2 lg:col-span-3' : ''}
                `}
              >
                <div className={`h-full flex flex-col ${isLarge ? 'lg:flex-row lg:items-start lg:gap-8' : ''}`}>
                  {/* Icon */}
                  <div className={`
                    relative mb-4 group-hover:scale-110 transition-transform duration-500
                    ${isLarge ? 'lg:mb-0' : ''}
                  `}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-ai-accent/20 to-ai-violet/20 flex items-center justify-center border border-ai-accent/30 group-hover:border-ai-cyan/50 transition-colors">
                      <feature.icon className="w-6 h-6 text-ai-cyan" />
                    </div>
                    <div className="absolute inset-0 rounded-xl bg-ai-cyan/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-medium text-white mb-3 group-hover:text-ai-cyan transition-colors">
                      {feature.title}
                    </h3>
                    <p className={`text-white/60 leading-relaxed ${isLarge ? 'lg:text-lg' : ''}`}>
                      {feature.description}
                    </p>
                  </div>

                  {/* Decorative Element for Large Card */}
                  {isLarge && (
                    <div className="hidden lg:block absolute right-8 top-1/2 -translate-y-1/2">
                      <div className="relative w-32 h-32">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                          className="absolute inset-0"
                        >
                          {[...Array(8)].map((_, i) => (
                            <div
                              key={i}
                              className="absolute w-1 h-4 bg-gradient-to-t from-ai-accent to-ai-cyan rounded-full"
                              style={{
                                top: '50%',
                                left: '50%',
                                transform: `rotate(${i * 45}deg) translateY(-40px)`,
                                transformOrigin: 'center',
                              }}
                            />
                          ))}
                        </motion.div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Brain className="w-12 h-12 text-ai-cyan" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Hover Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-ai-cyan/5 to-ai-violet/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
