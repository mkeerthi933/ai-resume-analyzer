export interface Suggestion {
  type: 'critical' | 'improvement' | 'tip';
  title: string;
  description: string;
}

export interface ATSIssue {
  severity: 'error' | 'warning';
  message: string;
}

export interface AnalysisResult {
  overallScore: number;
  keywordScore: number;
  atsScore: number;
  experienceScore: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: Suggestion[];
  atsIssues: ATSIssue[];
  resumeSummary: string;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'must', 'shall', 'can', 'need', 'this', 'that', 'these',
  'those', 'i', 'me', 'my', 'we', 'our', 'you', 'your', 'he', 'she', 'it',
  'its', 'they', 'them', 'their', 'what', 'which', 'who', 'whom', 'whose',
  'when', 'where', 'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more',
  'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'just', 'as', 'if', 'about', 'above', 'below',
  'over', 'under', 'again', 'further', 'once', 'here', 'there', 'any', 'also',
  'into', 'through', 'during', 'before', 'after', 'above', 'up', 'down',
  'out', 'off', 'above', 'below', 'between', 'among', 'across', 'behind',
  'beyond', 'within', 'without', 'along', 'around', 'near', 'upon',
  'role', 'work', 'working', 'looking', 'seeking', 'join', 'team', 'teams',
  'company', 'candidate', 'candidates', 'position', 'positions', 'job',
  'jobs', 'career', 'careers', 'opportunity', 'opportunities', 'responsibilities',
  'responsible', 'requirements', 'required', 'preferred', 'qualifications',
  'plus', 'etc', 'e.g', 'i.e', 'including', 'include', 'includes', 'excellent',
  'strong', 'ability', 'must', 'years', 'year', 'experience', 'skills',
  'skill', 'knowledge', 'understanding', 'familiarity', 'proficiency',
  'proficient', 'level', 'entry', 'mid', 'senior', 'junior', 'lead',
  'manager', 'director', 'head', 'chief', 'officer', 'vp', 'ceo', 'cto',
  'cfo', 'coo', 'department', 'division', 'group', 'unit', 'section',
  'reports', 'reporting', 'report', 'full', 'part', 'time', 'per', 'week',
  'month', 'day', 'hour', 'salary', 'compensation', 'benefits', 'offer',
  'based', 'location', 'remote', 'hybrid', 'onsite', 'office', 'flexible',
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'weekend',
]);

const SKILL_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust',
  'ruby', 'php', 'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'bash',
  'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'gatsby', 'remix',
  'node', 'express', 'django', 'flask', 'fastapi', 'spring', 'rails',
  'laravel', 'asp.net', '.net', 'graphql', 'rest', 'grpc', 'websocket',
  'html', 'css', 'scss', 'sass', 'tailwind', 'bootstrap', 'material-ui',
  'redux', 'mobx', 'zustand', 'recoil', 'xstate',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'cassandra', 'dynamodb',
  'elasticsearch', 'kafka', 'rabbitmq', 'sqlite', 'oracle', 'snowflake',
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'helm', 'terraform',
  'ansible', 'jenkins', 'gitlab', 'github', 'circleci', 'argocd',
  'ci/cd', 'devops', 'sre', 'microservices', 'serverless', 'lambda',
  'ec2', 's3', 'rds', 'cloudfront', 'route53', 'vpc', 'iam', 'eks', 'ecs',
  'fargate', 'appsync', 'dynamo', 'aurora',
  'git', 'svn', 'mercurial', 'jira', 'confluence', 'trello', 'asana',
  'agile', 'scrum', 'kanban', 'waterfall', 'safe', 'xp',
  'machine learning', 'deep learning', 'ai', 'ml', 'nlp', 'computer vision',
  'tensorflow', 'pytorch', 'keras', 'scikit-learn', 'pandas', 'numpy',
  'scipy', 'matplotlib', 'seaborn', 'tableau', 'power bi', 'looker',
  'spark', 'hadoop', 'hive', 'airflow', 'dbt', 'databricks', 'etl', 'elt',
  'data warehouse', 'data lake', 'big data', 'analytics', 'statistics',
  'a/b testing', 'experimentation', 'segmentation', 'clustering',
  'regression', 'classification', 'neural networks', 'transformers',
  'llm', 'gpt', 'bert', 'huggingface', 'openai', 'langchain',
  'leadership', 'communication', 'collaboration', 'problem-solving',
  'project management', 'product management', 'stakeholder', 'roadmap',
  'strategy', 'planning', 'execution', 'mentorship', 'mentoring',
  'code review', 'testing', 'tdd', 'bdd', 'unit testing', 'integration testing',
  'e2e testing', 'jest', 'mocha', 'cypress', 'playwright', 'selenium',
  'webdriver', 'puppeteer', 'storybook', 'chromatic',
  'webpack', 'vite', 'rollup', 'esbuild', 'babel', 'swc',
  'figma', 'sketch', 'adobe xd', 'photoshop', 'illustrator',
  'seo', 'sem', 'google analytics', 'gtm', 'marketing',
  'salesforce', 'hubspot', 'marketo', 'zendesk', 'intercom',
  'sap', 'oracle', 'netsuite', 'quickbooks',
  'compliance', 'gdpr', 'hipaa', 'soc2', 'iso27001', 'pci',
  'security', 'penetration testing', 'owasp', 'encryption', 'authentication',
  'oauth', 'saml', 'sso', 'mfa', 'zero trust',
  'fintech', 'healthcare', 'ecommerce', 'saas', 'b2b', 'b2c',
  'mobile', 'ios', 'android', 'react native', 'flutter', 'xcode',
  'game development', 'unity', 'unreal engine',
  'blockchain', 'solidity', 'ethereum', 'web3', 'smart contracts',
  'robotics', 'iot', 'embedded', 'arduino', 'raspberry pi',
  'automotive', 'aerospace', 'manufacturing',
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s+#./-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 1 && !STOP_WORDS.has(t));
}

