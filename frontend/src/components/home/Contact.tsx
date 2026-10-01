import { MapPin, Send, CheckCircle } from 'lucide-react';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { GithubIcon, LinkedinIcon, WhatsAppIcon, GmailIcon } from '../common/SocialIcons';
import SectionWrapper from '../common/SectionWrapper';
import SectionHeading from '../common/SectionHeading';
import TiltCard from '../common/TiltCard';
import { fadeUpVariants } from '../../utils/animations';
import { contactConfig } from '../../data/contact';
import { messageService } from '../../services/messageService';
import { usePortfolioSettings } from '../../context/PortfolioContext';

type Fields = { name: string; email: string; whatsappNumber: string; subject: string; message: string };

export default function Contact() {
  const { settings } = usePortfolioSettings();
  const formRef = useRef<HTMLFormElement>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const emailVal = settings.email || contactConfig.email;
  const linkedinVal = settings.linkedin || contactConfig.linkedin;
  const linkedinDisplay = settings.linkedinDisplay || settings.name || contactConfig.linkedinDisplay;
  const githubVal = settings.github || contactConfig.github;
  const githubUser = settings.githubUsername || contactConfig.githubUsername;
  const whatsappUrlVal = settings.whatsappUrl || settings.whatsapp || contactConfig.whatsappUrl;
  const phoneVal = settings.phone || contactConfig.phone;
  const locationVal = settings.locationDetail || settings.location || contactConfig.location;

  const contactInfo = [
    {
      Icon: GmailIcon,
      label: 'Email',
      value: emailVal,
      href: `mailto:${emailVal}`,
      brandClass: 'brand-icon-gmail',
      bgClass: 'bg-[#EA4335]/10 border-[#EA4335]/30',
    },
    {
      Icon: LinkedinIcon,
      label: 'LinkedIn',
      value: linkedinDisplay,
      href: linkedinVal,
      brandClass: 'brand-icon-linkedin',
      bgClass: 'bg-[#0A66C2]/10 border-[#0A66C2]/30',
    },
    {
      Icon: GithubIcon,
      label: 'GitHub',
      value: githubUser,
      href: githubVal,
      brandClass: 'brand-icon-github',
      bgClass: 'bg-slate-200/90 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700/60',
    },
    {
      Icon: WhatsAppIcon,
      label: 'WhatsApp',
      value: phoneVal,
      href: whatsappUrlVal,
      brandClass: 'brand-icon-whatsapp',
      bgClass: 'bg-[#25D366]/10 border-[#25D366]/30',
    },
    {
      Icon: MapPin,
      label: 'Location',
      value: locationVal,
      href: null,
      brandClass: 'text-teal-600 dark:text-teal-400',
      bgClass: 'bg-teal-500/10 border-teal-500/30',
    },
  ];
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [fields, setFields] = useState<Fields>({ name: '', email: '', whatsappNumber: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<Fields>>({});

  const validate = (): Partial<Fields> => {
    const e: Partial<Fields> = {};
    if (!fields.name.trim()) e.name = 'Name is required';
    if (!fields.email.trim() || !/\S+@\S+\.\S+/.test(fields.email)) e.email = 'Valid email required';

    const rawPhone = fields.whatsappNumber.trim();
    const cleanDigits = rawPhone.replace(/[\s\-()]/g, '');
    if (!rawPhone) {
      e.whatsappNumber = 'WhatsApp number is required';
    } else if (!/^[+]?[0-9\s\-()]{7,25}$/.test(rawPhone) || cleanDigits.length < 7 || cleanDigits.length > 20) {
      e.whatsappNumber = 'Please enter a valid WhatsApp number (e.g. +92 329 5664981)';
    }

    if (!fields.subject.trim()) e.subject = 'Subject is required';
    if (!fields.message.trim() || fields.message.length < 10) e.message = 'Message must be at least 10 characters';
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      await messageService.createMessage({
        ...fields,
        website: honeypot,
      });
      setSent(true);
      setFields({ name: '', email: '', whatsappNumber: '', subject: '', message: '' });
      setErrors({});
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field: keyof Fields) =>
    `w-full px-4 py-3 rounded-xl bg-[#101D30] border text-slate-200 text-sm placeholder:text-slate-600 focus:outline-none transition-all duration-200 ${
      errors[field]
        ? 'border-rose-500/50 focus:border-rose-500 focus:ring-rose-500/20'
        : 'border-slate-700/50 focus:border-cyan-400/50 focus:ring-cyan-400/20'
    }`;

  return (
    <SectionWrapper id="contact" className="py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Contact"
          title="Let's Build Something Useful"
          description="I'm open to frontend, MERN stack, full-stack, remote, freelance, internship, and contract opportunities."
          align="center"
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Left: contact info */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 flex flex-col gap-5"
          >
            <TiltCard
              maxTilt={6}
              scale={1.01}
              glare={true}
              className="rounded-2xl border border-slate-700/40 bg-[#0D1828]/60 p-6 flex flex-col gap-4"
            >
              <h3 className="text-slate-200 font-semibold text-base">Get in Touch</h3>
              
              <div className="space-y-3.5">
                {contactInfo.map(({ Icon, label, value, href, brandClass, bgClass }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className={`h-9 w-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${bgClass}`}>
                      <span className={brandClass}>
                        <Icon size={16} />
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-slate-500 text-xs">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target={href.startsWith('mailto') ? undefined : '_blank'}
                          rel={href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                          className="text-slate-300 text-sm hover:text-cyan-400 transition-colors truncate block"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-slate-300 text-sm truncate">{value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat on WhatsApp Button */}
              <div className="pt-2 border-t border-slate-700/30">
                <a
                  href={contactConfig.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 text-xs font-semibold transition-all duration-200 w-full"
                >
                  <WhatsAppIcon size={15} />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </TiltCard>

            {/* Availability badge */}
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 p-4 flex items-start gap-3">
              <span className="h-2.5 w-2.5 rounded-full bg-green-400 animate-pulse flex-shrink-0 mt-1" />
              <div>
                <p className="text-green-400 text-sm font-medium">Available for Opportunities</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  {contactConfig.availability}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-3"
          >
            <div className="rounded-2xl border border-slate-700/40 bg-[#0D1828]/60 backdrop-blur-sm p-6 sm:p-8">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-4 py-10 text-center"
                >
                  <CheckCircle size={48} className="text-green-400" />
                  <h3 className="text-slate-100 font-bold text-lg">Message Sent!</h3>
                  <p className="text-slate-400 text-sm">Thank you for reaching out. I'll get back to you shortly.</p>
                  <button
                    onClick={() => setSent(false)}
                    className="mt-2 text-xs text-cyan-400 hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
                  {/* Honeypot field for spam bots */}
                  <div style={{ display: 'none', opacity: 0, position: 'absolute', left: '-9999px' }} aria-hidden="true">
                    <input
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-400">
                      {submitError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-xs font-medium text-slate-400 mb-1.5">
                        Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        value={fields.name}
                        onChange={(e) => { setFields({ ...fields, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                        className={inputClass('name')}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      {errors.name && <p id="name-error" className="mt-1 text-xs text-rose-400">{errors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-xs font-medium text-slate-400 mb-1.5">
                        Email <span className="text-rose-400">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={fields.email}
                        onChange={(e) => { setFields({ ...fields, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                        className={inputClass('email')}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      {errors.email && <p id="email-error" className="mt-1 text-xs text-rose-400">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="whatsappNumber" className="block text-xs font-medium text-slate-400 mb-1.5">
                      WhatsApp Number <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="whatsappNumber"
                      type="tel"
                      placeholder="+92 3XX XXXXXXX"
                      value={fields.whatsappNumber}
                      onChange={(e) => {
                        setFields({ ...fields, whatsappNumber: e.target.value });
                        setErrors({ ...errors, whatsappNumber: '' });
                      }}
                      className={inputClass('whatsappNumber')}
                      aria-invalid={!!errors.whatsappNumber}
                      aria-describedby={errors.whatsappNumber ? 'whatsapp-error' : 'whatsapp-helper'}
                    />
                    <p id="whatsapp-helper" className="mt-1 text-[11px] text-slate-500">
                      Include country code, e.g. +92 329 5664981
                    </p>
                    {errors.whatsappNumber && (
                      <p id="whatsapp-error" className="mt-1 text-xs text-rose-400">
                        {errors.whatsappNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-xs font-medium text-slate-400 mb-1.5">
                      Subject <span className="text-rose-400">*</span>
                    </label>
                    <input
                      id="subject"
                      type="text"
                      placeholder="Project inquiry, collaboration..."
                      value={fields.subject}
                      onChange={(e) => { setFields({ ...fields, subject: e.target.value }); setErrors({ ...errors, subject: '' }); }}
                      className={inputClass('subject')}
                      aria-invalid={!!errors.subject}
                    />
                    {errors.subject && <p className="mt-1 text-xs text-rose-400">{errors.subject}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-xs font-medium text-slate-400 mb-1.5">
                      Message <span className="text-rose-400">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="Tell me about your project or opportunity..."
                      value={fields.message}
                      onChange={(e) => { setFields({ ...fields, message: e.target.value }); setErrors({ ...errors, message: '' }); }}
                      className={`${inputClass('message')} resize-none`}
                      aria-invalid={!!errors.message}
                    />
                    {errors.message && <p className="mt-1 text-xs text-rose-400">{errors.message}</p>}
                  </div>

                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: submitting ? 1 : 1.03, boxShadow: '0 0 24px rgba(34,211,238,0.25)' }}
                    whileTap={{ scale: submitting ? 1 : 0.97 }}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/20 transition-shadow duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send size={15} className={submitting ? 'animate-pulse' : ''} />
                    {submitting ? 'Sending Message...' : 'Send Message'}
                  </motion.button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}
