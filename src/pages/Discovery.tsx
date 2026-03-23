import React, { useState, useEffect } from 'react';
import { db, collection, getDocs, query, where, orderBy } from '../firebase';
import InfluencerCard from '../components/InfluencerCard';
import { Search, Filter, SlidersHorizontal, MapPin, Users, Activity, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Discovery() {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    platform: 'all',
    location: 'all',
    niche: 'all',
    followerRange: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchInfluencers = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, 'influencers'), orderBy('score', 'desc'));
        
        // Firestore doesn't support complex filtering with orderBy easily without composite indexes
        // For this MVP, we'll fetch and filter client-side for better UX
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setInfluencers(data);
      } catch (error) {
        console.error('Error fetching influencers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfluencers();
  }, []);

  const filteredInfluencers = influencers.filter(inf => {
    const matchesSearch = inf.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         inf.handle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inf.niche.some((n: string) => n.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPlatform = filters.platform === 'all' || inf.platform === filters.platform;
    const matchesLocation = filters.location === 'all' || inf.location === filters.location;
    const matchesNiche = filters.niche === 'all' || inf.niche.includes(filters.niche);
    
    let matchesFollowers = true;
    if (filters.followerRange === '0-10k') matchesFollowers = inf.followerCount < 10000;
    else if (filters.followerRange === '10k-100k') matchesFollowers = inf.followerCount >= 10000 && inf.followerCount < 100000;
    else if (filters.followerRange === '100k-500k') matchesFollowers = inf.followerCount >= 100000 && inf.followerCount < 500000;
    else if (filters.followerRange === '500k+') matchesFollowers = inf.followerCount >= 500000;

    return matchesSearch && matchesPlatform && matchesLocation && matchesNiche && matchesFollowers;
  });

  const locations = ['Tanzania', 'Kenya', 'Uganda', 'Rwanda'];
  const niches = ['Fashion', 'Food', 'Tech', 'Travel', 'Music', 'Comedy', 'Education', 'Fitness'];

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <h1 className="text-5xl font-black tracking-tight text-stone-900">
          DISCOVERY <span className="text-emerald-600 italic font-serif">HUB</span>
        </h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, handle, or niche..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-stone-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all shadow-sm font-medium"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
              showFilters ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'bg-white text-stone-900 border border-stone-200'
            }`}
          >
            <SlidersHorizontal size={20} />
            Filters
            {Object.values(filters).some(v => v !== 'all') && (
              <span className="w-5 h-5 bg-white text-emerald-600 rounded-full text-[10px] flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-8 bg-white border border-stone-200 rounded-3xl shadow-xl shadow-stone-200/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  <Activity size={14} /> Platform
                </label>
                <select
                  value={filters.platform}
                  onChange={(e) => setFilters({ ...filters, platform: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Platforms</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  <MapPin size={14} /> Location
                </label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Locations</option>
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  <Filter size={14} /> Niche
                </label>
                <select
                  value={filters.niche}
                  onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">All Niches</option>
                  {niches.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
                  <Users size={14} /> Followers
                </label>
                <select
                  value={filters.followerRange}
                  onChange={(e) => setFilters({ ...filters, followerRange: e.target.value })}
                  className="w-full p-3 bg-stone-50 border border-stone-200 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="all">Any Range</option>
                  <option value="0-10k">0 - 10K</option>
                  <option value="10k-100k">10K - 100K</option>
                  <option value="100k-500k">100K - 500K</option>
                  <option value="500k+">500K+</option>
                </select>
              </div>

              <div className="lg:col-span-4 flex justify-end pt-4 border-t border-stone-100">
                <button
                  onClick={() => setFilters({ platform: 'all', location: 'all', niche: 'all', followerRange: 'all' })}
                  className="text-xs font-bold text-stone-400 hover:text-red-500 flex items-center gap-2 transition-colors"
                >
                  <X size={14} /> Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <p className="text-sm text-stone-500 font-medium">
            Showing <span className="text-stone-900 font-bold">{filteredInfluencers.length}</span> influencers
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-80 bg-stone-100 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : filteredInfluencers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredInfluencers.map((influencer, i) => (
              <InfluencerCard key={influencer.id} influencer={influencer} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-stone-50 rounded-[40px] border-2 border-dashed border-stone-200 space-y-4">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-300">
              <Search size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-stone-900">No matches found</h3>
              <p className="text-stone-500 font-medium">Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