function extractKeywords(text: string): { keywords: Map<string, number>; phrases: string[] } {
  const tokens = tokenize(text);
  const keywordMap = new Map<string, number>();

  // Match against known skill keywords (including multi-word)
  const lowerText = text.toLowerCase();
  for (const skill of SKILL_KEYWORDS) {
    const pattern = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      keywordMap.set(skill, matches.length);
    }
  }

  // Extract significant single words (non-stopwords, length > 3)
  for (const token of tokens) {
    if (token.length > 3 && !STOP_WORDS.has(token)) {
      keywordMap.set(token, (keywordMap.get(token) || 0) + 1);
    }
  }

  return { keywords: keywordMap, phrases: tokens };
}

function extractSections(text: string): string[] {
  const sectionHeaders = [
    'experience', 'education', 'skills', 'summary', 'objective',
    'projects', 'certifications', 'awards', 'publications', 'languages',
    'interests', 'references', 'contact', 'profile', 'achievements',
    'work history', 'employment', 'professional',
  ];
  const lines = text.split('\n').map((l) => l.trim().toLowerCase());
  const found: string[] = [];
  for (const line of lines) {
    for (const header of sectionHeaders) {
      if (line === header || line === header + ':' || line.startsWith(header + ' —')) {
        found.push(header);
      }
    }
  }
  return found;
}

