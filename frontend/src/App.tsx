import { useEffect } from 'react';
import { Toaster } from 'sonner';
import Navigation from './components/Navigation';
import Hero from './sections/Hero';
import LogoMarquee from './sections/LogoMarquee';
import Features from './sections/Features';
import Demo from './sections/Demo';
import Architecture from './sections/Architecture';
import Testimonials from './sections/Testimonials';
import FAQ from './sections/FAQ';
import CTA from './sections/CTA';
import Footer from './sections/Footer';
import './App.css';

function App() {
  // Smooth scroll for anchor links
  useEffect(() => {
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (anchor) {
        const href = anchor.getAttribute('href');
        if (href && href !== '#') {
          e.preventDefault();
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);
    return () => document.removeEventListener('click', handleAnchorClick);
  }, []);

  return (
    <div className="min-h-screen bg-ai-black text-white overflow-x-hidden">
      {/* Noise Overlay */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.015]">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* Navigation */}
      <Navigation />
      <Toaster position="top-center" richColors />

      {/* Main Content */}
      <main>
        <Hero />
        <LogoMarquee />
        <Features />
        <Demo />
        <Architecture />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>

      {/* Footer */}
      <Footer />

      {/* Scroll Progress Indicator */}
      <ScrollProgress />
    </div>
  );
}

// Scroll Progress Component
function ScrollProgress() {
  useEffect(() => {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      progressBar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateProgress, { passive: true });
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 h-1 z-[100] bg-transparent">
      <div
        id="scroll-progress"
        className="h-full bg-gradient-to-r from-ai-cyan via-ai-violet to-ai-accent transition-all duration-100"
        style={{ width: '0%' }}
      />
    </div>
  );
}

export default App;
