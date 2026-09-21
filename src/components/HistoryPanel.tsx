import { useEffect, useState } from 'react';
import { History, Trash2, ChevronRight, Calendar } from 'lucide-react';
import { supabase, type SavedAnalysis } from '@/lib/supabase';

interface HistoryPanelProps {
  refreshKey: number;
  onSelect: (analysis: SavedAnalysis) => void;
  activeId?: string;
}

export default function HistoryPanel({ refreshKey, onSelect, activeId }: HistoryPanelProps) {
  const [items, setItems] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('resume_analyses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);
      if (!cancelled) {
        setItems((data as SavedAnalysis[]) || []);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshKey]);

  const handleDelete = async (id: string) => {
    await supabase.from('resume_analyses').delete().eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading && items.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-slate-500">Loading history...</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <History className="w-8 h-8 text-slate-600 mx-auto mb-3" />
        <p className="text-sm text-slate-500">No analyses yet. Run your first analysis to see it here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelect(item)}
          className={`group rounded-xl border p-3 cursor-pointer transition-all ${
            activeId === item.id
              ? 'bg-cyan-500/10 border-cyan-500/40'
              : 'bg-slate-800/40 border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/60'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold tabular-nums ${
                item.overall_score >= 80 ? 'bg-emerald-500/15 text-emerald-400' :
                item.overall_score >= 60 ? 'bg-amber-500/15 text-amber-400' :
                item.overall_score >= 40 ? 'bg-orange-500/15 text-orange-400' :
                'bg-red-500/15 text-red-400'
              }`}>
                {item.overall_score}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-slate-300 truncate">
                  {item.resume_summary.slice(0, 50)}
                </p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }}
                className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
