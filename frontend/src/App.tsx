import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import { ThemeProvider } from './context/ThemeContext';
import PublicPortfolio from './pages/public/PublicPortfolio';
import AdminLogin from './pages/admin/AdminLogin';
import ProtectedAdminRoute from './components/admin/layout/ProtectedAdminRoute';
import AdminLayout from './components/admin/layout/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminProjectForm from './pages/admin/AdminProjectForm';
import AdminMessages from './pages/admin/AdminMessages';
import AdminSettings from './pages/admin/AdminSettings';
import AdminHeroContent from './pages/admin/AdminHeroContent';
import AdminAboutContent from './pages/admin/AdminAboutContent';
import AdminSkills from './pages/admin/AdminSkills';
import AdminExperience from './pages/admin/AdminExperience';
import AdminSocialLinks from './pages/admin/AdminSocialLinks';
import AdminWorkflow from './pages/admin/AdminWorkflow';

export default function App() {
  return (
    <ThemeProvider>
      <PortfolioProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Portfolio Route */}
            <Route path="/" element={<PublicPortfolio />} />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Admin Routes */}
            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="projects" element={<AdminProjects />} />
                <Route path="projects/new" element={<AdminProjectForm />} />
                <Route path="projects/edit/:id" element={<AdminProjectForm />} />
                <Route path="messages" element={<AdminMessages />} />

                {/* CMS Content Management Routes */}
                <Route path="content/hero" element={<AdminHeroContent />} />
                <Route path="content/about" element={<AdminAboutContent />} />
                <Route path="content/skills" element={<AdminSkills />} />
                <Route path="content/experience" element={<AdminExperience />} />
                <Route path="content/social" element={<AdminSocialLinks />} />
                <Route path="content/workflow" element={<AdminWorkflow />} />

                {/* Settings Route */}
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>

            {/* Fallback to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PortfolioProvider>
    </ThemeProvider>
  );
}