function checkATSCompatibility(resumeText: string): ATSIssue[] {
  const issues: ATSIssue[] = [];
  const lower = resumeText.toLowerCase();

  // Check for common ATS-red flags
  if (/\|/.test(resumeText) && (resumeText.match(/\|/g) || []).length > 5) {
    issues.push({
      severity: 'warning',
      message: 'Heavy use of pipe characters (|) can confuse ATS parsers. Consider using bullet points instead.',
    });
  }

  if (/[\u2022\u25CF\u25AA\u25A0\u2023\u2043]/.test(resumeText)) {
    issues.push({
      severity: 'warning',
      message: 'Special bullet characters may not parse correctly in all ATS systems. Use standard bullets (- or •).',
    });
  }

  if (/\t/.test(resumeText)) {
    issues.push({
      severity: 'warning',
      message: 'Tab characters detected. ATS systems may misinterpret tab-aligned content. Use spaces for alignment.',
    });
  }

  if (resumeText.length < 300) {
    issues.push({
      severity: 'error',
      message: 'Resume content is very short. Most ATS systems expect at least 300+ characters of substantive content.',
    });
  }

  const sections = extractSections(resumeText);
  const essentialSections = ['experience', 'education', 'skills'];
  for (const section of essentialSections) {
    if (!sections.includes(section)) {
      issues.push({
        severity: 'warning',
        message: `Missing or unclear "${section}" section header. ATS systems rely on standard section names to parse your resume.`,
      });
    }
  }

  // Check for contact info
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /(\+?\d{1,2}[\s.-]?)?\(?\d{3}\)?[\s.-]?\d{3,4}[\s.-]?\d{4}/.test(resumeText);
  if (!hasEmail) {
    issues.push({
      severity: 'error',
      message: 'No email address detected. ATS systems use email to identify and route your application.',
    });
  }
  if (!hasPhone) {
    issues.push({
      severity: 'warning',
      message: 'No phone number detected. Including a phone number ensures recruiters can contact you.',
    });
  }

  // Check for tables/columns (common in PDF resumes)
  if (/\btable\b/i.test(resumeText) || (resumeText.match(/\s{5,}/g) || []).length > 10) {
    issues.push({
      severity: 'warning',
      message: 'Possible table or column layout detected. Multi-column layouts often get scrambled by ATS parsers.',
    });
  }

  // Check for images/graphics references
  if (/\[image\]|\[graphic\]|\[chart\]/i.test(resumeText)) {
    issues.push({
      severity: 'error',
      message: 'Image or graphic placeholders detected. ATS systems cannot read text embedded in images.',
    });
  }

  // Check for special formatting
  if (/https?:\/\//.test(resumeText) && (resumeText.match(/https?:\/\//g) || []).length > 5) {
    issues.push({
      severity: 'warning',
      message: 'Many hyperlinks detected. Excessive links can clutter parsed text in ATS systems.',
    });
  }

  // Check for dates
  const hasDates = /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|\b20[0-2]\d\b|\b19[89]\d\b)/i.test(resumeText);
  if (!hasDates) {
    issues.push({
      severity: 'warning',
      message: 'No dates detected. ATS systems and recruiters look for employment dates to build a timeline.',
    });
  }

  // Check for action verbs
  const actionVerbs = ['led', 'managed', 'developed', 'created', 'built', 'designed',
    'implemented', 'launched', 'improved', 'increased', 'reduced', 'optimized',
    'architected', 'delivered', 'achieved', 'drove', 'established', 'founded',
    'spearheaded', 'orchestrated', 'executed', 'streamlined', 'automated'];
  const hasActionVerbs = actionVerbs.some((v) => new RegExp(`\\b${v}\\b`, 'i').test(resumeText));
  if (!hasActionVerbs) {
    issues.push({
      severity: 'warning',
      message: 'Few action verbs detected. Start bullet points with strong action verbs (Led, Developed, Improved...).',
    });
  }

  // Check for quantified achievements
  const hasNumbers = /\$\d|\d+%|\d+x|\d+\s*(users|customers|clients|projects|people|team|engineers|developers|million|billion|k\b)/i.test(resumeText);
  if (!hasNumbers) {
    issues.push({
      severity: 'warning',
      message: 'No quantified achievements detected. Use numbers to show impact (e.g., "Increased revenue by 30%", "Managed 5 engineers").',
    });
  }

  return issues;
}

function extractResumeSummary(resumeText: string): string {
  const lines = resumeText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  const firstLines = lines.slice(0, 3).join(' ');
  const words = firstLines.split(/\s+/);
  if (words.length > 40) {
    return words.slice(0, 40).join(' ') + '...';
  }
  return firstLines || 'No summary could be extracted.';
}

function calculateExperienceScore(resumeText: string, jobDescription: string): number {
  const resumeLower = resumeText.toLowerCase();
  const jdLower = jobDescription.toLowerCase();

  // Extract years of experience mentioned in JD
  const jdYearsMatch = jdLower.match(/(\d+)\+?\s*(?:years|yrs)\s*(?:of\s*)?experience/);
  const requiredYears = jdYearsMatch ? parseInt(jdYearsMatch[1], 10) : 0;

  // Estimate years from resume dates
  const yearMatches = resumeLower.match(/\b(19[89]\d|20[0-2]\d)\b/g) || [];
  const years = yearMatches.map((y) => parseInt(y, 10));
  let estimatedYears = 0;
  if (years.length >= 2) {
    estimatedYears = Math.max(...years) - Math.min(...years);
  }

  let score = 50;

  // Years match
  if (requiredYears > 0 && estimatedYears > 0) {
    if (estimatedYears >= requiredYears) {
      score += 30;
    } else {
      const ratio = estimatedYears / requiredYears;
      score += Math.round(ratio * 30);
    }
  } else if (estimatedYears > 0) {
    score += 15;
  }

  // Seniority keywords match
  const seniorityKeywords = ['senior', 'lead', 'principal', 'staff', 'manager', 'director', 'head', 'chief'];
  const jdSeniority = seniorityKeywords.filter((k) => jdLower.includes(k));
  const resumeSeniority = seniorityKeywords.filter((k) => resumeLower.includes(k));
  if (jdSeniority.length > 0) {
    const matchCount = jdSeniority.filter((s) => resumeSeniority.includes(s)).length;
    score += Math.round((matchCount / jdSeniority.length) * 20);
  }

  return Math.min(100, Math.max(0, score));
}

