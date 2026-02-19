"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BookOpen,
    Plus,
    Search,
    Edit3,
    Trash2,
    Save,
    X,
    FileText,
    HelpCircle,
    Globe,
    FolderOpen,
    ToggleLeft,
    ToggleRight,
    Loader2,
    Check,
    AlertCircle,
} from "lucide-react";

interface KnowledgeEntry {
    id: string;
    title: string;
    content: string;
    content_type: string;
    category: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const categories = [
    { value: "all", label: "All", icon: FolderOpen },
    { value: "admissions", label: "Admissions", icon: FileText },
    { value: "fees", label: "Fees", icon: FileText },
    { value: "scholarships", label: "Scholarships", icon: FileText },
    { value: "departments", label: "Departments", icon: BookOpen },
    { value: "campus", label: "Campus", icon: Globe },
    { value: "contact", label: "Contact", icon: FileText },
    { value: "general", label: "General", icon: HelpCircle },
];

const contentTypes = [
    { value: "text", label: "Text / Info" },
    { value: "faq", label: "FAQ" },
    { value: "document", label: "Document" },
    { value: "url", label: "URL / Link" },
];

export default function KnowledgeBasePage() {
    const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ type: string; message: string } | null>(null);

    // Form state
    const [formTitle, setFormTitle] = useState("");
    const [formContent, setFormContent] = useState("");
    const [formCategory, setFormCategory] = useState("general");
    const [formContentType, setFormContentType] = useState("text");

