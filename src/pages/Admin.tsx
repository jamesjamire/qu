import React, { useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs, query, where, doc, getDoc } from '../firebase';
import { auth, onAuthStateChanged } from '../firebase';
import { ShieldCheck, Plus, Sparkles, Loader2, CheckCircle2, AlertCircle, Instagram, Youtube, MapPin, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Admin() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [scoring, setScoring] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    handle: '',
    platform: 'instagram',
    location: 'Tanzania',
    followerCount: '',
    engagementRate: '',
    postFrequency: '',
    growthTrajectory: '',
    avatarUrl: '',
    bio: ''
  });

  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setIsAdmin(userDoc.exists() && userDoc.data().role === 'admin');
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setScoring(true);
    setError(null);
    setAiResult(null);

    try {
      const response = await fetch('/api/influencers/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: formData.handle,
          platform: formData.platform,
          metrics: {
            followerCount: Number(formData.followerCount),
            engagementRate: Number(formData.engagementRate),
            postFrequency: Number(formData.postFrequency),
            growthTrajectory: Number(formData.growthTrajectory)
          }
        })
      });

      if (!response.ok) throw new Error('Failed to score influencer');
      
      const result = await response.json();
      setAiResult(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setScoring(false);
    }
  };

  const handleSave = async () => {
    if (!aiResult) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'influencers'), {
        ...formData,
        followerCount: Number(formData.followerCount),
        engagementRate: Number(formData.engagementRate),
        postFrequency: Number(formData.postFrequency),
        growthTrajectory: Number(formData.growthTrajectory),
        score: aiResult.score,
        authenticityScore: aiResult.authenticityScore,
        consistencyScore: aiResult.consistencyScore,
        niche: aiResult.niche,
        lastUpdated: new Date().toISOString()
      });

      setSuccess(true);
      setFormData({
        name: '', handle: '', platform: 'instagram', location: 'Tanzania',
        followerCount: '', engagementRate: '', postFrequency: '',
        growthTrajectory: '', avatarUrl: '', bio: ''
      });
      setAiResult(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !scoring) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-32 space-y-6">
        <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tight">Access Denied</h2>
          <p className="text-stone-500 font-medium">You must be an administrator to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-black tracking-tight text-stone-900">
          ADMIN <span className="text-emerald-600 italic font-serif">PANEL</span>
        </h1>
        <p className="text-stone-500 font-medium">Add new influencers and use the AI agent to calculate their performance rankings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Form */}
        <div className="bg-white p-8 rounded-[40px] border border-stone-200 shadow-xl shadow-stone-200/50 space-y-8">
          <div className="flex items-center gap-3 pb-6 border-b border-stone-100">
            <div className="w-10 h-10 bg-stone-900 text-white rounded-xl flex items-center justify-center">
              <Plus size={20} />
            </div>
            <h2 className="text-xl font-bold text-stone-900">Add Influencer</h2>
          </div>

          <form onSubmit={handleScore} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Diamond Platnumz"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Handle</label>
                <input
                  type="text"
                  required
                  value={formData.handle}
                  onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="diamondplatnumz"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Platform</label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Location</label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Tanzania">Tanzania</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Rwanda">Rwanda</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Followers</label>
                <input
                  type="number"
                  required
                  value={formData.followerCount}
                  onChange={(e) => setFormData({ ...formData, followerCount: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="15000000"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Engagement %</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.engagementRate}
                  onChange={(e) => setFormData({ ...formData, engagementRate: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="4.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Posts/Week</label>
                <input
                  type="number"
                  required
                  value={formData.postFrequency}
                  onChange={(e) => setFormData({ ...formData, postFrequency: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="12"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Growth %</label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={formData.growthTrajectory}
                  onChange={(e) => setFormData({ ...formData, growthTrajectory: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="2.1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400">Avatar URL</label>
              <input
                type="url"
                value={formData.avatarUrl}
                onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="https://..."
              />
            </div>

            <button
              type="submit"
              disabled={scoring}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all disabled:opacity-50 shadow-lg shadow-emerald-100"
            >
              {scoring ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  AI Agent Scoring...
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Calculate AI Score
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Result */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {aiResult ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-stone-900 text-white p-8 rounded-[40px] space-y-8 shadow-2xl shadow-stone-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full" />
                
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black tracking-tight">AI Assessment</h3>
                    <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">Generated by Gemini 3.1 Flash</p>
                  </div>
                  <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-3xl font-black">
                    {aiResult.score}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Authenticity</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-400" style={{ width: `${aiResult.authenticityScore}%` }} />
                      </div>
                      <span className="text-sm font-bold">{aiResult.authenticityScore}%</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Consistency</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400" style={{ width: `${aiResult.consistencyScore}%` }} />
                      </div>
                      <span className="text-sm font-bold">{aiResult.consistencyScore}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Identified Niches</p>
                  <div className="flex flex-wrap gap-2">
                    {aiResult.niche.map((n: string) => (
                      <span key={n} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold border border-white/5">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">AI Reasoning</p>
                  <p className="text-sm text-stone-300 leading-relaxed font-medium italic">
                    "{aiResult.reasoning}"
                  </p>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full py-4 bg-white text-stone-900 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-100 transition-all shadow-xl"
                >
                  <CheckCircle2 size={20} />
                  Confirm & Save to Database
                </button>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200 text-center space-y-4">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-stone-300 shadow-sm">
                  <Sparkles size={32} />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-stone-900">Awaiting Analysis</h3>
                  <p className="text-sm text-stone-500 font-medium">Fill in the influencer metrics and click "Calculate AI Score" to see the agent's assessment.</p>
                </div>
              </div>
            )}
          </AnimatePresence>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100 flex items-center gap-3 font-bold text-sm"
            >
              <CheckCircle2 size={20} />
              Influencer successfully saved to database!
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 text-red-700 rounded-2xl border border-red-100 flex items-center gap-3 font-bold text-sm"
            >
              <AlertCircle size={20} />
              {error}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