export function analyzeResume(resumeText: string, jobDescription: string): AnalysisResult {
  const jdKeywords = extractKeywords(jobDescription);
  const resumeKeywords = extractKeywords(resumeText);

  // Match keywords
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  for (const [keyword] of jdKeywords.keywords) {
    if (resumeKeywords.keywords.has(keyword)) {
      matchedKeywords.push(keyword);
    } else {
      // Only flag as missing if it's a known skill or significant word
      if (SKILL_KEYWORDS.includes(keyword) || jdKeywords.keywords.get(keyword)! > 1) {
        missingKeywords.push(keyword);
      }
    }
  }

  // Keyword score: ratio of matched to total JD keywords
  const totalJDKeywords = matchedKeywords.length + missingKeywords.length;
  const keywordScore = totalJDKeywords > 0
    ? Math.round((matchedKeywords.length / totalJDKeywords) * 100)
    : 50;

  // ATS score
  const atsIssues = checkATSCompatibility(resumeText);
  const errorCount = atsIssues.filter((i) => i.severity === 'error').length;
  const warningCount = atsIssues.filter((i) => i.severity === 'warning').length;
  const atsScore = Math.max(0, 100 - (errorCount * 20) - (warningCount * 8));

  // Experience score
  const experienceScore = calculateExperienceScore(resumeText, jobDescription);

  // Overall score (weighted)
  const overallScore = Math.round(
    keywordScore * 0.4 + atsScore * 0.25 + experienceScore * 0.35
  );

  // Generate suggestions
  const suggestions: Suggestion[] = [];

  if (missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 5);
    suggestions.push({
      type: 'critical',
      title: 'Add missing keywords',
      description: `Your resume is missing ${missingKeywords.length} key keyword(s) from the job description, including: ${topMissing.join(', ')}. Incorporate them naturally into your experience or skills sections.`,
    });
  }

  if (keywordScore < 60) {
    suggestions.push({
      type: 'critical',
      title: 'Low keyword match',
      description: `Only ${keywordScore}% of job description keywords appear in your resume. Tailor your resume to mirror the job posting's language more closely.`,
    });
  }

  if (atsIssues.some((i) => i.severity === 'error')) {
    suggestions.push({
      type: 'critical',
      title: 'Fix ATS compatibility errors',
      description: 'Your resume has formatting issues that may cause ATS systems to reject or misparse it. Address the errors listed in the ATS check section.',
    });
  }

  if (atsIssues.some((i) => i.severity === 'warning')) {
    suggestions.push({
      type: 'improvement',
      title: 'Improve ATS readability',
      description: `${warningCount} formatting warning(s) detected. While not critical, fixing these will improve how ATS systems parse your resume.`,
    });
  }

  if (experienceScore < 60) {
    suggestions.push({
      type: 'improvement',
      title: 'Strengthen experience section',
      description: 'Your experience could be better aligned with the job requirements. Add more details about relevant projects, achievements, and technologies you\'ve worked with.',
    });
  }

  const hasNumbers = /\$\d|\d+%|\d+x|\d+\s*(users|customers|clients|projects|people|team|engineers|developers)/i.test(resumeText);
  if (!hasNumbers) {
    suggestions.push({
      type: 'improvement',
      title: 'Quantify your achievements',
      description: 'Add metrics to your bullet points. Instead of "Improved performance", write "Improved API response time by 40%, serving 2M+ daily requests."',
    });
  }

  const actionVerbs = ['led', 'managed', 'developed', 'created', 'built', 'designed',
    'implemented', 'launched', 'improved', 'increased', 'reduced', 'optimized'];
  const hasActionVerbs = actionVerbs.some((v) => new RegExp(`\\b${v}\\b`, 'i').test(resumeText));
  if (!hasActionVerbs) {
    suggestions.push({
      type: 'tip',
      title: 'Use strong action verbs',
      description: 'Start each bullet point with a powerful action verb. Examples: Spearheaded, Architected, Orchestrated, Streamlined, Pioneered.',
    });
  }

  if (matchedKeywords.length > 0 && matchedKeywords.length > missingKeywords.length) {
    suggestions.push({
      type: 'tip',
      title: 'Strong keyword alignment',
      description: `Your resume matches ${matchedKeywords.length} keywords from the job description. Consider reordering your skills section to highlight the most relevant ones first.`,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      type: 'tip',
      title: 'Great resume!',
      description: 'Your resume aligns well with the job description and passes ATS checks. Make sure to proofread and keep it concise (1-2 pages).',
    });
  }

  const resumeSummary = extractResumeSummary(resumeText);

  return {
    overallScore,
    keywordScore,
    atsScore,
    experienceScore,
    matchedKeywords,
    missingKeywords,
    suggestions,
    atsIssues,
    resumeSummary,
  };
}
