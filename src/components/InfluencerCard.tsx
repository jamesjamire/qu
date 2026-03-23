import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Youtube, TrendingUp, Users, Activity, MapPin, Star } from 'lucide-react';
import { motion } from 'motion/react';

interface Influencer {
  id: string;
  name: string;
  handle: string;
  platform: 'instagram' | 'youtube';
  followerCount: number;
  engagementRate: number;
  score: number;
  avatarUrl: string;
  location: string;
  niche: string[];
}

interface InfluencerCardProps {
  influencer: Influencer;
  index: number;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};

export default function InfluencerCard({ influencer, index }: InfluencerCardProps) {
  const PlatformIcon = influencer.platform === 'instagram' ? Instagram : Youtube;
  const platformColor = influencer.platform === 'instagram' ? 'text-pink-600' : 'text-red-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative bg-white rounded-2xl border border-stone-200 p-5 hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="relative">
          <img
            src={influencer.avatarUrl || `https://picsum.photos/seed/${influencer.handle}/200/200`}
            alt={influencer.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-stone-100 group-hover:scale-105 transition-transform"
            referrerPolicy="no-referrer"
          />
          <div className={`absolute -bottom-2 -right-2 p-1.5 bg-white rounded-lg shadow-sm border border-stone-100 ${platformColor}`}>
            <PlatformIcon size={14} />
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-100">
            <Star size={12} fill="currentColor" />
            {influencer.score.toFixed(0)}
          </div>
          <span className="text-[10px] text-stone-400 uppercase tracking-widest mt-1 font-bold">AI Rank</span>
        </div>
      </div>

      <div className="space-y-1 mb-4">
        <h3 className="font-bold text-stone-900 group-hover:text-emerald-700 transition-colors leading-tight">
          {influencer.name}
        </h3>
        <p className="text-sm text-stone-500 font-medium">@{influencer.handle}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Users size={12} />
            <span className="text-[10px] uppercase font-bold tracking-wider">Followers</span>
          </div>
          <p className="text-sm font-bold text-stone-800">{formatNumber(influencer.followerCount)}</p>
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-stone-400">
            <Activity size={12} />
            <span className="text-[10px] uppercase font-bold tracking-wider">Engagement</span>
          </div>
          <p className="text-sm font-bold text-stone-800">{influencer.engagementRate}%</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {influencer.niche.slice(0, 2).map((tag) => (
          <span key={tag} className="px-2 py-0.5 bg-stone-100 text-stone-600 rounded-md text-[10px] font-bold uppercase tracking-wider">
            {tag}
          </span>
        ))}
        {influencer.niche.length > 2 && (
          <span className="px-2 py-0.5 bg-stone-50 text-stone-400 rounded-md text-[10px] font-bold">
            +{influencer.niche.length - 2}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-stone-100">
        <div className="flex items-center gap-1 text-stone-400 text-xs font-medium">
          <MapPin size={12} />
          {influencer.location}
        </div>
        <Link
          to={`/influencer/${influencer.id}`}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 group/btn"
        >
          View Profile
          <TrendingUp size={12} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}
