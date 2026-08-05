import React, { useState, useRef, useEffect } from 'react';
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
  Target,
  Upload,
  FileCode,
  RefreshCw
} from 'lucide-react';
import { predictMatch, extractTextFromFile } from './services/api';

const LOADING_MESSAGES = [
  "Waking up AI engine...",
  "Analyzing resume structure...",
  "Extracting key competencies...",
  "Computing semantic similarity...",
  "Almost there, finalizing report..."
];

const App = () => {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [loading, setLoading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [retryInfo, setRetryInfo] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  // Cycle through loading messages
  useEffect(() => {
    let interval;
    if (loading || parsing) {
      let index = 0;
      setLoadingMessage(LOADING_MESSAGES[0]);
      interval = setInterval(() => {
        index = (index + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[index]);
      }, 3000);
    } else {
      setLoadingMessage('');
      setRetryInfo(null);
    }
    return () => clearInterval(interval);
  }, [loading, parsing]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setParsing(true);
    setError(null);
    setRetryInfo(null);

    try {
      const text = await extractTextFromFile(file, (count, delay) => {
        setRetryInfo({ count, delay: delay / 1000 });
      });
      setResumeText(text.text);
    } catch (err) {
      setError(`File Error: ${err.message}`);
    } finally {
      setParsing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePredict = async () => {
    if (!resumeText.trim() || !jdText.trim()) {
      setError('Please provide both a resume and a job description.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setRetryInfo(null);

    try {
      const data = await predictMatch(resumeText, jdText, (count, delay) => {
        setRetryInfo({ count, delay: delay / 1000 });
      });
      setResult(data);
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

  const resumeInfo = result?.resume || result?.parsed_resume || {};
  const sectionScores = result?.section_scores || null;
  const categorizedSkills = result?.skills || null;
  const suggestions = result?.suggestions || [];

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
              {/* Resume Input Area */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="flex items-center text-sm font-semibold text-slate-700 uppercase tracking-wider">
                    <FileText className="w-4 h-4 mr-2 text-blue-500" />
                    Resume
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleFileUpload} 
                      className="hidden" 
                      accept=".pdf,.docx,.txt"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={parsing || loading}
                      className="text-[10px] flex items-center gap-1 font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded transition-colors disabled:opacity-50"
                    >
                      {parsing ? <Loader2 className="w-3 h-3 animate-spin"/> : <Upload className="w-3 h-3" />}
                      UPLOAD
                    </button>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {resumeText.length} chars
                    </span>
                  </div>
                </div>
                <textarea
                  className="w-full h-80 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400"
                  placeholder="Paste resume content here or use the upload button for PDF/DOCX..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              {/* JD Input Area */}
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
                  className="w-full h-80 p-4 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none placeholder:text-slate-400"
                  placeholder="Paste target job description here..."
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                />
              </div>
            </div>

            {/* Action Section */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
                <button
                  onClick={handlePredict}
                  disabled={loading || parsing}
                  className={`group flex items-center justify-center px-10 py-4 text-lg font-bold text-white rounded-full transition-all transform hover:scale-105 active:scale-95 shadow-lg min-w-[240px] ${
                    loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                  }`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                      {loadingMessage}
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

              {/* Enhanced Feedback Layer */}
              {(loading || parsing || retryInfo) && (
                <div className="flex flex-col items-center gap-2 mt-2 animate-in fade-in duration-500">
                  {retryInfo && (
                    <div className="flex items-center text-amber-600 text-xs font-bold px-4 py-2 bg-amber-50 rounded-full border border-amber-100">
                      <RefreshCw className="w-3 h-3 mr-2 animate-spin-reverse" />
                      Server is waking up (Attempt {retryInfo.count}/3). Retrying in {retryInfo.delay}s...
                    </div>
                  )}
                  {(loading || parsing) && !retryInfo && (
                    <div className="text-slate-400 text-xs font-medium italic animate-pulse">
                      {loadingMessage}
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="mt-6 flex flex-col p-4 text-rose-800 bg-rose-50 rounded-lg border border-rose-100 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm font-semibold">Reliability Alert</span>
                </div>
                <p className="mt-1 text-sm pl-7">{error}</p>
                <p className="mt-2 text-[10px] pl-7 text-rose-400 opacity-70">
                  Tip: If the server was asleep, wait 30 seconds and try again.
                </p>
              </div>
            )}

            {/* Results Display */}
            {result && (
              <div className={`mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                <div className={`p-8 rounded-2xl border-2 ${getStatus(result.probability).bg} ${getStatus(result.probability).border}`}>
                  <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex-1 space-y-4">
                      <div>
                        <p className="text-xs font-bold tracking-[0.2em] text-slate-500 mb-1">SCORE REPORT</p>
                        <div className="flex items-center">
                          {getStatus(result.probability).icon}
                          <h2 className={`ml-2 text-3xl font-black tracking-tight ${getStatus(result.probability).color}`}>
                            {getStatus(result.probability).label}
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
                          <div 
                            className={`h-full transition-all duration-1000 ${getStatus(result.probability).fill}`} 
                            style={{ width: `${result.probability}%` }} 
                          />
                        </div>
                        <p className="text-[10px] text-slate-500 italic">
                          Semantic similarity: {result.analysis.semantic_similarity}%
                        </p>
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
                          strokeDashoffset={364 - (364 * result.probability) / 100}
                          className={`${getStatus(result.probability).color} transition-all duration-1000 ease-out`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-slate-800 leading-none">{Math.round(result.probability)}%</span>
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
                        {result.analysis.matched_skills.length > 0 ? (
                          result.analysis.matched_skills.map(skill => (
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
                        {result.analysis.missing_skills.length > 0 ? (
                          result.analysis.missing_skills.map(skill => (
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

                  {(resumeInfo.name || resumeInfo.email || resumeInfo.phone) && (
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-slate-200">
                      {resumeInfo.name && (
                        <div className="rounded-xl bg-white/70 border border-slate-200 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Name</p>
                          <p className="text-sm font-semibold text-slate-800 break-words">{resumeInfo.name}</p>
                        </div>
                      )}
                      {resumeInfo.email && (
                        <div className="rounded-xl bg-white/70 border border-slate-200 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Email</p>
                          <p className="text-sm font-semibold text-slate-800 break-words">{resumeInfo.email}</p>
                        </div>
                      )}
                      {resumeInfo.phone && (
                        <div className="rounded-xl bg-white/70 border border-slate-200 p-4">
                          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">Phone</p>
                          <p className="text-sm font-semibold text-slate-800 break-words">{resumeInfo.phone}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {sectionScores && (
                    <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
                      <h4 className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-widest">
                        <FileCode className="w-3 h-3 mr-1" />
                        Section Scores
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                        {Object.entries(sectionScores).map(([key, value]) => (
                          <div key={key} className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">{key.replace(/_/g, ' ')}</p>
                            <p className="text-2xl font-black text-slate-800">{value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {categorizedSkills && (
                    <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
                      <h4 className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-widest">
                        <Target className="w-3 h-3 mr-1" />
                        Categorized Skills
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(categorizedSkills).map(([category, items]) => (
                          <div key={category} className="rounded-xl bg-white/70 border border-slate-200 p-4 space-y-3">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{category.replace(/_/g, ' ')}</p>
                            <div className="flex flex-wrap gap-2">
                              {Array.isArray(items) && items.length > 0 ? items.map((skill) => (
                                <span key={`${category}-${skill}`} className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg border border-blue-100">
                                  {skill}
                                </span>
                              )) : (
                                <span className="text-slate-400 text-xs italic">None detected.</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {suggestions.length > 0 && (
                    <div className="mt-8 pt-8 border-t border-slate-200 space-y-4">
                      <h4 className="flex items-center text-xs font-bold text-slate-700 uppercase tracking-widest">
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Suggestions
                      </h4>
                      <div className="space-y-3">
                        {suggestions.map((item, index) => (
                          <div key={`${index}-${item}`} className="rounded-xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-900">
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <footer className="mt-12 text-center text-slate-400 text-[10px] font-medium tracking-widest uppercase">
          Made with ❤️ by <a href="https://github.com/Siddarthva" className="text-blue-600 hover:underline">Siddarthva</a> 
        </footer>
      </div>
      <style>{`
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 1s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default App;