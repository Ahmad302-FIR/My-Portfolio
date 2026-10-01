import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import BackgroundEffects from '../../components/common/BackgroundEffects';
import MouseSpotlight from '../../components/common/MouseSpotlight';
import Hero from '../../components/home/Hero';
import About from '../../components/home/About';
import Skills from '../../components/home/Skills';
import Projects from '../../components/projects/Projects';
import Backend from '../../components/home/Backend';
import Experience from '../../components/home/Experience';
import Workflow from '../../components/home/Workflow';
import Contact from '../../components/home/Contact';
import ScrollToTop from '../../components/common/ScrollToTop';

export default function PublicPortfolio() {
  return (
    <div className="relative min-h-screen bg-[#07111F] text-slate-50 font-sans overflow-x-hidden">
      <BackgroundEffects />
      <MouseSpotlight />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Backend />
        <Experience />
        <Workflow />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}