    const showToast = (type: string, message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const fetchEntries = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (activeCategory !== "all") params.set("category", activeCategory);
            if (searchQuery) params.set("search", searchQuery);

            const res = await fetch(`/api/knowledge?${params.toString()}`);
            const data = await res.json();

            if (data.entries) {
                setEntries(data.entries);
            }
        } catch (error) {
            console.error("Failed to fetch:", error);
            showToast("error", "Failed to load knowledge base");
        }
        setLoading(false);
    }, [activeCategory, searchQuery]);

    useEffect(() => {
        fetchEntries();
    }, [fetchEntries]);

    const handleCreate = async () => {
        if (!formTitle.trim() || !formContent.trim()) {
            showToast("error", "Title and content are required");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/knowledge", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: formTitle,
                    content: formContent,
                    category: formCategory,
                    content_type: formContentType,
                }),
            });

            const data = await res.json();
            if (data.entry) {
                setEntries((prev) => [data.entry, ...prev]);
                resetForm();
                showToast("success", "Knowledge entry created successfully");
            } else {
                showToast("error", data.error || "Failed to create");
            }
        } catch (error) {
            showToast("error", "Failed to create entry");
        }
        setSaving(false);
    };

    const handleUpdate = async (id: string) => {
        setSaving(true);
        try {
            const res = await fetch("/api/knowledge", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    title: formTitle,
                    content: formContent,
                    category: formCategory,
                    content_type: formContentType,
                }),
            });

            const data = await res.json();
            if (data.entry) {
                setEntries((prev) =>
                    prev.map((e) => (e.id === id ? data.entry : e))
                );
                setEditingId(null);
                resetForm();
                showToast("success", "Entry updated successfully");
            }
        } catch (error) {
            showToast("error", "Failed to update entry");
        }
        setSaving(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this entry? The AI will no longer have this information.")) {
            return;
        }

        try {
            await fetch(`/api/knowledge?id=${id}`, { method: "DELETE" });
            setEntries((prev) => prev.filter((e) => e.id !== id));
            showToast("success", "Entry deleted");
        } catch (error) {
            showToast("error", "Failed to delete");
        }
    };

    const handleToggleActive = async (entry: KnowledgeEntry) => {
        try {
            const res = await fetch("/api/knowledge", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: entry.id, is_active: !entry.is_active }),
            });

            const data = await res.json();
            if (data.entry) {
                setEntries((prev) =>
                    prev.map((e) => (e.id === entry.id ? data.entry : e))
                );
                showToast("success", data.entry.is_active ? "Entry activated" : "Entry deactivated");
            }
        } catch (error) {
            showToast("error", "Failed to toggle");
        }
    };

    const startEdit = (entry: KnowledgeEntry) => {
        setEditingId(entry.id);
        setFormTitle(entry.title);
        setFormContent(entry.content);
        setFormCategory(entry.category);
        setFormContentType(entry.content_type);
        setShowNewForm(false);
    };

    const resetForm = () => {
        setFormTitle("");
        setFormContent("");
        setFormCategory("general");
        setFormContentType("text");
        setShowNewForm(false);
        setEditingId(null);
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Toast notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-20 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-xl ${toast.type === "success"
                            ? "bg-emerald-500/90 text-white"
                            : "bg-red-500/90 text-white"
                            }`}
                    >
                        {toast.type === "success" ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <AlertCircle className="w-4 h-4" />
                        )}
                        <span className="text-sm font-medium">{toast.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
            >
                <div>
                    <h1 className="text-3xl font-heading font-extrabold">
                        Knowledge Base
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Train your AI agent — add information it can use to answer callers.
                        {entries.length > 0 && (
                            <span className="text-violet-400 ml-1">
                                {entries.length} entries • {entries.filter((e) => e.is_active).length} active
                            </span>
                        )}
                    </p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                        resetForm();
                        setShowNewForm(true);
                    }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold text-sm hover:from-violet-500 hover:to-indigo-500 transition-all glow"
                >
                    <Plus className="w-4 h-4" />
                    Add Knowledge
                </motion.button>
            </motion.div>

            {/* Search + Category Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search knowledge base..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 rounded-xl glass bg-gray-50/50 border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-violet-500/50 transition-colors"
                    />
                </div>

                {/* Category pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {categories.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setActiveCategory(cat.value)}
                            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${activeCategory === cat.value
                                ? "bg-violet-500/20 text-violet-400 border border-violet-500/30"
                                : "bg-gray-50/50 text-muted-foreground hover:bg-gray-100/20 border border-transparent"
                                }`}
                        >
                            <cat.icon className="w-3.5 h-3.5" />
                            {cat.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* New Entry Form */}
            <AnimatePresence>
                {showNewForm && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-6 overflow-hidden"
                    >
                        <div className="p-6 rounded-2xl glass border border-violet-500/20">
                            <div className="flex items-center justify-between mb-5">
                                <h3 className="font-heading font-bold text-lg flex items-center gap-2">
                                    <Plus className="w-5 h-5 text-violet-400" />
                                    Add New Knowledge
                                </h3>
                                <button onClick={resetForm} className="text-muted-foreground hover:text-foreground">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-xs text-muted-foreground mb-1.5">Title</label>
                                    <input
                                        type="text"
                                        value={formTitle}
                                        onChange={(e) => setFormTitle(e.target.value)}
                                        placeholder="e.g. Admission Process"
                                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50/50 border border-border text-sm focus:outline-none focus:border-violet-500/50"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs text-muted-foreground mb-1.5">Category</label>
                                        <select
                                            value={formCategory}
                                            onChange={(e) => setFormCategory(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl bg-gray-50/50 border border-border text-sm focus:outline-none focus:border-violet-500/50 appearance-none"
                                        >
                                            {categories.filter((c) => c.value !== "all").map((cat) => (
                                                <option key={cat.value} value={cat.value} className="bg-gray-900">
                                                    {cat.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs text-muted-foreground mb-1.5">Type</label>
                                        <select
                                            value={formContentType}
                                            onChange={(e) => setFormContentType(e.target.value)}
                                            className="w-full px-3 py-2.5 rounded-xl bg-gray-50/50 border border-border text-sm focus:outline-none focus:border-violet-500/50 appearance-none"
                                        >
                                            {contentTypes.map((ct) => (
                                                <option key={ct.value} value={ct.value} className="bg-gray-900">
                                                    {ct.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xs text-muted-foreground mb-1.5">
                                    Content — This is what the AI agent will read and use to answer callers
                                </label>
                                <textarea
                                    value={formContent}
                                    onChange={(e) => setFormContent(e.target.value)}
                                    placeholder="Write detailed information here. The more detail you provide, the better the AI can answer questions about this topic..."
                                    rows={8}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50/50 border border-border text-sm focus:outline-none focus:border-violet-500/50 resize-y leading-relaxed"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={resetForm}
                                    className="px-5 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCreate}
                                    disabled={saving}
                                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold disabled:opacity-50"
                                >
                                    {saving ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    Save Entry
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Entries List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-violet-400 animate-spin" />
                </div>
            ) : entries.length === 0 ? (
                <div className="text-center py-20 rounded-2xl glass">
                    <BookOpen className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                    <h3 className="text-lg font-heading font-bold">No entries found</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                        Add knowledge to train your AI agent.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {entries.map((entry, i) => (
                        <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className={`rounded-2xl glass card-shine transition-all duration-300 ${!entry.is_active ? "opacity-50" : ""
                                }`}
                        >
                            {editingId === entry.id ? (
                                /* EDIT MODE */
                                <div className="p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            value={formTitle}
                                            onChange={(e) => setFormTitle(e.target.value)}
                                            className="px-4 py-2.5 rounded-xl bg-gray-50 border border-border text-sm focus:outline-none focus:border-violet-500/50"
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                            <select
                                                value={formCategory}
                                                onChange={(e) => setFormCategory(e.target.value)}
                                                className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-border text-sm focus:outline-none appearance-none"
                                            >
                                                {categories.filter((c) => c.value !== "all").map((cat) => (
                                                    <option key={cat.value} value={cat.value} className="bg-gray-900">
                                                        {cat.label}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                value={formContentType}
                                                onChange={(e) => setFormContentType(e.target.value)}
                                                className="px-3 py-2.5 rounded-xl bg-white/[0.03] border border-border text-sm focus:outline-none appearance-none"
                                            >
                                                {contentTypes.map((ct) => (
                                                    <option key={ct.value} value={ct.value} className="bg-gray-900">
                                                        {ct.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <textarea
                                        value={formContent}
                                        onChange={(e) => setFormContent(e.target.value)}
                                        rows={8}
                                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-border text-sm focus:outline-none focus:border-violet-500/50 resize-y mb-4 leading-relaxed"
                                    />
                                    <div className="flex justify-end gap-3">
                                        <button
                                            onClick={resetForm}
                                            className="px-4 py-2 rounded-xl text-sm text-muted-foreground hover:text-foreground"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(entry.id)}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-violet-600 text-white text-sm font-semibold disabled:opacity-50"
                                        >
                                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save Changes
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* VIEW MODE */
                                <div className="p-6">
                                    <div className="flex items-start justify-between gap-4 mb-3">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-heading font-bold text-base">{entry.title}</h3>
                                                <span className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-400 text-[10px] font-semibold uppercase tracking-wider">
                                                    {entry.category}
                                                </span>
                                                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-muted-foreground text-[10px] uppercase tracking-wider">
                                                    {entry.content_type}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            {/* Toggle active */}
                                            <button
                                                onClick={() => handleToggleActive(entry)}
                                                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                                                title={entry.is_active ? "Deactivate" : "Activate"}
                                            >
                                                {entry.is_active ? (
                                                    <ToggleRight className="w-5 h-5 text-emerald-400" />
                                                ) : (
                                                    <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                                                )}
                                            </button>
                                            {/* Edit */}
                                            <button
                                                onClick={() => startEdit(entry)}
                                                className="w-9 h-9 rounded-lg hover:bg-gray-100 flex items-center justify-center text-muted-foreground hover:text-violet-400 transition-colors"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                            {/* Delete */}
                                            <button
                                                onClick={() => handleDelete(entry.id)}
                                                className="w-9 h-9 rounded-lg hover:bg-red-500/10 flex items-center justify-center text-muted-foreground hover:text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Content preview */}
                                    <pre className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap font-sans max-h-40 overflow-y-auto">
                                        {entry.content.length > 500
                                            ? entry.content.substring(0, 500) + "..."
                                            : entry.content}
                                    </pre>

                                    <div className="mt-3 text-[10px] text-muted-foreground/40">
                                        Updated {new Date(entry.updated_at).toLocaleDateString()}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}