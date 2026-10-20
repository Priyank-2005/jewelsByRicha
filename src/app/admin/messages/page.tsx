"use client";

import { useState } from "react";
import { Check, Mail, Trash2 } from "lucide-react";
import { useAdmin } from "@/context/AdminContext";
import { useToast } from "@/context/ToastContext";
import { api } from "@/lib/client/api";
import { useAdminList } from "@/lib/client/admin-list";
import { PageHeader } from "@/components/admin/ui";
import { Pager } from "@/components/admin/Pager";
import { cn, formatDate } from "@/lib/utils";

interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  handled: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const { refresh } = useAdmin();
  const { showToast } = useToast();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const list = useAdminList<Message, { subscribers: number }>("/api/admin/messages", "messages", { handled: unreadOnly ? "false" : undefined });

  const act = async (fn: () => Promise<unknown>, okMsg: string) => {
    try {
      await fn();
      showToast(okMsg);
      await list.reload();
      void refresh();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  return (
    <div>
      <PageHeader title="Messages" subtitle={`Contact-form messages · ${list.extra?.subscribers ?? 0} newsletter subscribers`} actions={
        <label className="flex cursor-pointer items-center gap-2 text-sm"><input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} className="accent-[#b8913a]" /> Unread only</label>
      } />
      <div className="a-card">
        {list.error && <p className="p-4 text-sm text-red-700">{list.error}</p>}
        {!list.loading && list.items.length === 0 && <p className="py-14 text-center text-sm text-muted">No messages{unreadOnly ? " waiting" : " yet"}.</p>}
        <ul className={cn("divide-y divide-line", list.loading && "opacity-60")}>
          {list.items.map((m) => (
            <li key={m.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{m.name} {!m.handled && <span className="ml-1 rounded-full bg-gold px-2 py-0.5 text-[10px] font-semibold text-ink">New</span>}</div>
                  <a href={`mailto:${m.email}`} className="flex items-center gap-1 text-sm text-gold-deep hover:underline"><Mail className="h-3.5 w-3.5" /> {m.email}</a>
                </div>
                <div className="text-xs text-muted">{formatDate(m.createdAt)}</div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-ink-soft">{m.message}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => act(() => api(`/api/admin/messages/${m.id}`, { method: "PUT", body: { handled: !m.handled } }), m.handled ? "Marked as new" : "Marked as handled")} className="a-btn-ghost !py-1.5"><Check className="h-3.5 w-3.5" /> {m.handled ? "Mark as new" : "Mark handled"}</button>
                <button onClick={() => { if (confirm("Delete this message?")) void act(() => api(`/api/admin/messages/${m.id}`, { method: "DELETE" }), "Message deleted"); }} className="a-btn-ghost !py-1.5 text-red-700"><Trash2 className="h-3.5 w-3.5" /> Delete</button>
              </div>
            </li>
          ))}
        </ul>
        <Pager page={list.page} pages={list.pages} total={list.total} onPage={list.setPage} />
      </div>
    </div>
  );
}
