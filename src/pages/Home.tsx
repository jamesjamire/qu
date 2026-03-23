import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db, collection, getDocs, query, orderBy, limit } from '../firebase';
import InfluencerCard from '../components/InfluencerCard';
import { Search, TrendingUp, Users, ShieldCheck, ArrowRight, Globe, Zap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const [featured, setFeatured] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(collection(db, 'influencers'), orderBy('score', 'desc'), limit(4));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFeatured(data);
      } catch (error) {
        console.error('Error fetching featured influencers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  const stats = [
    { label: 'Influencers', value: '5K+', icon: Users },
    { label: 'Campaigns', value: '1.2K', icon: Zap },
    { label: 'Countries', value: '5+', icon: Globe },
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100 shadow-sm">
              <TrendingUp size={16} />
              <span>#1 Influencer Platform in East Africa</span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-black tracking-tight text-stone-900 leading-[0.9]">
              QU <br />
              <span className="text-emerald-600 italic font-serif">INFLUENCE</span> <br />
              IN TANZANIA
            </h1>
            <p className="text-xl text-stone-500 max-w-lg leading-relaxed font-medium">
              The premier AI-driven platform for brands to discover, rank, and connect with top-tier influencers across East Africa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/discovery"
                className="px-8 py-4 bg-stone-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all hover:scale-105 shadow-xl shadow-stone-200"
              >
                Start Discovery
                <Search size={20} />
              </Link>
              <Link
                to="/rankings"
                className="px-8 py-4 bg-white text-stone-900 border border-stone-200 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-stone-50 transition-all"
              >
                View Rankings
                <ArrowRight size={20} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-emerald-100 rounded-full blur-[100px] opacity-50 z-0" />
            <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-stone-200 rounded-full blur-[100px] opacity-50 z-0" />
            
            <div className="relative z-10 grid grid-cols-2 gap-4">
              <div className="space-y-4 pt-12">
                <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-stone-200 border border-stone-100 transform -rotate-6">
                  <img src="https://picsum.photos/seed/influencer1/400/500" alt="" className="rounded-2xl w-full h-48 object-cover mb-4" referrerPolicy="no-referrer" />
                  <div className="h-2 w-24 bg-stone-100 rounded-full mb-2" />
                  <div className="h-2 w-16 bg-stone-100 rounded-full" />
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-stone-200 border border-stone-100 transform rotate-3">
                  <img src="https://picsum.photos/seed/influencer2/400/500" alt="" className="rounded-2xl w-full h-48 object-cover mb-4" referrerPolicy="no-referrer" />
                  <div className="h-2 w-20 bg-stone-100 rounded-full mb-2" />
                  <div className="h-2 w-12 bg-stone-100 rounded-full" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-stone-200 border border-stone-100 transform rotate-6">
                  <img src="https://picsum.photos/seed/influencer3/400/500" alt="" className="rounded-2xl w-full h-48 object-cover mb-4" referrerPolicy="no-referrer" />
                  <div className="h-2 w-28 bg-stone-100 rounded-full mb-2" />
                  <div className="h-2 w-18 bg-stone-100 rounded-full" />
                </div>
                <div className="bg-white p-4 rounded-3xl shadow-2xl shadow-stone-200 border border-stone-100 transform -rotate-3">
                  <img src="https://picsum.photos/seed/influencer4/400/500" alt="" className="rounded-2xl w-full h-48 object-cover mb-4" referrerPolicy="no-referrer" />
                  <div className="h-2 w-22 bg-stone-100 rounded-full mb-2" />
                  <div className="h-2 w-14 bg-stone-100 rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-stone-900 rounded-[40px] py-16 px-8 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white h-full" />
            ))}
          </div>
        </div>
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
                <stat.icon size={24} />
              </div>
              <div>
                <h3 className="text-5xl font-black tracking-tight">{stat.value}</h3>
                <p className="text-stone-400 font-medium uppercase tracking-widest text-xs mt-2">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Influencers */}
      <section className="space-y-12">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div className="space-y-4">
            <h2 className="text-4xl font-black tracking-tight text-stone-900">
              TOP <span className="text-emerald-600 italic font-serif">PERFORMERS</span>
            </h2>
            <p className="text-stone-500 font-medium max-w-md">
              Discover the most impactful creators in the region, ranked by our proprietary AI scoring system.
            </p>
          </div>
          <Link to="/rankings" className="text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-2 group">
            View All Rankings
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-80 bg-stone-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : featured.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featured.map((influencer, i) => (
              <InfluencerCard key={influencer.id} influencer={influencer} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-stone-50 rounded-3xl border-2 border-dashed border-stone-200">
            <p className="text-stone-400 font-medium italic">No influencers found. Start by adding some in the Admin panel.</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: 'AI Ranking',
            desc: 'Our advanced AI agent analyzes engagement, authenticity, and growth to provide a reliable score.',
            icon: ShieldCheck,
            color: 'bg-blue-50 text-blue-600'
          },
          {
            title: 'Multi-Platform',
            desc: 'Track influencers across Instagram and YouTube, with TikTok and Twitter integration coming soon.',
            icon: Zap,
            color: 'bg-orange-50 text-orange-600'
          },
          {
            title: 'Market Focused',
            desc: 'Tailored specifically for the East African market, starting with deep insights into Tanzania.',
            icon: Globe,
            color: 'bg-emerald-50 text-emerald-600'
          }
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2 }}
            viewport={{ once: true }}
            className="p-8 bg-white rounded-3xl border border-stone-200 space-y-4 hover:border-emerald-200 transition-colors"
          >
            <div className={`w-12 h-12 ${feature.color} rounded-2xl flex items-center justify-center`}>
              <feature.icon size={24} />
            </div>
            <h3 className="text-xl font-bold text-stone-900">{feature.title}</h3>
            <p className="text-stone-500 text-sm leading-relaxed font-medium">{feature.desc}</p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
