import { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import { messageService } from '../../../services/messageService';
import { Link } from 'react-router-dom';

interface AdminTopbarProps {
  title: string;
  onOpenMobileMenu: () => void;
}

export default function AdminTopbar({ title, onOpenMobileMenu }: AdminTopbarProps) {
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    messageService.getMessages().then((msgs) => {
      const unread = msgs.filter((m) => !m.isRead).length;
      setUnreadCount(unread);
    });
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-800/80 bg-[#07111F]/80 px-4 sm:px-8 backdrop-blur-xl">
      {/* Left: Mobile hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden text-slate-400 hover:text-slate-100 p-1.5 rounded-lg border border-slate-700/60 bg-slate-800/40"
          aria-label="Open sidebar menu"
        >
          <Menu size={18} />
        </button>

        <h1 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
          {title}
        </h1>
      </div>

      {/* Right Controls: Notifications & Profile */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Notifications Icon linking to /admin/messages */}
        <Link
          to="/admin/messages"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-700/60 bg-slate-800/40 text-slate-300 hover:text-cyan-400 hover:border-slate-600 transition-colors"
          title="Inquiry Messages"
        >
          <Bell size={16} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-400 text-[10px] font-bold text-[#07111F] ring-2 ring-[#07111F]">
              {unreadCount}
            </span>
          )}
        </Link>

        {/* Admin Profile Pill */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-slate-800">
          <div className="h-8 w-8 rounded-full overflow-hidden border border-cyan-400/40 bg-slate-800 flex-shrink-0">
            <img
              src="/profile.jpg"
              alt="Muhammad Ahmed"
              className="h-full w-full object-cover object-top"
              onError={(e) => {
                // If profile.jpg fails, display styled initials
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="hidden sm:flex flex-col">
            <span className="text-xs font-semibold text-slate-200 leading-tight">
              Muhammad Ahmed
            </span>
            <span className="text-[10px] text-cyan-400 font-medium">
              Portfolio Admin
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
