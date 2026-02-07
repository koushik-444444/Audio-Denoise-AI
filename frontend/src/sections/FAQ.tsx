import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What audio formats are supported?",
    answer: "We support MP3, WAV, FLAC, M4A, and OGG files up to 100MB in size. For best results, we recommend using uncompressed WAV files. Our system automatically converts all inputs to the optimal format for processing.",
  },
  {
    question: "Is my audio data secure?",
    answer: "Absolutely. All uploads are encrypted with TLS 1.3. Files are processed in isolated containers and permanently deleted immediately after processing completes. We never store, share, or use your audio for any purpose. Your privacy is our top priority.",
  },
  {
    question: "How does the U-Net model work?",
    answer: "U-Net is a convolutional neural network that learns to map noisy spectrograms to clean ones. It uses an encoder-decoder structure with skip connections to preserve audio details while removing noise. The model was trained on thousands of hours of audio pairs (clean + noisy) to learn the patterns of different noise types.",
  },
  {
    question: "Can I use this for commercial projects?",
    answer: "Yes! All paid plans include commercial usage rights. The free plan is for personal use only. With a Pro or Enterprise plan, you can use the denoised audio in podcasts, videos, music, and any commercial project without attribution.",
  },
  {
    question: "What is the processing time?",
    answer: "Processing time depends on file length and server load. On average, we process 1 hour of audio in under 2 minutes using our GPU-accelerated infrastructure. Shorter files (under 5 minutes) typically process in 10-30 seconds.",
  },
  {
    question: "Do you offer an API?",
    answer: "Yes! We offer a RESTful API for developers and businesses who want to integrate our denoising technology into their applications. The API supports batch processing, webhooks, and custom model configurations. Contact us for API access and pricing.",
  },
];

function FAQItem({ question, answer, isOpen, onClick }: {
  question: string;
  answer: string;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <div className="border-b border-ai-accent/20 last:border-0">
      <button
        onClick={onClick}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-lg font-medium text-white group-hover:text-ai-cyan transition-colors pr-8">
          {question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0"
        >
          <ChevronDown className="w-5 h-5 text-ai-cyan" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-white/60 leading-relaxed">
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-ai-accent/5 blur-[150px]" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            <HelpCircle className="w-4 h-4 text-ai-cyan" />
            <span className="text-sm text-ai-cyan">FAQ</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-6">
            Frequently Asked
            <span className="text-gradient block mt-2">Questions</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Everything you need to know about AudioDenoise AI.
          </p>
        </motion.div>

        {/* FAQ List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card p-6 lg:p-10"
        >
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <p className="text-white/60">
            Still have questions?{' '}
            <a href="#contact" className="text-ai-cyan hover:underline">
              Contact our support team
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
