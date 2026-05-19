import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './sections/Hero.jsx';
import { Features } from './sections/Features.jsx';
import { CTA } from './sections/CTA.jsx';
import { Footer } from './sections/Footer.jsx';
import { FloatingParticles } from './components/FloatingParticles.jsx';
import { FloatingAvatar } from './components/FloatingAvatar.jsx';
import { Loader } from './components/Loader.jsx';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background — Glixy cream/peach to match main site */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-hero-glow"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-soft-grid bg-[size:42px_42px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_30%,#000_50%,transparent_100%)] opacity-60"
      />
      <FloatingParticles count={28} />

      <Navbar />
      <FloatingAvatar />

      <main className="relative z-10">
        <Hero />
        <Features />
        <CTA />
        <Footer />
      </main>

      <Loader visible={loading} />
    </div>
  );
}
