import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Download, Sun, Moon } from 'lucide-react';
import { navLinks } from '../../data/portfolioData';
import { contactConfig } from '../../data/contact';
import { useScrollY, useActiveSection } from '../../hooks';
import { usePortfolioSettings } from '../../context/PortfolioContext';
import { useTheme } from '../../context/ThemeContext';

const sectionIds = navLinks.map((l) => l.href.replace('#', ''));

export default function Navbar() {
  const { settings } = usePortfolioSettings();
  const { theme, toggleTheme } = useTheme();
  const resumeUrl = settings.resumeUrl || contactConfig.resumePath;
  const [menuOpen, setMenuOpen] = useState(false);
  const scrollY = useScrollY();
  const activeSection = useActiveSection(sectionIds);
  const scrolled = scrollY > 20;

  // Close menu on resize
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMenuOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 dark:bg-[#07111F]/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/30 shadow-xs dark:shadow-lg dark:shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <nav className="mx-auto max-w-7xl px-5 sm:px-8 h-16 flex items-center justify-between" aria-label="Main navigation">
          {/* Logo / Profile Picture */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
            className="flex items-center gap-2.5 group"
            aria-label="Muhammad Ahmed — Home"
          >
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 via-teal-400 to-violet-500 shadow-xs group-hover:scale-105 group-hover:shadow-[0_0_12px_rgba(34,211,238,0.4)] transition-all duration-300 flex-shrink-0">
              <div className="w-full h-full rounded-full overflow-hidden bg-slate-800">
                <img
                  src={settings.profileImageUrl || '/profile.jpg'}
                  alt={settings.name || 'Muhammad Ahmed'}
                  className="w-full h-full object-cover object-[50%_15%] select-none scale-105"
                  loading="eager"
                  draggable={false}
                />
              </div>
            </div>
            <span className="hidden sm:block text-slate-900 dark:text-slate-100 font-semibold text-sm tracking-wide group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
              {settings.name || 'Muhammad Ahmed'}
            </span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href.replace('#', '');
              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                    className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'text-cyan-600 dark:text-cyan-400 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
                    }`}
                  >
                    <span className="relative z-10">{link.label}</span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-indicator"
                        className="nav-indicator-pill absolute inset-0 rounded-lg bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/30 dark:border-cyan-400/30 z-0"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* CTA & Theme Toggle */}
          <div className="hidden md:flex items-center gap-3">
            {/* Theme Toggle Button */}
            <motion.button
              type="button"
              onClick={toggleTheme}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="relative flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700/60 bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-cyan-400/50 transition-all duration-200 cursor-pointer shadow-xs"
            >
              {theme === 'dark' ? (
                <Sun size={17} className="text-amber-400 hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon size={17} className="text-violet-600 hover:-rotate-12 transition-transform duration-300" />
              )}
            </motion.button>

            <motion.a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-cyan-500/10 dark:bg-cyan-400/10 border border-cyan-500/30 dark:border-cyan-400/30 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 dark:hover:bg-cyan-400/20 hover:border-cyan-400/60 transition-all duration-200"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Download size={14} />
              Resume
            </motion.a>
          </div>

          {/* Mobile hamburger + theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300"
            >
              {theme === 'dark' ? <Sun size={17} className="text-amber-400" /> : <Moon size={17} className="text-violet-600" />}
            </button>
            <button
              className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-200 dark:border-slate-700/50 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-400 dark:hover:border-slate-600 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-x-0 top-16 z-40 bg-white/95 dark:bg-[#0D1828]/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700/30 md:hidden shadow-xl"
          >
            <ul className="flex flex-col p-4 gap-1" role="list">
              {navLinks.map((link) => {
                const isActive = activeSection === link.href.replace('#', '');
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                      className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'text-cyan-600 dark:text-cyan-400 bg-cyan-500/15 dark:bg-cyan-400/10 font-semibold'
                          : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                      }`}
                    >
                      {link.label}
                    </a>
                  </li>
                );
              })}
              <li className="mt-2 pt-2 border-t border-slate-700/40">
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-lg bg-cyan-400/10 text-cyan-400 border border-cyan-400/20"
                >
                  <Download size={14} />
                  View Resume
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
