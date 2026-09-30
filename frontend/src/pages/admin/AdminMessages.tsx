import { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  Reply,
  Search,
  Filter,
  Calendar,
  Inbox,
} from 'lucide-react';
import { messageService } from '../../services/messageService';
import type { ContactMessage } from '../../types/message';
import ConfirmModal from '../../components/admin/common/ConfirmModal';
import Toast, { type ToastMessage } from '../../components/admin/common/Toast';
import { WhatsAppIcon } from '../../components/common/SocialIcons';

function normalizeWhatsAppNumber(raw: string): string {
  let cleaned = raw.replace(/[\s\-()+]/g, '');
  if (/^03\d{9}$/.test(cleaned)) {
    cleaned = '92' + cleaned.slice(1);
  }
  return cleaned;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Unread' | 'Read'>('All');
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const loadMessages = () => {
    setLoading(true);
    messageService
      .getMessages()
      .then((msgs) => {
        setMessages(msgs);
        if (msgs.length > 0) {
          setSelectedMessage(msgs[0]);
        } else {
          setSelectedMessage(null);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const q = searchQuery.toLowerCase().trim();
      const qDigits = q.replace(/[^0-9]/g, '');
      const phoneDigits = (m.whatsappNumber || '').replace(/[^0-9]/g, '');

      const matchesPhone = Boolean(
        (m.whatsappNumber && m.whatsappNumber.toLowerCase().includes(q)) ||
        (qDigits.length >= 3 && phoneDigits.includes(qDigits))
      );

      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        matchesPhone ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q);

      const matchesStatus =
        filterStatus === 'All'
          ? true
          : filterStatus === 'Unread'
          ? !m.isRead
          : m.isRead;

      return matchesSearch && matchesStatus;
    });
  }, [messages, searchQuery, filterStatus]);

  const handleSelectMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.isRead) {
      try {
        await messageService.markAsRead(msg._id, true);
        setMessages((prev) =>
          prev.map((item) => (item._id === msg._id ? { ...item, isRead: true } : item))
        );
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleToggleRead = async (msg: ContactMessage) => {
    try {
      const updated = await messageService.markAsRead(msg._id, !msg.isRead);
      setMessages((prev) =>
        prev.map((item) => (item._id === msg._id ? updated : item))
      );
      if (selectedMessage?._id === msg._id) {
        setSelectedMessage(updated);
      }
      setToast({
        id: String(Date.now()),
        type: 'info',
        message: `Marked message as ${updated.isRead ? 'read' : 'unread'}.`,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!messageToDelete) return;
    try {
      await messageService.deleteMessage(messageToDelete._id);
      const remaining = messages.filter((m) => m._id !== messageToDelete._id);
      setMessages(remaining);
      if (selectedMessage?._id === messageToDelete._id) {
        setSelectedMessage(remaining[0] || null);
      }
      setMessageToDelete(null);
      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'Message deleted successfully.',
      });
    } catch {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: 'Failed to delete message.',
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-100">Contact Inquiries</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review client project inquiries, freelance proposals, and partnership emails
          </p>
        </div>
      </div>

      {/* Filter and Search Bar (Only shown if messages exist or user searched) */}
      {messages.length > 0 && (
        <div className="p-4 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sender, email, subject, or message text..."
              className="w-full rounded-xl border border-slate-700/70 bg-[#101D30] pl-10 pr-4 py-2 text-xs text-slate-200 placeholder:text-slate-600 focus:border-cyan-400/50 focus:outline-none focus:ring-1 focus:ring-cyan-400/20"
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700/60 bg-[#101D30] text-xs">
            <Filter size={13} className="text-slate-500" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'All' | 'Unread' | 'Read')}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All" className="bg-[#101D30]">Status: All</option>
              <option value="Unread" className="bg-[#101D30]">Unread</option>
              <option value="Read" className="bg-[#101D30]">Read</option>
            </select>
          </div>
        </div>
      )}

      {/* Empty State when no messages exist */}
      {!loading && messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-12 sm:p-20 rounded-3xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md shadow-xl">
          <div className="h-16 w-16 rounded-2xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 flex items-center justify-center mb-4 shadow-lg shadow-cyan-400/10">
            <Inbox size={30} />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-100">
            No messages yet
          </h3>
          <p className="text-xs text-slate-400 mt-1.5 max-w-sm leading-relaxed">
            New inquiries submitted through your portfolio contact form will appear here.
          </p>
        </div>
      ) : (
        /* Split Pane: Message List (Left) + Detail Reader (Right) */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">
          {/* Messages List Column */}
          <div className="lg:col-span-5 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md overflow-hidden flex flex-col shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-[#101D30]/60 flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold text-slate-300">
                Inbox ({filteredMessages.length})
              </span>
              <span>
                {messages.filter((m) => !m.isRead).length} unread
              </span>
            </div>

            <div className="divide-y divide-slate-800/80 overflow-y-auto max-h-[560px]">
              {loading ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  Loading messages...
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="p-12 text-center text-xs text-slate-500">
                  No matching messages.
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isSelected = selectedMessage?._id === msg._id;
                  return (
                    <div
                      key={msg._id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`p-4 cursor-pointer transition-colors relative ${
                        isSelected
                          ? 'bg-cyan-400/10 border-l-2 border-cyan-400'
                          : 'hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 min-w-0">
                          {!msg.isRead && (
                            <span className="h-2 w-2 rounded-full bg-cyan-400 flex-shrink-0" />
                          )}
                          <span
                            className={`text-xs truncate ${
                              !msg.isRead ? 'font-bold text-slate-100' : 'font-medium text-slate-300'
                            }`}
                          >
                            {msg.name}
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono flex-shrink-0">
                          {new Date(msg.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
                        <span className="truncate">{msg.email}</span>
                        {msg.whatsappNumber && (
                          <>
                            <span className="text-slate-600">•</span>
                            <span className="text-emerald-400 flex items-center gap-1 truncate">
                              <WhatsAppIcon size={11} />
                              {msg.whatsappNumber}
                            </span>
                          </>
                        )}
                      </div>

                      <h4
                        className={`text-xs truncate ${
                          !msg.isRead ? 'font-semibold text-slate-200' : 'text-slate-400'
                        }`}
                      >
                        {msg.subject}
                      </h4>

                      <p className="text-[11px] text-slate-500 truncate mt-1">
                        {msg.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Message Detail Reader Column */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-700/60 bg-[#0D1828]/80 backdrop-blur-md p-6 flex flex-col justify-between shadow-xl">
            {selectedMessage ? (
              <div className="space-y-6">
                {/* Top Detail Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-5 border-b border-slate-800">
                  <div>
                    <h3 className="text-base font-bold text-slate-100">
                      {selectedMessage.subject}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">
                        {selectedMessage.name}
                      </span>
                      <span>&lt;{selectedMessage.email}&gt;</span>
                      <span className="text-slate-600">•</span>
                      <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300">
                        <WhatsAppIcon size={12} className="text-emerald-400" />
                        <span>
                          {selectedMessage.whatsappNumber ? (
                            <span className="font-medium text-emerald-400">
                              {selectedMessage.whatsappNumber}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">WhatsApp: Not provided</span>
                          )}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleRead(selectedMessage)}
                      className="p-2 rounded-xl border border-slate-700 bg-slate-800/40 text-slate-300 hover:text-cyan-400 transition-colors"
                      title={selectedMessage.isRead ? 'Mark as Unread' : 'Mark as Read'}
                    >
                      {selectedMessage.isRead ? <Mail size={15} /> : <MailOpen size={15} />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setMessageToDelete(selectedMessage)}
                      className="p-2 rounded-xl border border-slate-700 bg-slate-800/40 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Delete message"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Timestamp metadata */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <Calendar size={13} />
                  <span>
                    Received on{' '}
                    {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                      dateStyle: 'full',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                {/* Full Message Body */}
                <div className="p-5 rounded-2xl border border-slate-800 bg-[#101D30]/60 text-slate-200 text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                  {selectedMessage.message}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-[11px] text-slate-500">
                    Status: {selectedMessage.isRead ? 'Read' : 'Unread'}
                  </span>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {selectedMessage.whatsappNumber ? (
                      <a
                        href={`https://wa.me/${normalizeWhatsAppNumber(selectedMessage.whatsappNumber)}?text=${encodeURIComponent(
                          `Hi ${selectedMessage.name}, thank you for contacting me through my portfolio regarding "${selectedMessage.subject}".`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs font-bold text-emerald-300 hover:bg-emerald-500/25 hover:border-emerald-500/60 shadow-lg shadow-emerald-500/10 transition-all"
                      >
                        <WhatsAppIcon size={14} className="text-emerald-400" />
                        <span>Reply via WhatsApp</span>
                      </a>
                    ) : null}

                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                        selectedMessage.subject
                      )}`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 text-xs font-bold text-[#07111F] shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/35 transition-all"
                    >
                      <Reply size={14} />
                      <span>Reply via Email</span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-500 text-xs">
                <Mail size={32} className="mb-2 text-slate-600" />
                <p>Select a message from the inbox to read details.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(messageToDelete)}
        title="Delete Message"
        message={`Delete inquiry message from "${messageToDelete?.name}"?`}
        confirmLabel="Delete Message"
        isDangerous
        onConfirm={handleDeleteConfirm}
        onCancel={() => setMessageToDelete(null)}
      />

      {/* Toast Alert */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
