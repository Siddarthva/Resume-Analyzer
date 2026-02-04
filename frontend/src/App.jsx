import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  FileText, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ArrowRight,
  RotateCcw,
  Zap,
  Target
} from 'lucide-react';

const App = () => {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Simple client-side skill extraction
  const extractSkills = (text) => {
    if (!text) return new Set();
    // A basic list of common tech keywords to filter against
    const commonSkills = [
      'python', 'javascript', 'react', 'node', 'java', 'aws', 'docker', 'sql', 'nosql', 
      'machine learning', 'data science', 'flask', 'fastapi', 'typescript', 'c++', 
      'kubernetes', 'agile', 'scrum', 'git', 'ci/cd', 'linux', 'azure', 'gcp', 
      'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'tableau', 'powerbi'
    ];
    
    const words = text.toLowerCase().split(/[\s,./()]+/).map(w => w.trim());
    return new Set(commonSkills.filter(skill => 
      skill.includes(' ') 
        ? text.toLowerCase().includes(skill) // check multi-word skills
        : words.includes(skill)
    ));
  };

  const skillAnalysis = useMemo(() => {
    const resumeSkills = extractSkills(resumeText);
    const jdSkills = extractSkills(jdText);
    
    const matched = Array.from(jdSkills).filter(skill => resumeSkills.has(skill));
    const missing = Array.from(jdSkills).filter(skill => !resumeSkills.has(skill));
    
    return { matched, missing };
  }, [resumeText, jdText]);

  const handlePredict = async () => {
    if (!resumeText.trim() || !jdText.trim()) {
      setError('Please provide both a resume and a job description.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('http://localhost:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resume_text: resumeText,
          jd_text: jdText,
        }),
      });

      if (!response.ok) throw new Error('Failed to connect to the prediction server.');

      const data = await response.json();
      setResult(data.probability);
    } catch (err) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResumeText('');
    setJdText('');
    setResult(null);
    setError(null);
  };

  const getStatus = (prob) => {
    if (prob >= 75) return { 
      label: 'STRONG MATCH', 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      border: 'border-emerald-200',
      fill: 'bg-emerald-600',
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" /> 
    };
    if (prob >= 45) return { 
      label: 'MODERATE MATCH', 
      color: 'text-amber-600', 
      bg: 'bg-amber-50', 
      border: 'border-amber-200',
      fill: 'bg-amber-600',
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" /> 
    };
    return { 
      label: 'WEAK MATCH', 
      color: 'text-rose-600', 
      bg: 'bg-rose-50', 
      border: 'border-rose-200',
      fill: 'bg-rose-600',
      icon: <XCircle className="w-6 h-6 text-rose-600" /> 
    };
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Resume Analyser <span className="text-blue-600">Pro</span>
          </h1>
          <p className="text-lg text-slate-600">
            Intelligent Resume-to-Job matching powered by SBERT & XGBoost
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Resume Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="flex items-center text-sm font-semibold text-slate-700 uppercase tracking-wider">
                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                    Resume
                  </label>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {resumeText.length} chars
                  </span>
                </div>
                <textarea
                  className="w-full h-64 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400"
                  placeholder="Paste candidate's resume..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              {/* JD Input */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="flex items-center text-sm font-semibold text-slate-700 uppercase tracking-wider">
                    <Briefcase className="w-4 h-4 mr-2 text-purple-500" />
                    Job Description
                  </label>
                  <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    {jdText.length} chars
                  </span>
                </div>
                <textarea
                  className="w-full h-64 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400"
                  placeholder="Paste target job description..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </div>
            </div>

            {/* Action Section */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handlePredict}
                disabled={loading}
                className={`group flex items-center justify-center px-10 py-4 text-lg font-bold text-white rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg ${
                  loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    Predict Match
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <button
                onClick={handleClear}
                className="flex items-center px-6 py-4 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Clear All
              </button>
            </div>

            {error && (
              <div className="mt-6 flex items-center p-4 text-rose-800 bg-rose-50 rounded-lg border border-rose-100 animate-bounce">
                <AlertCircle className="w-5 h-5 mr-2" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Results Display */}
            {result !== null && (
              <div className={`mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`p-8 rounded-2xl border-2 ${getStatus(result).bg} ${getStatus(result).border}`}>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-xs font-bold tracking-[0.2em] text-slate-500 mb-1">SCORE REPORT</p>
                        <div className="flex items-center">
                          {getStatus(result).icon}
                          <h2 className={`ml-2 text-3xl font-black tracking-tight ${getStatus(result).color}`}>
                            {getStatus(result).label}
                          </h2>
                        </div>
                      </div>

                      {/* Strength Meter */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 px-1 uppercase tracking-tighter">
                          <span>Weak</span>
                          <span>Moderate</span>
                          <span>Strong</span>
                        </div>
                        <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex">
                          <div className={`h-full transition-all duration-1000 ${getStatus(result).fill}`} style={{ width: `${result}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="relative flex items-center justify-center shrink-0 scale-110">
                      <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-slate-200" />
                        <circle
                          cx="64"
                          cy="64"
                          r="58"
                          stroke="currentColor"
                          strokeWidth="10"
                          fill="transparent"
                          strokeDasharray={364}
                          strokeDashoffset={364 - (364 * result) / 100}
                          className={`${getStatus(result).color} transition-all duration-1000 ease-out`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-800 leading-none">{Math.round(result)}%</span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase mt-1">Match</span>
                      </div>
                    </div>
                  </div>

                  {/* Skills Panels */}
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-slate-200">
                    <div className="space-y-3">
                      <h4 className="flex items-center text-xs font-bold text-emerald-700 uppercase tracking-widest">
                        <Zap className="w-3 h-3 mr-1" />
                        Matched Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillAnalysis.matched.length > 0 ? (
                          skillAnalysis.matched.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-lg border border-emerald-200">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs italic">No matching keywords found.</span>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="flex items-center text-xs font-bold text-rose-700 uppercase tracking-widest">
                        <Target className="w-3 h-3 mr-1" />
                        Missing Skills
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillAnalysis.missing.length > 0 ? (
                          skillAnalysis.missing.map(skill => (
                            <span key={skill} className="px-3 py-1 bg-rose-50 text-rose-600 text-xs font-medium rounded-lg border border-rose-100">
                              {skill}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400 text-xs italic">No missing critical keywords.</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <footer className="mt-12 text-center text-slate-400 text-[10px] font-medium tracking-widest uppercase">
          Client-Side Skill Analysis Enabled • SBERT Embedding Ready
        </footer>
      </div>
    </div>
  );
};

export default App;