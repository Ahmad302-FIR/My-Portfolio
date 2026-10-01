import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderGit2,
  Mail,
  Settings,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
  User,
  FileText,
  Code2,
  Briefcase,
  Share2,
  GitBranch,
} from 'lucide-react';
import { authService } from '../../../services/authService';
import { usePortfolio } from '../../../context/PortfolioContext';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const mainNavItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', path: '/admin/projects', icon: FolderGit2 },
  { label: 'Messages', path: '/admin/messages', icon: Mail },
];

const contentNavItems = [
  { label: 'Profile & Hero', path: '/admin/content/hero', icon: User },
  { label: 'About', path: '/admin/content/about', icon: FileText },
  { label: 'Skills', path: '/admin/content/skills', icon: Code2 },
  { label: 'Experience', path: '/admin/content/experience', icon: Briefcase },
  { label: 'Social Links', path: '/admin/content/social', icon: Share2 },
  { label: 'Workflow', path: '/admin/content/workflow', icon: GitBranch },
];

const settingsNavItems = [
  { label: 'Settings', path: '/admin/settings', icon: Settings },
];

export default function AdminSidebar({
  isCollapsed,
  onToggleCollapse,
  isMobileOpen,
  onCloseMobile,
}: AdminSidebarProps) {
  const navigate = useNavigate();
  const { settings } = usePortfolio();

  const handleLogout = async () => {
    await authService.logout();
    navigate('/admin/login');
  };

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4 overflow-hidden">
      {/* Brand Header */}
      <div className="flex-shrink-0 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-full p-[1.5px] bg-gradient-to-tr from-cyan-400 via-teal-400 to-violet-500 shadow-xs flex-shrink-0">
              <div className="h-full w-full rounded-full overflow-hidden bg-slate-900">
                <img
                  src={settings?.profileImageUrl || '/profile.jpg'}
                  alt={settings?.name || 'Muhammad Ahmed'}
                  className="h-full w-full object-cover object-top"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = '/profile.jpg';
                  }}
                />
              </div>
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight truncate max-w-[130px]">
                  {settings?.name || 'Muhammad Ahmed'}
                </span>
                <span className="text-[11px] text-cyan-600 dark:text-cyan-400/80 font-medium">
                  Portfolio CMS
                </span>
              </div>
            )}
          </div>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
            aria-label="Close navigation"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Navigation items - Scrollable Middle Area */}
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden py-3 space-y-4 pr-1">
        {/* Overview Group */}
        <div>
          {!isCollapsed && (
            <p className="px-3.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Overview
            </p>
          )}
          <nav className="space-y-1" aria-label="Overview Navigation">
            {mainNavItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-transparent'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
                title={isCollapsed ? label : undefined}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!isCollapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Content CMS Group */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50">
          {!isCollapsed && (
            <p className="px-3.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Content CMS
            </p>
          )}
          <nav className="space-y-1" aria-label="CMS Content Navigation">
            {contentNavItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-transparent'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
                title={isCollapsed ? label : undefined}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!isCollapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Configuration Group */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/50">
          {!isCollapsed && (
            <p className="px-3.5 pb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              System
            </p>
          )}
          <nav className="space-y-1" aria-label="System Navigation">
            {settingsNavItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/25 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 border border-transparent'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
                title={isCollapsed ? label : undefined}
              >
                <Icon size={17} className="flex-shrink-0" />
                {!isCollapsed && <span>{label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer / Exit Links */}
      <div className="flex-shrink-0 pt-3 border-t border-slate-200 dark:border-slate-800 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40 transition-colors ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
          title={isCollapsed ? 'View Portfolio' : undefined}
        >
          <ExternalLink size={16} className="flex-shrink-0 text-cyan-500 dark:text-cyan-400" />
          {!isCollapsed && <span>View Portfolio</span>}
        </a>

        <button
          type="button"
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors ${
            isCollapsed ? 'justify-center px-2' : ''
          }`}
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut size={16} className="flex-shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>

        {/* Desktop Collapse Toggle */}
        <button
          type="button"
          onClick={onToggleCollapse}
          className="hidden lg:flex w-full items-center justify-center py-1.5 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#0D1828] border-r border-slate-200 dark:border-slate-800 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Sticky Sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white/95 dark:bg-[#0D1828]/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800/80 transition-all duration-300 flex-shrink-0 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
