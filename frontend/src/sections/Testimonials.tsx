import { motion } from 'framer-motion';
import { Quote, Star, MessageSquare } from 'lucide-react';

const testimonials = [
  {
    quote: "This tool saved me hours of manual editing. The noise reduction is incredible—it removes background hum without affecting voice quality.",
    name: "Sarah Chen",
    role: "Podcast Producer",
    avatar: "SC",
    rating: 5,
  },
  {
    quote: "Finally, an AI that understands audio. My interviews sound like they were recorded in a professional studio, even when done on the street.",
    name: "Marcus Johnson",
    role: "Journalist",
    avatar: "MJ",
    rating: 5,
  },
  {
    quote: "I use this on all my field recordings. It's like having a sound engineer in my pocket. The U-Net model is genuinely impressive.",
    name: "Elena Rodriguez",
    role: "Documentary Filmmaker",
    avatar: "ER",
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-ai-violet/10 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-ai-accent/10 blur-[120px]" />
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
            <MessageSquare className="w-4 h-4 text-ai-cyan" />
            <span className="text-sm text-ai-cyan">Testimonials</span>
          </motion.div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium mb-6">
            What Creators Are
            <span className="text-gradient block mt-2">Saying</span>
          </h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Join thousands of professionals who trust AudioDenoise AI for their audio needs.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="glass-card p-6 lg:p-8 group hover:border-ai-cyan/30 transition-all duration-500 relative"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 -left-2 w-10 h-10 rounded-full bg-gradient-to-br from-ai-cyan to-ai-violet flex items-center justify-center">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-ai-cyan text-ai-cyan" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-white/80 leading-relaxed mb-6">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-ai-accent to-ai-violet flex items-center justify-center text-white font-medium">
                  {testimonial.avatar}
                </div>
                <div>
                  <div className="text-white font-medium">{testimonial.name}</div>
                  <div className="text-sm text-white/50">{testimonial.role}</div>
                </div>
              </div>

              {/* Hover Glow */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-ai-cyan/5 to-ai-violet/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 glass-card p-8"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '50,000+', label: 'Active Users' },
              { value: '2M+', label: 'Files Processed' },
              { value: '4.9/5', label: 'User Rating' },
              { value: '99.9%', label: 'Satisfaction' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-2xl lg:text-3xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
