import { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar.jsx';
import { Hero } from './sections/Hero.jsx';
import { Features } from './sections/Features.jsx';
import { Workflows } from './sections/Workflows.jsx';
import { Setup } from './sections/Setup.jsx';
import { Download } from './sections/Download.jsx';
import { Docs } from './sections/Docs.jsx';
import { CTA } from './sections/CTA.jsx';
import { Footer } from './sections/Footer.jsx';
import { FloatingParticles } from './components/FloatingParticles.jsx';
import { Loader } from './components/Loader.jsx';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-bg text-ink-100">
      {/* Background layers */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-30 dot-bg [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_50%,transparent_100%)] opacity-70"
      />
      <FloatingParticles count={26} />

      <Navbar />

      <main className="relative z-10">
        <Hero />
        <Features />
        <Workflows />
        <Setup />
        <Download />
        <Docs />
        <CTA />
        <Footer />
      </main>

      <Loader visible={loading} />
    </div>
  );
}
