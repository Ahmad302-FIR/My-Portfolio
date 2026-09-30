import { Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon, WhatsAppIcon } from '../common/SocialIcons';
import { contactConfig } from '../../data/contact';

export default function Footer() {
  const year = new Date().getFullYear();

  const socials = [
    { href: contactConfig.github, Icon: GithubIcon, label: 'GitHub' },
    { href: contactConfig.linkedin, Icon: LinkedinIcon, label: 'LinkedIn' },
    { href: contactConfig.whatsappUrl, Icon: WhatsAppIcon, label: 'WhatsApp' },
    { href: `mailto:${contactConfig.email}`, Icon: Mail, label: 'Email' },
  ] as const;

  return (
    <footer className="relative z-10 border-t border-slate-700/30 bg-[#07111F]">
      {/* Glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="text-slate-100 font-semibold text-base">{contactConfig.name}</span>
          <span className="text-slate-500 text-sm">{contactConfig.title}</span>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-3">
          {socials.map(({ href, Icon, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="flex items-center justify-center h-9 w-9 rounded-lg border border-slate-700/50 text-slate-400 hover:text-cyan-400 hover:border-cyan-400/40 transition-all duration-200"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-slate-600 text-xs">
          &copy; {year} {contactConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
