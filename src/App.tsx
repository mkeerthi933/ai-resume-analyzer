import { useState, useCallback } from 'react';
import {
  ScanLine, Zap, Target, FileCheck, ArrowRight, Sparkles,
  History, Loader2, RotateCcw, Github, Linkedin,
} from 'lucide-react';
import ResumeInput from '@/components/ResumeInput';
import AnalysisResults from '@/components/AnalysisResults';
import HistoryPanel from '@/components/HistoryPanel';
import { analyzeResume, type AnalysisResult } from '@/lib/analyzer';
import { supabase, type SavedAnalysis } from '@/lib/supabase';

type View = 'landing' | 'analyzer';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [activeId, setActiveId] = useState<string | undefined>(undefined);
  const [historyKey, setHistoryKey] = useState(0);
  const [showHistory, setShowHistory] = useState(false);

  const canAnalyze = resumeText.trim().length > 50 && jobDescription.trim().length > 50;

  const handleAnalyze = useCallback(async () => {
    if (!canAnalyze) return;
    setAnalyzing(true);
    setResult(null);
    setActiveId(undefined);

    // Simulate analysis processing for UX
    await new Promise((r) => setTimeout(r, 1200));

    const analysis = analyzeResume(resumeText, jobDescription);
    setResult(analysis);

    // Save to database
    const { data } = await supabase
      .from('resume_analyses')
      .insert({
        resume_text: resumeText,
        job_description: jobDescription,
        overall_score: analysis.overallScore,
        keyword_score: analysis.keywordScore,
        ats_score: analysis.atsScore,
        experience_score: analysis.experienceScore,
        matched_keywords: analysis.matchedKeywords,
        missing_keywords: analysis.missingKeywords,
        suggestions: analysis.suggestions,
        ats_issues: analysis.atsIssues,
        resume_summary: analysis.resumeSummary,
      })
      .select()
      .single();

    if (data) {
      setActiveId((data as SavedAnalysis).id);
      setHistoryKey((k) => k + 1);
    }
    setAnalyzing(false);
  }, [resumeText, jobDescription, canAnalyze]);

  const handleSelectHistory = useCallback((item: SavedAnalysis) => {
    setResumeText(item.resume_text);
    setJobDescription(item.job_description);
    setResult({
      overallScore: item.overall_score,
      keywordScore: item.keyword_score,
      atsScore: item.ats_score,
      experienceScore: item.experience_score,
      matchedKeywords: item.matched_keywords,
      missingKeywords: item.missing_keywords,
      suggestions: item.suggestions as AnalysisResult['suggestions'],
      atsIssues: item.ats_issues as AnalysisResult['atsIssues'],
      resumeSummary: item.resume_summary,
    });
    setActiveId(item.id);
    setShowHistory(false);
  }, []);

  const handleReset = useCallback(() => {
    setResumeText('');
    setJobDescription('');
    setResult(null);
    setActiveId(undefined);
  }, []);

  // Landing Page
  if (view === 'landing') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-200 overflow-x-hidden">
        {/* Nav */}
        <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/70 border-b border-slate-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <ScanLine className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">ResumeLens</span>
            </div>
            <button
              onClick={() => setView('analyzer')}
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-sm font-semibold transition-colors"
            >
              Launch Analyzer
            </button>
          </div>
        </nav>

        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 sm:px-6">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-teal-500/5 rounded-full blur-[120px]" />
          </div>
          <div className="relative max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" />
              AI-Powered Resume Analysis
            </div>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">Make every resume</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
                impossible to reject
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              Paste your resume and a job description. Get an instant match score, keyword gap analysis,
              ATS compatibility check, and actionable suggestions to land more interviews.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => setView('analyzer')}
                className="group px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold flex items-center gap-2 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25"
              >
                Analyze My Resume
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <a
                href="#features"
                className="px-6 py-3.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-slate-300 font-semibold transition-colors"
              >
                See How It Works
              </a>
            </div>
          </div>
        </section>

        {/* Stats bar */}
        <section className="px-4 sm:px-6 pb-16">
          <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: '4', label: 'Score Dimensions' },
              { value: '200+', label: 'Skills Tracked' },
              { value: '12+', label: 'ATS Checks' },
              { value: 'Instant', label: 'Results' },
            ].map((stat) => (
              <div key={stat.label} className="text-center rounded-2xl bg-slate-900/50 border border-slate-800 py-5 px-3">
                <p className="text-2xl sm:text-3xl font-bold text-cyan-400 tabular-nums">{stat.value}</p>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="px-4 sm:px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              Everything you need to <span className="text-cyan-400">pass the bots</span>
            </h2>
            <p className="text-center text-slate-400 mb-12 max-w-2xl mx-auto">
              Most resumes get rejected by ATS software before a human ever sees them.
              ResumeLens helps you beat the system and impress recruiters.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Target,
                  title: 'Keyword Match',
                  desc: 'See exactly which keywords from the job description are in your resume and which ones you\'re missing.',
                  color: 'text-cyan-400 bg-cyan-500/10',
                },
                {
                  icon: FileCheck,
                  title: 'ATS Compatibility',
                  desc: 'Detect formatting issues that trip up applicant tracking systems before your resume reaches a recruiter.',
                  color: 'text-amber-400 bg-amber-500/10',
                },
                {
                  icon: Zap,
                  title: 'Smart Suggestions',
                  desc: 'Get prioritized, actionable recommendations to improve your resume for each specific job.',
                  color: 'text-emerald-400 bg-emerald-500/10',
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl bg-slate-900/50 border border-slate-800 p-6 hover:border-slate-700 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="px-4 sm:px-6 py-20 bg-slate-900/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">How it works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Paste your resume', desc: 'Drop in your resume text or upload a .txt file.' },
                { step: '02', title: 'Add the job description', desc: 'Copy the job posting you want to apply for.' },
                { step: '03', title: 'Get your score', desc: 'Receive a detailed breakdown with suggestions in seconds.' },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 font-bold text-lg mb-4">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-400">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 py-20">
          <div className="max-w-3xl mx-auto text-center rounded-3xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-teal-500/10 border border-cyan-500/20 p-10 sm:p-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to improve your resume?</h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              It takes less than a minute. No sign-up required.
            </p>
            <button
              onClick={() => setView('analyzer')}
              className="px-8 py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-lg flex items-center gap-2 mx-auto transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-cyan-500/25"
            >
              Start Analyzing
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-800/50 px-4 sm:px-6 py-8">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                <ScanLine className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-sm">ResumeLens</span>
            </div>
            <div className="flex items-center gap-4">
              <Github className="w-5 h-5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-slate-500 hover:text-slate-300 cursor-pointer transition-colors" />
            </div>
            <p className="text-xs text-slate-600">Built for job seekers everywhere.</p>
          </div>
        </footer>
      </div>
    );
  }

  // Analyzer View
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      {/* Nav */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => setView('landing')} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight hidden sm:block">ResumeLens</span>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory((s) => !s)}
              className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
                showHistory
                  ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 flex items-center gap-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Main content */}
          <div className="min-w-0">
            {!result && !analyzing && (
              <>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-1">Analyze Your Resume</h2>
                  <p className="text-sm text-slate-400">
                    Paste your resume and the job description below, then hit analyze.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5 flex flex-col">
                    <ResumeInput
                      value={resumeText}
                      onChange={setResumeText}
                      label="Your Resume"
                      placeholder="Paste your full resume text here, or upload a .txt file above..."
                      acceptFiles
                    />
                  </div>
                  <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5 flex flex-col">
                    <ResumeInput
                      value={jobDescription}
                      onChange={setJobDescription}
                      label="Job Description"
                      placeholder="Paste the job description you're applying for here..."
                    />
                  </div>
                </div>
                <button
                  onClick={handleAnalyze}
                  disabled={!canAnalyze}
                  className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 disabled:cursor-not-allowed font-semibold text-lg flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-cyan-500/25 disabled:hover:shadow-none"
                >
                  <Zap className="w-5 h-5" />
                  Analyze Resume
                </button>
                {!canAnalyze && (resumeText || jobDescription) && (
                  <p className="text-center text-xs text-slate-500 mt-3">
                    Enter at least 50 characters in both fields to analyze.
                  </p>
                )}
              </>
            )}

            {analyzing && (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-slate-800" />
                  <Loader2 className="w-20 h-20 text-cyan-400 animate-spin absolute inset-0" />
                </div>
                <p className="mt-6 text-lg font-semibold text-slate-300">Analyzing your resume...</p>
                <p className="mt-1 text-sm text-slate-500">Checking keywords, ATS compatibility, and experience match</p>
              </div>
            )}

            {result && !analyzing && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Analysis Results</h2>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    New Analysis
                  </button>
                </div>
                <AnalysisResults result={result} />
              </div>
            )}
          </div>

          {/* History sidebar */}
          {showHistory && (
            <div className="lg:sticky lg:top-20 lg:self-start">
              <div className="rounded-2xl bg-slate-900/50 border border-slate-800 p-5">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-300 mb-4">
                  <History className="w-4 h-4 text-cyan-400" />
                  Recent Analyses
                </h3>
                <HistoryPanel
                  refreshKey={historyKey}
                  onSelect={handleSelectHistory}
                  activeId={activeId}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
