import { Check, X, AlertTriangle, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import type { AnalysisResult } from '@/lib/analyzer';
import ScoreGauge from './ScoreGauge';

interface AnalysisResultsProps {
  result: AnalysisResult;
}

export default function AnalysisResults({ result }: AnalysisResultsProps) {
  const scoreColor = (s: number) => {
    if (s >= 80) return 'text-emerald-400';
    if (s >= 60) return 'text-amber-400';
    if (s >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const scoreLabel = (s: number) => {
    if (s >= 85) return 'Excellent Match';
    if (s >= 70) return 'Good Match';
    if (s >= 55) return 'Fair Match';
    if (s >= 40) return 'Below Average';
    return 'Needs Work';
  };

  const suggestionStyles = {
    critical: { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' },
    improvement: { icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' },
    tip: { icon: Lightbulb, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  };

  return (
    <div className="space-y-6">
      {/* Overall Score Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700/50 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <ScoreGauge score={result.overallScore} label="Overall Match" size="lg" />
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-2">
              <h3 className={`text-2xl font-bold ${scoreColor(result.overallScore)}`}>
                {scoreLabel(result.overallScore)}
              </h3>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              {result.resumeSummary}
            </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-3 text-center">
                <p className="text-2xl font-bold tabular-nums text-slate-200">{result.keywordScore}</p>
                <p className="text-xs text-slate-500 mt-0.5">Keyword</p>
              </div>
              <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-3 text-center">
                <p className="text-2xl font-bold tabular-nums text-slate-200">{result.atsScore}</p>
                <p className="text-xs text-slate-500 mt-0.5">ATS</p>
              </div>
              <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-3 text-center">
                <p className="text-2xl font-bold tabular-nums text-slate-200">{result.experienceScore}</p>
                <p className="text-xs text-slate-500 mt-0.5">Experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-400 mb-4">
            <Check className="w-4 h-4" />
            Matched Keywords ({result.matchedKeywords.length})
          </h4>
          {result.matchedKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.matchedKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">No keywords matched. Try tailoring your resume to the job description.</p>
          )}
        </div>

        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-red-400 mb-4">
            <X className="w-4 h-4" />
            Missing Keywords ({result.missingKeywords.length})
          </h4>
          {result.missingKeywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {result.missingKeywords.map((kw, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-medium"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">All key keywords are present in your resume.</p>
          )}
        </div>
      </div>

      {/* ATS Issues */}
      {result.atsIssues.length > 0 && (
        <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6">
          <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            ATS Compatibility Check ({result.atsIssues.length} issues)
          </h4>
          <div className="space-y-2">
            {result.atsIssues.map((issue, i) => (
              <div
                key={i}
                className={`flex items-start gap-3 rounded-xl p-3 ${
                  issue.severity === 'error'
                    ? 'bg-red-500/5 border border-red-500/20'
                    : 'bg-amber-500/5 border border-amber-500/20'
                }`}
              >
                {issue.severity === 'error' ? (
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                )}
                <p className="text-sm text-slate-300">{issue.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      <div className="rounded-2xl bg-slate-800/50 border border-slate-700/50 p-6">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
          <Lightbulb className="w-4 h-4 text-cyan-400" />
          Suggestions to Improve ({result.suggestions.length})
        </h4>
        <div className="space-y-3">
          {result.suggestions.map((s, i) => {
            const style = suggestionStyles[s.type];
            const Icon = style.icon;
            return (
              <div
                key={i}
                className={`rounded-xl p-4 ${style.bg} border ${style.border}`}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`w-5 h-5 ${style.color} mt-0.5 flex-shrink-0`} />
                  <div>
                    <h5 className={`text-sm font-semibold ${style.color} mb-1`}>{s.title}</h5>
                    <p className="text-sm text-slate-400 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
