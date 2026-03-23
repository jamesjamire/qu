import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, query, orderBy } from '../firebase';
import { TrendingUp, Award, Star, Activity, Users, Instagram, Youtube, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

export default function Rankings() {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Overall');

  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const q = query(collection(db, 'influencers'), orderBy('score', 'desc'));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInfluencers(data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  const categories = ['Overall', 'Fashion', 'Food', 'Tech', 'Music', 'Comedy'];

  const filteredInfluencers = activeCategory === 'Overall' 
    ? influencers 
    : influencers.filter(inf => inf.niche.includes(activeCategory));

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <h1 className="text-5xl font-black tracking-tight text-stone-900">
          TOP <span className="text-emerald-600 italic font-serif">RANKINGS</span>
        </h1>
        <p className="text-stone-500 font-medium">The definitive list of East Africa's most impactful creators, updated daily.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 pb-4 border-b border-stone-200">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${
              activeCategory === cat 
                ? 'bg-stone-900 text-white shadow-lg shadow-stone-200' 
                : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-24 bg-stone-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredInfluencers.length > 0 ? (
        <div className="space-y-4">
          {filteredInfluencers.map((inf, i) => (
            <motion.div
              key={inf.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-white border border-stone-200 rounded-2xl p-4 flex items-center gap-6 hover:shadow-xl hover:shadow-stone-200/50 transition-all hover:border-emerald-200"
            >
              <div className="w-12 flex flex-col items-center justify-center">
                {i < 3 ? (
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg ${
                    i === 0 ? 'bg-yellow-500 shadow-yellow-100' : 
                    i === 1 ? 'bg-stone-400 shadow-stone-100' : 
                    'bg-orange-600 shadow-orange-100'
                  }`}>
                    <Award size={20} />
                  </div>
                ) : (
                  <span className="text-xl font-black text-stone-300">#{i + 1}</span>
                )}
              </div>

              <div className="flex-1 flex items-center gap-4">
                <img 
                  src={inf.avatarUrl || `https://picsum.photos/seed/${inf.handle}/200/200`} 
                  alt="" 
                  className="w-14 h-14 rounded-xl object-cover border border-stone-100"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-0.5">
                  <h3 className="font-bold text-stone-900 group-hover:text-emerald-700 transition-colors">{inf.name}</h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500 font-medium">
                    <span className="flex items-center gap-1">
                      {inf.platform === 'instagram' ? <Instagram size={12} className="text-pink-600" /> : <Youtube size={12} className="text-red-600" />}
                      @{inf.handle}
                    </span>
                    <span className="w-1 h-1 bg-stone-300 rounded-full" />
                    <span>{inf.location}</span>
                  </div>
                </div>
              </div>

              <div className="hidden md:grid grid-cols-3 gap-8 px-8 border-x border-stone-100">
                <div className="text-center space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Followers</p>
                  <p className="text-sm font-bold text-stone-800">{formatNumber(inf.followerCount)}</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Engagement</p>
                  <p className="text-sm font-bold text-stone-800">{inf.engagementRate}%</p>
                </div>
                <div className="text-center space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-stone-400">Growth</p>
                  <p className="text-sm font-bold text-emerald-600">+{inf.growthTrajectory}%</p>
                </div>
              </div>

              <div className="w-24 text-center">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-black border border-emerald-100">
                  <Star size={14} fill="currentColor" />
                  {inf.score.toFixed(0)}
                </div>
              </div>

              <Link to={`/influencer/${inf.id}`} className="p-2 text-stone-300 hover:text-emerald-600 transition-colors">
                <ChevronRight size={24} />
              </Link>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-32 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200">
          <p className="text-stone-400 font-medium italic">No rankings available for this category yet.</p>
        </div>
      )}
    </div>
  );
}
