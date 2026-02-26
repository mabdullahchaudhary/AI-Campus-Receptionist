"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Plus, Search, Filter, Edit3, Trash2, ToggleLeft, ToggleRight, Save, X, Loader2, FileText, Tag } from "lucide-react";
import { KNOWLEDGE_CATEGORIES } from "@/lib/config";

interface KnowledgeEntry { id: string; title: string; content: string; content_type: string; category: string; is_active: boolean; created_at: string; }

export default function KnowledgePage() {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<KnowledgeEntry | null>(null);
  const [form, setForm] = useState({ title: "", content: "", category: "general", content_type: "text" });
  const [saving, setSaving] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (filterCat !== "all") params.set("category", filterCat);
    if (search) params.set("search", search);
    const res = await fetch(`/api/knowledge?${params}`);
    const data = await res.json();
    setEntries(data.entries || []);
    setLoading(false);
  };

  useEffect(() => { fetchEntries(); }, [filterCat]);

  const handleSearch = () => fetchEntries();

  const handleSave = async () => {
    setSaving(true);
    const method = editing ? "PUT" : "POST";
    const body = editing ? { ...form, id: editing.id } : form;
    await fetch("/api/knowledge", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", content: "", category: "general", content_type: "text" });
    fetchEntries();
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    await fetch(`/api/knowledge?id=${id}`, { method: "DELETE" });
    fetchEntries();
  };

  const handleToggle = async (entry: KnowledgeEntry) => {
    await fetch("/api/knowledge", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: entry.id, is_active: !entry.is_active }) });
    fetchEntries();
  };

  const startEdit = (entry: KnowledgeEntry) => {
    setEditing(entry);
    setForm({ title: entry.title, content: entry.content, category: entry.category, content_type: entry.content_type });
    setShowForm(true);
  };

  const categoryColors: Record<string, string> = {
    admissions: "bg-blue-50 text-blue-700", fees: "bg-emerald-50 text-emerald-700", scholarships: "bg-amber-50 text-amber-700",
    departments: "bg-purple-50 text-purple-700", campus: "bg-cyan-50 text-cyan-700", contact: "bg-rose-50 text-rose-700",
    hostel: "bg-orange-50 text-orange-700", transport: "bg-teal-50 text-teal-700", general: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-heading font-bold">Knowledge Base</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{entries.length} entries — AI learns from this data</p>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => { setEditing(null); setForm({ title: "", content: "", category: "general", content_type: "text" }); setShowForm(true); }} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold shadow-lg shadow-violet-500/20 shrink-0">
          <Plus className="w-4 h-4" />Add Entry
        </motion.button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Search knowledge base..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {["all", ...KNOWLEDGE_CATEGORIES].map((cat) => (
            <button key={cat} onClick={() => setFilterCat(cat)} className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${filterCat === cat ? "bg-violet-600 text-white shadow-sm" : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"}`}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-white rounded-2xl border-2 border-violet-200 p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading font-bold">{editing ? "Edit Entry" : "New Entry"}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-3">
              <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Title (e.g. Fee Structure)" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400" />
              <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Content — the information AI will use to answer questions..." rows={6} className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:border-violet-400 resize-none" />
              <div className="flex gap-3">
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm">
                  {KNOWLEDGE_CATEGORIES.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                </select>
                <select value={form.content_type} onChange={(e) => setForm({ ...form, content_type: e.target.value })} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm">
                  <option value="text">Text</option><option value="faq">FAQ</option><option value="document">Document</option><option value="url">URL</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} disabled={saving || !form.title || !form.content} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}{editing ? "Update" : "Save"}
                </button>
                <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-5 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground">Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 text-violet-500 animate-spin" /></div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center">
          <BookOpen className="w-14 h-14 text-gray-200 mx-auto mb-4" />
          <p className="font-heading font-bold text-lg">No entries yet</p>
          <p className="text-sm text-muted-foreground mt-2">Add knowledge entries so Riley can answer questions accurately</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry, i) => (
            <motion.div key={entry.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className={`bg-white rounded-2xl border shadow-card hover:shadow-card-hover transition-all ${entry.is_active ? "border-gray-200/60" : "border-gray-100 opacity-60"}`}>
              <div className="p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-4 h-4 text-violet-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-semibold">{entry.title}</h4>
                      <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-md ${categoryColors[entry.category] || categoryColors.general}`}>
                        {entry.category}
                      </span>
                      {!entry.is_active && <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded-md bg-red-50 text-red-600">Disabled</span>}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">{entry.content}</p>
                  </div>
                </div>
              </div>
              <div className="px-4 sm:px-5 py-2.5 border-t border-gray-100 bg-gray-50/50 rounded-b-2xl flex items-center gap-2 flex-wrap">
                <button onClick={() => handleToggle(entry)} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${entry.is_active ? "text-emerald-700 hover:bg-emerald-50" : "text-gray-400 hover:bg-gray-100"}`}>
                  {entry.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                  {entry.is_active ? "Active" : "Disabled"}
                </button>
                <button onClick={() => startEdit(entry)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-blue-600 hover:bg-blue-50 transition-colors">
                  <Edit3 className="w-3 h-3" />Edit
                </button>
                <button onClick={() => handleDelete(entry.id)} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors ml-auto">
                  <Trash2 className="w-3 h-3" />Delete
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}