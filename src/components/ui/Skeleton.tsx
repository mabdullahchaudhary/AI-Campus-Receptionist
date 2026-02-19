export function Skeleton({ className = "" }: { className?: string }) {
    return <div className={`animate-pulse bg-gray-100 rounded-xl ${className}`} />;
}

export function CardSkeleton() {
    return (
        <div className="bg-white rounded-2xl border border-gray-200/60 p-5 space-y-3">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-32" />
        </div>
    );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200/60 overflow-hidden">
            {Array.from({ length: rows }).map((_, i) => (
                <div key={i} className="px-5 py-4 flex items-center gap-4 border-b border-gray-50 last:border-0">
                    <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-6 w-16 rounded-lg" />
                </div>
            ))}
        </div>
    );
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
                <h2 className="text-xl font-heading font-bold">{title}</h2>
                {subtitle && <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>}
            </div>
            {action}
        </div>
    );
}

export function EmptyState({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
    return (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 sm:p-16 text-center">
            <Icon className="w-12 h-12 text-gray-200 mx-auto mb-4" />
            <p className="font-heading font-bold text-base">{title}</p>
            <p className="text-sm text-muted-foreground mt-1.5 max-w-md mx-auto">{subtitle}</p>
        </div>
    );
}

export function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "success" | "warning" | "error" | "pro" | "purple" }) {
    const styles = {
        default: "bg-gray-100 text-gray-600",
        success: "bg-emerald-50 text-emerald-700",
        warning: "bg-amber-50 text-amber-700",
        error: "bg-red-50 text-red-600",
        pro: "bg-violet-100 text-violet-700",
        purple: "bg-purple-50 text-purple-700",
    };
    return <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${styles[variant]}`}>{children}</span>;
}