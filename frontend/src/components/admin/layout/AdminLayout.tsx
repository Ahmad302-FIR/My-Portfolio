import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

const routeTitleMap: Record<string, string> = {
  '/admin/dashboard': 'Dashboard Overview',
  '/admin/projects': 'Project Management',
  '/admin/projects/new': 'Create New Project',
  '/admin/messages': 'Contact Inquiries',
  '/admin/settings': 'Portfolio & Profile Settings',
};

export default function AdminLayout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  // Find matching title (accounting for /admin/projects/edit/:id)
  let pageTitle = 'Admin Portal';
  if (location.pathname.startsWith('/admin/projects/edit/')) {
    pageTitle = 'Edit Project';
  } else if (routeTitleMap[location.pathname]) {
    pageTitle = routeTitleMap[location.pathname];
  }

  return (
    <div className="flex h-screen w-full bg-[#07111F] text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <AdminSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <AdminTopbar
          title={pageTitle}
          onOpenMobileMenu={() => setIsMobileOpen(true)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-8 bg-gradient-to-b from-[#07111F] to-[#0A1424]">
          <div className="mx-auto max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
