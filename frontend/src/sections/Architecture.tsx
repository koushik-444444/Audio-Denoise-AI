import { motion } from 'framer-motion';
import { ArrowRight, Layers, Cpu, GitBranch, Activity } from 'lucide-react';

const architectureSteps = [
  {
    icon: Activity,
    title: 'Input',
    description: 'Noisy Spectrogram',
    details: 'STFT converts waveform to frequency domain',
    color: 'from-red-500 to-orange-500',
  },
  {
    icon: Layers,
    title: 'Encoder',
    description: 'Feature Extraction',
    details: '4 convolutional blocks with max pooling',
    color: 'from-orange-500 to-yellow-500',
  },
  {
    icon: Cpu,
    title: 'Bottleneck',
    description: 'Latent Representation',
    details: 'Deepest feature extraction layer',
    color: 'from-yellow-500 to-green-500',
  },
  {
    icon: GitBranch,
    title: 'Decoder',
    description: 'Signal Reconstruction',
    details: '4 upsampling blocks with skip connections',
    color: 'from-green-500 to-cyan-500',
  },
  {
    icon: Activity,
    title: 'Output',
    description: 'Clean Audio',
    details: 'iSTFT reconstructs waveform',
    color: 'from-cyan-500 to-ai-cyan',
  },
];

const stats = [
  { value: '50M+', label: 'Parameters', description: 'Trainable weights' },
  { value: '<50ms', label: 'Latency', description: 'Per inference' },
  { value: '99.9%', label: 'Uptime', description: 'Service availability' },
  { value: '4 Layers', label: 'Depth', description: 'Encoder/Decoder' },
];

export default function Architecture() {
  return (
    <section id="architecture" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-ai-accent/5 blur-[200px]" />
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
            <Layers className="w-4 h-4 text-ai-cyan" />
            <span className="text-sm text-ai-cyan">Architecture</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-6">
            The Technology Behind
            <span className="text-gradient block mt-2">the Silence</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            U-Net Convolutional Architecture optimized for spectrogram-based audio denoising.
          </p>
        </motion.div>

        {/* Architecture Flow */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="glass-card p-8 lg:p-12">
            {/* Desktop Flow */}
            <div className="hidden lg:flex items-center justify-between gap-4">
              {architectureSteps.map((step, index) => (
                <div key={index} className="flex items-center gap-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.15 }}
                    className="relative group"
                  >
                    <div className={`
                      w-24 h-24 rounded-2xl bg-gradient-to-br ${step.color} p-[2px]
                      group-hover:scale-110 transition-transform duration-500
                    `}>
                      <div className="w-full h-full rounded-2xl bg-ai-black flex flex-col items-center justify-center p-2">
                        <step.icon className="w-6 h-6 text-white mb-2" />
                        <span className="text-xs text-white/80 text-center">{step.title}</span>
                      </div>
                    </div>
                    
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.color} blur-xl opacity-0 group-hover:opacity-50 transition-opacity`} />
                    
                    {/* Tooltip */}
                    <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-48 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="glass-card p-3 text-center">
                        <div className="text-sm text-white font-medium">{step.description}</div>
                        <div className="text-xs text-white/50 mt-1">{step.details}</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  {index < architectureSteps.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.15 + 0.1 }}
                      className="flex items-center"
                    >
                      <ArrowRight className="w-6 h-6 text-ai-accent" />
                      <div className="w-8 h-[2px] bg-gradient-to-r from-ai-accent to-ai-violet" />
                    </motion.div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile Flow */}
            <div className="lg:hidden space-y-6">
              {architectureSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className={`
                    w-16 h-16 rounded-xl bg-gradient-to-br ${step.color} p-[2px] flex-shrink-0
                  `}>
                    <div className="w-full h-full rounded-xl bg-ai-black flex flex-col items-center justify-center">
                      <step.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div>
                    <div className="text-white font-medium">{step.title}</div>
                    <div className="text-sm text-white/60">{step.description}</div>
                    <div className="text-xs text-white/40">{step.details}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Skip Connections Visualization */}
            <div className="mt-12 pt-8 border-t border-ai-accent/20">
              <div className="flex items-center gap-4 mb-4">
                <GitBranch className="w-5 h-5 text-ai-cyan" />
                <span className="text-white font-medium">Skip Connections</span>
              </div>
              <p className="text-white/60 text-sm">
                U-Net uses skip connections to preserve high-resolution features from the encoder, 
                enabling precise reconstruction of audio details while removing noise.
              </p>
              
              {/* Visual Representation */}
              <div className="mt-6 flex justify-center">
                <svg viewBox="0 0 400 100" className="w-full max-w-lg">
                  {/* Encoder blocks */}
                  {[0, 1, 2, 3].map((i) => (
                    <rect
                      key={`enc-${i}`}
                      x={20 + i * 50}
                      y={70}
                      width="30"
                      height="20"
                      rx="4"
                      fill="url(#encGradient)"
                      className="opacity-60"
                    />
                  ))}
                  
                  {/* Bottleneck */}
                  <rect
                    x={220}
                    y={75}
                    width="30"
                    height="15"
                    rx="4"
                    fill="url(#botGradient)"
                  />
                  
                  {/* Decoder blocks */}
                  {[0, 1, 2, 3].map((i) => (
                    <rect
                      key={`dec-${i}`}
                      x={270 + i * 25}
                      y={70 - i * 15}
                      width="20"
                      height="20 + i * 10"
                      rx="4"
                      fill="url(#decGradient)"
                      className="opacity-60"
                    />
                  ))}
                  
                  {/* Skip connections */}
                  {[0, 1, 2, 3].map((i) => (
                    <path
                      key={`skip-${i}`}
                      d={`M ${35 + i * 50} 70 Q ${120 + i * 30} ${30 - i * 5} ${280 + i * 25} ${60 - i * 15}`}
                      stroke="#00f0ff"
                      strokeWidth="1"
                      strokeDasharray="4 2"
                      fill="none"
                      opacity="0.5"
                    />
                  ))}
                  
                  <defs>
                    <linearGradient id="encGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#eab308" />
                    </linearGradient>
                    <linearGradient id="botGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#22c55e" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                    <linearGradient id="decGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#06b6d4" />
                      <stop offset="100%" stopColor="#00f0ff" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 text-center group hover:border-ai-cyan/30 transition-colors"
            >
              <div className="text-3xl lg:text-4xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-white font-medium mb-1">{stat.label}</div>
              <div className="text-sm text-white/50">{stat.description}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Training Pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-12 glass-card p-8"
        >
          <h3 className="text-xl font-medium text-white mb-6">TensorFlow Training Pipeline</h3>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Data Collection', desc: 'Clean + noisy audio pairs' },
              { step: '2', title: 'Preprocessing', desc: 'STFT to spectrograms' },
              { step: '3', title: 'Training', desc: 'MSE loss optimization' },
              { step: '4', title: 'Export', desc: 'SavedModel format' },
            ].map((item, index) => (
              <div key={index} className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-ai-cyan to-ai-violet flex items-center justify-center text-sm font-bold text-white">
                    {item.step}
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block flex-1 h-[2px] bg-ai-accent/30" />
                  )}
                </div>
                <h4 className="text-white font-medium mb-1">{item.title}</h4>
                <p className="text-sm text-white/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
