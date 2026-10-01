import { GithubIcon, LinkedinIcon, WhatsAppIcon, GmailIcon } from '../common/SocialIcons';
import { contactConfig } from '../../data/contact';
import { usePortfolioSettings } from '../../context/PortfolioContext';

export default function Footer() {
  const { settings } = usePortfolioSettings();
  const year = new Date().getFullYear();

  const nameVal = settings.name || contactConfig.name;
  const titleVal = settings.heroSubtitle || settings.heroRole || contactConfig.title;

  const socials = [
    {
      href: settings.github || contactConfig.github,
      Icon: GithubIcon,
      label: 'GitHub',
      brandClass: 'brand-icon-github',
      pillClass: 'bg-slate-200/90 hover:bg-slate-300 border-slate-300 dark:bg-slate-800/80 dark:hover:bg-slate-700/80 dark:border-slate-700/60 shadow-xs',
    },
    {
      href: settings.linkedin || contactConfig.linkedin,
      Icon: LinkedinIcon,
      label: 'LinkedIn',
      brandClass: 'brand-icon-linkedin',
      pillClass: 'bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border-[#0A66C2]/35 hover:border-[#0A66C2]/70 hover:shadow-[0_0_14px_rgba(10,102,194,0.35)]',
    },
    {
      href: settings.whatsappUrl || settings.whatsapp || contactConfig.whatsappUrl,
      Icon: WhatsAppIcon,
      label: 'WhatsApp',
      brandClass: 'brand-icon-whatsapp',
      pillClass: 'bg-[#25D366]/10 hover:bg-[#25D366]/20 border-[#25D366]/35 hover:border-[#25D366]/70 hover:shadow-[0_0_14px_rgba(37,211,102,0.35)]',
    },
    {
      href: `mailto:${settings.email || contactConfig.email}`,
      Icon: GmailIcon,
      label: 'Gmail',
      brandClass: 'brand-icon-gmail',
      pillClass: 'bg-[#EA4335]/10 hover:bg-[#EA4335]/20 border-[#EA4335]/35 hover:border-[#EA4335]/70 hover:shadow-[0_0_14px_rgba(234,67,53,0.35)]',
    },
  ];

  return (
    <footer className="relative z-10 border-t border-slate-200 dark:border-slate-800/80 bg-slate-100/90 dark:bg-[#07111F] transition-colors duration-200">
      {/* Glow line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-2/3 bg-gradient-to-r from-transparent via-cyan-500/35 dark:via-cyan-400/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Brand */}
        <div className="flex flex-col items-center sm:items-start gap-1">
          <span className="text-slate-900 dark:text-slate-100 font-semibold text-base">{nameVal}</span>
          <span className="text-slate-500 text-sm">{titleVal}</span>
        </div>

        {/* Social links */}
        <div className="flex items-center gap-3">
          {socials.map(({ href, Icon, label, brandClass, pillClass }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className={`flex items-center justify-center h-9 w-9 rounded-lg border transition-all duration-200 hover:scale-110 ${pillClass}`}
            >
              <span className={`${brandClass} flex items-center justify-center`}>
                <Icon size={16} />
              </span>
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-slate-500 text-xs">
          &copy; {year} {nameVal}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
