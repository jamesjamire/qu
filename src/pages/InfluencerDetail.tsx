import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, doc, getDoc } from '../firebase';
import { Instagram, Youtube, TrendingUp, Users, Activity, MapPin, Star, Calendar, MessageSquare, Heart, Share2, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function InfluencerDetail() {
  const { id } = useParams<{ id: string }>();
  const [influencer, setInfluencer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInfluencer = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'influencers', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setInfluencer({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error('Error fetching influencer:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencer();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!influencer) {
    return (
      <div className="text-center py-32 space-y-6">
        <div className="w-20 h-20 bg-stone-100 text-stone-400 rounded-full flex items-center justify-center mx-auto">
          <Users size={40} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-stone-900 uppercase tracking-tight">Influencer Not Found</h2>
          <p className="text-stone-500 font-medium">The profile you're looking for doesn't exist or has been removed.</p>
        </div>
        <Link to="/discovery" className="inline-flex items-center gap-2 text-emerald-600 font-bold hover:text-emerald-700">
          <ArrowLeft size={20} />
          Back to Discovery
        </Link>
      </div>
    );
  }

  const mockGrowthData = [
    { name: 'Jan', followers: influencer.followerCount * 0.9 },
    { name: 'Feb', followers: influencer.followerCount * 0.92 },
    { name: 'Mar', followers: influencer.followerCount * 0.95 },
    { name: 'Apr', followers: influencer.followerCount * 0.97 },
    { name: 'May', followers: influencer.followerCount * 0.99 },
    { name: 'Jun', followers: influencer.followerCount },
  ];

  const PlatformIcon = influencer.platform === 'instagram' ? Instagram : Youtube;
  const platformColor = influencer.platform === 'instagram' ? 'text-pink-600' : 'text-red-600';

  return (
    <div className="space-y-12">
      <Link to="/discovery" className="inline-flex items-center gap-2 text-stone-500 font-bold hover:text-emerald-600 transition-colors">
        <ArrowLeft size={20} />
        Back to Discovery
      </Link>

      {/* Header Card */}
      <section className="bg-white rounded-[40px] border border-stone-200 p-8 md:p-12 shadow-xl shadow-stone-200/50">
        <div className="flex flex-col md:flex-row gap-12 items-center md:items-start">
          <div className="relative">
            <img
              src={influencer.avatarUrl || `https://picsum.photos/seed/${influencer.handle}/400/400`}
              alt={influencer.name}
              className="w-48 h-48 rounded-[40px] object-cover border-4 border-stone-50 shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div className={`absolute -bottom-4 -right-4 p-3 bg-white rounded-2xl shadow-xl border border-stone-100 ${platformColor}`}>
              <PlatformIcon size={24} />
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center md:text-left">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                <h1 className="text-4xl font-black tracking-tight text-stone-900">{influencer.name}</h1>
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-lg font-black border border-emerald-100 shadow-sm">
                  <Star size={18} fill="currentColor" />
                  {influencer.score.toFixed(0)}
                </div>
              </div>
              <p className="text-xl text-stone-500 font-medium">@{influencer.handle}</p>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {influencer.niche.map((tag: string) => (
                <span key={tag} className="px-4 py-1.5 bg-stone-100 text-stone-600 rounded-xl text-xs font-bold uppercase tracking-wider border border-stone-200">
                  {tag}
                </span>
              ))}
              <span className="px-4 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <MapPin size={14} />
                {influencer.location}
              </span>
            </div>

            <p className="text-stone-600 max-w-2xl leading-relaxed font-medium">
              {influencer.bio || `${influencer.name} is a top-tier ${influencer.platform} creator based in ${influencer.location}, specializing in ${influencer.niche.join(', ')}.`}
            </p>

            <div className="flex flex-wrap justify-center md:justify-start gap-8 pt-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Followers</p>
                <p className="text-2xl font-black text-stone-900">{(influencer.followerCount / 1000000).toFixed(1)}M</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Engagement</p>
                <p className="text-2xl font-black text-stone-900">{influencer.engagementRate}%</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Growth</p>
                <p className="text-2xl font-black text-emerald-600">+{influencer.growthTrajectory}%</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* AI Analysis Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-stone-900 text-white p-8 rounded-[40px] space-y-8 shadow-2xl shadow-stone-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 blur-3xl rounded-full" />
            
            <div className="flex items-center gap-3 border-b border-white/10 pb-6">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                <Sparkles size={20} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xl font-black tracking-tight">AI Analysis</h3>
                <p className="text-stone-400 text-[10px] font-bold uppercase tracking-widest">Performance Audit</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Authenticity</p>
                  <span className="text-sm font-bold text-blue-400">{influencer.authenticityScore}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${influencer.authenticityScore}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-blue-400" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Consistency</p>
                  <span className="text-sm font-bold text-orange-400">{influencer.consistencyScore}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${influencer.consistencyScore}%` }}
                    transition={{ duration: 1, delay: 0.7 }}
                    className="h-full bg-orange-400" 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Growth Potential</p>
                  <span className="text-sm font-bold text-emerald-400">High</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 1, delay: 0.9 }}
                    className="h-full bg-emerald-400" 
                  />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Verified Authenticity</span>
              </div>
              <p className="text-sm text-stone-300 leading-relaxed font-medium italic">
                "Audience shows high organic engagement patterns with minimal bot activity. Content strategy is highly consistent with current market trends in {influencer.location}."
              </p>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-stone-200 space-y-6">
            <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight">Quick Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-stone-400" />
                  <span className="text-sm font-bold text-stone-600">Post Frequency</span>
                </div>
                <span className="text-sm font-black text-stone-900">{influencer.postFrequency}/wk</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <MessageSquare size={18} className="text-stone-400" />
                  <span className="text-sm font-bold text-stone-600">Avg Comments</span>
                </div>
                <span className="text-sm font-black text-stone-900">1.2K</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Heart size={18} className="text-stone-400" />
                  <span className="text-sm font-bold text-stone-600">Avg Likes</span>
                </div>
                <span className="text-sm font-black text-stone-900">45K</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Content */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[40px] border border-stone-200 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight">Growth Trajectory</h3>
              <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold">
                <TrendingUp size={14} />
                +12% Last 6 Months
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={mockGrowthData}>
                  <defs>
                    <linearGradient id="colorFollowers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1c1917', border: 'none', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="followers" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorFollowers)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-stone-200 space-y-8">
            <h3 className="text-xl font-black text-stone-900 uppercase tracking-tight">Recent Content Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group relative rounded-3xl overflow-hidden aspect-square bg-stone-100">
                  <img src={`https://picsum.photos/seed/${influencer.handle}-${i}/500/500`} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-6 text-white">
                    <div className="flex items-center gap-4 text-sm font-bold">
                      <span className="flex items-center gap-1"><Heart size={16} fill="currentColor" /> 12K</span>
                      <span className="flex items-center gap-1"><MessageSquare size={16} fill="currentColor" /> 450</span>
                      <span className="flex items-center gap-1"><Share2 size={16} fill="currentColor" /> 120</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
