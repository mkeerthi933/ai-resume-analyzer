import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface SavedAnalysis {
  id: string;
  resume_text: string;
  job_description: string;
  overall_score: number;
  keyword_score: number;
  ats_score: number;
  experience_score: number;
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: { type: string; title: string; description: string }[];
  ats_issues: { severity: string; message: string }[];
  resume_summary: string;
  created_at: string;
}
