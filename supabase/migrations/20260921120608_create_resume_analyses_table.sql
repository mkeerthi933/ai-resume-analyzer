/*
# Create resume_analyses table (single-tenant, no auth)

1. New Tables
- `resume_analyses`
  - `id` (uuid, primary key)
  - `resume_text` (text, the resume content pasted by the user)
  - `job_description` (text, the target job description pasted by the user)
  - `overall_score` (integer, 0-100 overall match score)
  - `keyword_score` (integer, 0-100 keyword match score)
  - `ats_score` (integer, 0-100 ATS compatibility score)
  - `experience_score` (integer, 0-100 experience relevance score)
  - `matched_keywords` (jsonb, array of keywords found in resume)
  - `missing_keywords` (jsonb, array of keywords from JD not found in resume)
  - `suggestions` (jsonb, array of improvement suggestion objects)
  - `ats_issues` (jsonb, array of ATS compatibility issue objects)
  - `resume_summary` (text, short extracted summary of the resume)
  - `created_at` (timestamptz, default now)
2. Security
- Enable RLS on `resume_analyses`.
- Allow anon + authenticated CRUD because the app is intentionally public/shared (no sign-in).
*/

CREATE TABLE IF NOT EXISTS resume_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  resume_text text NOT NULL,
  job_description text NOT NULL,
  overall_score integer NOT NULL DEFAULT 0,
  keyword_score integer NOT NULL DEFAULT 0,
  ats_score integer NOT NULL DEFAULT 0,
  experience_score integer NOT NULL DEFAULT 0,
  matched_keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
  missing_keywords jsonb NOT NULL DEFAULT '[]'::jsonb,
  suggestions jsonb NOT NULL DEFAULT '[]'::jsonb,
  ats_issues jsonb NOT NULL DEFAULT '[]'::jsonb,
  resume_summary text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_resume_analyses" ON resume_analyses;
CREATE POLICY "anon_select_resume_analyses" ON resume_analyses FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_resume_analyses" ON resume_analyses;
CREATE POLICY "anon_insert_resume_analyses" ON resume_analyses FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_resume_analyses" ON resume_analyses;
CREATE POLICY "anon_update_resume_analyses" ON resume_analyses FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_resume_analyses" ON resume_analyses;
CREATE POLICY "anon_delete_resume_analyses" ON resume_analyses FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_resume_analyses_created_at ON resume_analyses (created_at DESC);
