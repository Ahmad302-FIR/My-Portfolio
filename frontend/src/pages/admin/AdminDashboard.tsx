import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FolderGit2,
  CheckCircle,
  Clock,
  Star,
  Plus,
  ExternalLink,
  Mail,
  ArrowRight,
  Activity,
  Calendar,
} from 'lucide-react';
import { projectService } from '../../services/projectService';
import { messageService } from '../../services/messageService';
import { activityService, type ActivityLogItem } from '../../services/activityService';
import type { Project } from '../../types/project';
import StatCard from '../../components/admin/common/StatCard';
import StatusBadge from '../../components/admin/common/StatusBadge';

export default function AdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [unreadMsgCount, setUnreadMsgCount] = useState(0);
  const [activities, setActivities] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      projectService.getProjects(),
      messageService.getMessages(),
      activityService.fetchActivities(),
    ])
      .then(([projs, msgs, acts]) => {
        setProjects(projs);
        setUnreadMsgCount(msgs.filter((m) => !m.isRead).length);
        setActivities(acts);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load dashboard metrics:', err);
        setLoading(false);
      });
  }, []);

  const totalProjects = projects.length;
  const liveProjects = projects.filter((p) => p.status === 'Live').length;
  const inDevProjects = projects.filter((p) => p.status === 'In Development').length;
  const featuredProjects = projects.filter((p) => p.featured).length;

  const recentProjects = projects.slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Top Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-3xl border border-slate-700/60 bg-gradient-to-r from-[#0D1828] via-[#101D30] to-[#0D1828] backdrop-blur-md shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100">
            Welcome back, Muhammad Ahmed
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic Project Management & Portfolio Operations Center
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-xs font-bold text-[#07111F] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all"
          >
            <Plus size={15} />
            <span>Add New Project</span>
          </Link>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-700/60 bg-slate-800/40 text-xs font-semibold text-slate-300 hover:text-slate-100 transition-colors"
          >
            <ExternalLink size={14} className="text-cyan-400" />
            <span className="hidden sm:inline">Live Site</span>
          </a>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Projects"
          value={loading ? '...' : totalProjects}
          subtext="Catalog items configured"
          icon={FolderGit2}
          color="#22D3EE"
          delay={0.05}
        />
        <StatCard
          label="Live Projects"
          value={loading ? '...' : liveProjects}
          subtext="Actively deployed on web"
          icon={CheckCircle}
          color="#10B981"
          delay={0.1}
        />
        <StatCard
          label="In Development"
          value={loading ? '...' : inDevProjects}
          subtext="Active sprints & milestones"
          icon={Clock}
          color="#F59E0B"
          delay={0.15}
        />
        <StatCard
          label="Featured Projects"
          value={loading ? '...' : featuredProjects}
          subtext="Highlighted on home showcase"
          icon={Star}
          color="#8B5CF6"
          delay={0.2}
        />
      </div>

      {/* Main Grid: Recent Projects + Quick Actions / Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Projects Table/Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md overflow-hidden shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FolderGit2 size={16} className="text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-100">
                  Recent Projects
                </h3>
              </div>
              <Link
                to="/admin/projects"
                className="text-xs font-semibold text-cyan-400 hover:underline inline-flex items-center gap-1"
              >
                View All ({totalProjects}) <ArrowRight size={13} />
              </Link>
            </div>

            {/* Project List */}
            <div className="divide-y divide-slate-800">
              {recentProjects.map((project) => (
                <div
                  key={project._id || project.id || project.slug}
                  className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors gap-4"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0 border"
                      style={{
                        backgroundColor: `${project.color || '#22D3EE'}15`,
                        borderColor: `${project.color || '#22D3EE'}40`,
                        color: project.color || '#22D3EE',
                      }}
                    >
                      {project.title[0]}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-slate-200 truncate">
                        {project.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 truncate">
                        {project.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <StatusBadge status={project.status} size="sm" />
                    <Link
                      to={`/admin/projects/edit/${project._id || project.slug}`}
                      className="px-2.5 py-1 text-[11px] font-medium rounded-lg border border-slate-700 bg-slate-800/60 text-slate-300 hover:text-slate-100 hover:border-slate-500 transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              to="/admin/projects/new"
              className="flex items-center gap-3 p-4 rounded-2xl border border-slate-700/60 bg-[#0D1828]/60 hover:bg-[#101D30] hover:border-cyan-400/40 transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">Add New Project</p>
                <p className="text-[11px] text-slate-500">
                  Deploy live links & descriptions
                </p>
              </div>
            </Link>

            <Link
              to="/admin/messages"
              className="flex items-center gap-3 p-4 rounded-2xl border border-slate-700/60 bg-[#0D1828]/60 hover:bg-[#101D30] hover:border-violet-400/40 transition-all group"
            >
              <div className="h-10 w-10 rounded-xl bg-violet-400/10 border border-violet-400/30 text-violet-400 flex items-center justify-center group-hover:scale-105 transition-transform relative">
                <Mail size={18} />
                {unreadMsgCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-cyan-400 ring-2 ring-[#0D1828]" />
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-200">
                  Inbox Inquiries ({unreadMsgCount})
                </p>
                <p className="text-[11px] text-slate-500">
                  Review contact form messages
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Right Column: Activity Feed (1 col) */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md p-5 shadow-xl">
            <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
              <Activity size={16} className="text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100">
                Recent Project Activity
              </h3>
            </div>

            {activities.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No recent activity.
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {activities.map((act) => (
                  <div key={act.id} className="flex items-start gap-3">
                    <span
                      className={`h-2 w-2 rounded-full mt-1.5 flex-shrink-0 ${
                        act.type === 'create'
                          ? 'bg-emerald-400'
                          : act.type === 'update'
                          ? 'bg-cyan-400'
                          : 'bg-rose-400'
                      }`}
                    />
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 leading-snug">
                        {act.title}
                      </p>
                      <p className="text-[11px] text-slate-400 leading-relaxed truncate">
                        {act.description}
                      </p>
                      <span className="text-[10px] text-slate-500 block pt-0.5 font-mono">
                        {new Date(act.timestamp).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar size={12} /> Sync Engine: Local / Dynamic
              </span>
              <span className="text-emerald-400 font-medium">Ready for API</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
