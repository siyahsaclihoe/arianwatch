import Link from 'next/link';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import SEO from '../components/SEO';
import AnimeCard, { AnimeCardSkeleton } from '../components/AnimeCard';
import HorizontalScroll, { SectionDivider } from '../components/HorizontalScroll';
import AIRecommend from '../components/AIRecommend';
import {
    TrendingUp,
    Sparkles,
    Clock,
    Star,
    Flame,
    Award,
    Play,
    Calendar,
    Heart
} from 'lucide-react';

// Aurora background effect component
function AuroraBackground() {
    return (
        <div className="aurora-bg">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-crimson-500/10 rounded-full filter blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-crimson-900/20 rounded-full filter blur-[100px]" />
        </div>
    );
}

export default function Home() {
    const [popularAnimes, setPopularAnimes] = useState<any[]>([]);
    const [trendingAnimes, setTrendingAnimes] = useState<any[]>([]);
    const [newReleases, setNewReleases] = useState<any[]>([]);
    const [topRated, setTopRated] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [popularRes, trendingRes, newRes, topRes] = await Promise.all([
                    axios.get('http://localhost:4000/api/anime?sort=popularity&limit=15'),
                    axios.get('http://localhost:4000/api/anime?sort=trending&limit=15'),
                    axios.get('http://localhost:4000/api/anime?sort=newest&limit=15'),
                    axios.get('http://localhost:4000/api/anime?sort=rating&limit=10')
                ]);

                setPopularAnimes(popularRes.data);
                setTrendingAnimes(trendingRes.data.length > 0 ? trendingRes.data : popularRes.data);
                setNewReleases(newRes.data.length > 0 ? newRes.data : popularRes.data);
                setTopRated(topRes.data.length > 0 ? topRes.data : popularRes.data);
            } catch (err) {
                console.error("Anime fetch error:", err);
                // Fallback to single request
                try {
                    const res = await axios.get('http://localhost:4000/api/anime?limit=15');
                    setPopularAnimes(res.data);
                    setTrendingAnimes(res.data);
                    setNewReleases(res.data);
                    setTopRated(res.data.slice(0, 10));
                } catch (e) {
                    console.error("Fallback fetch failed:", e);
                }
            }
            setIsLoading(false);
        };
        fetchData();
    }, []);

    // Skeleton array for loading state
    const skeletonArray = Array(8).fill(null);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-gray-100 font-sans relative">
            <SEO
                title="Ana Sayfa"
                description="ArianWatch - Türkçe altyazılı anime izleme platformu. HD kalitede binlerce anime sizi bekliyor."
            />

            {/* Aurora Background */}
            <AuroraBackground />

            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="pl-16 relative z-10">
                {/* Navbar */}
                <Navbar />

                {/* Main */}
                <main className="pt-14">
                    {/* Hero Section */}
                    <Hero />

                    {/* Content Sections */}
                    <div className="px-8 -mt-20 relative z-20 pb-20 space-y-2">

                        {/* Trending Now Section */}
                        <section className="mb-10">
                            <HorizontalScroll
                                title="Trend Animeler"
                                subtitle="Bu hafta en çok izlenenler"
                                icon={<Flame className="w-5 h-5" />}
                            >
                                {isLoading ? (
                                    skeletonArray.map((_, i) => (
                                        <AnimeCardSkeleton key={i} size="md" />
                                    ))
                                ) : (
                                    trendingAnimes.map((anime, index) => (
                                        <div key={anime.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                                            <AnimeCard anime={anime} index={index} showRank={true} />
                                        </div>
                                    ))
                                )}
                            </HorizontalScroll>
                        </section>

                        <SectionDivider />

                        {/* Popular This Season */}
                        <section className="mb-10">
                            <HorizontalScroll
                                title="Popüler Seriler"
                                subtitle="En sevilen anime serileri"
                                icon={<Star className="w-5 h-5" />}
                            >
                                {isLoading ? (
                                    skeletonArray.map((_, i) => (
                                        <AnimeCardSkeleton key={i} size="md" />
                                    ))
                                ) : (
                                    popularAnimes.map((anime, index) => (
                                        <div key={anime.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                                            <AnimeCard anime={anime} index={index} />
                                        </div>
                                    ))
                                )}
                            </HorizontalScroll>
                        </section>

                        <SectionDivider />

                        {/* New Releases */}
                        <section className="mb-10">
                            <HorizontalScroll
                                title="Yeni Eklenenler"
                                subtitle="En son eklenen animeler"
                                icon={<Sparkles className="w-5 h-5" />}
                            >
                                {isLoading ? (
                                    skeletonArray.map((_, i) => (
                                        <AnimeCardSkeleton key={i} size="md" />
                                    ))
                                ) : (
                                    newReleases.map((anime, index) => (
                                        <div key={anime.id} className="flex-shrink-0" style={{ scrollSnapAlign: 'start' }}>
                                            <AnimeCard anime={anime} index={index} />
                                        </div>
                                    ))
                                )}
                            </HorizontalScroll>
                        </section>

                        <SectionDivider />

                        {/* Top 10 Section - Different Layout */}
                        <section className="mb-10">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-yellow-500/10 rounded-lg">
                                    <Award className="w-5 h-5 text-yellow-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <div className="w-1 h-5 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full" />
                                        Top 10 Anime
                                    </h2>
                                    <p className="text-xs text-gray-500 mt-0.5 ml-3">Tüm zamanların en iyileri</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                {isLoading ? (
                                    Array(10).fill(null).map((_, i) => (
                                        <div key={i} className="relative">
                                            <div className="aspect-[2/3] rounded-xl skeleton" />
                                        </div>
                                    ))
                                ) : (
                                    topRated.slice(0, 10).map((anime, index) => (
                                        <Link key={anime.id} href={`/anime/${anime.id}`}>
                                            <div className="group relative cursor-pointer">
                                                {/* Rank Number */}
                                                <div className="absolute -left-2 -bottom-2 z-20">
                                                    <span className={`text-6xl font-black ${index === 0 ? 'text-yellow-400' :
                                                        index === 1 ? 'text-gray-300' :
                                                            index === 2 ? 'text-amber-600' :
                                                                'text-gray-700'
                                                        }`} style={{
                                                            textShadow: '3px 3px 20px rgba(0,0,0,0.9)',
                                                            WebkitTextStroke: index < 3 ? '2px rgba(0,0,0,0.3)' : 'none'
                                                        }}>
                                                        {index + 1}
                                                    </span>
                                                </div>

                                                {/* Card */}
                                                <div className="relative aspect-[2/3] rounded-xl overflow-hidden ml-4 transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-crimson-500/20">
                                                    <img
                                                        src={anime.posterUrl || 'https://via.placeholder.com/300x450'}
                                                        alt={anime.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                                    {/* Play Button */}
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                                        <div className="w-12 h-12 rounded-full bg-crimson-500/90 flex items-center justify-center transform scale-50 group-hover:scale-100 transition-transform">
                                                            <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                                                        </div>
                                                    </div>

                                                    {/* Title */}
                                                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <h3 className="text-sm font-bold text-white truncate">{anime.title}</h3>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                )}
                            </div>
                        </section>

                        <SectionDivider />

                        {/* Quick Links Section */}
                        <section className="mb-10">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Discover Card */}
                                <Link href="/discover">
                                    <div className="group glass-card rounded-2xl p-6 cursor-pointer hover:border-crimson-500/30 transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Sparkles className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">Keşfet</h3>
                                        <p className="text-sm text-gray-500">Yeni animeler bul</p>
                                    </div>
                                </Link>

                                {/* Schedule Card */}
                                <Link href="/schedule">
                                    <div className="group glass-card rounded-2xl p-6 cursor-pointer hover:border-blue-500/30 transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Calendar className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">Yayın Takvimi</h3>
                                        <p className="text-sm text-gray-500">Haftalık program</p>
                                    </div>
                                </Link>

                                {/* Favorites Card */}
                                <Link href="/favorites">
                                    <div className="group glass-card rounded-2xl p-6 cursor-pointer hover:border-pink-500/30 transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                            <Heart className="w-6 h-6 text-white" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-1">İzleme Listem</h3>
                                        <p className="text-sm text-gray-500">Kaydettiğin animeler</p>
                                    </div>
                                </Link>

                                {/* Random Card */}
                                <div
                                    onClick={async () => {
                                        try {
                                            const res = await axios.get('http://localhost:4000/api/anime/random');
                                            if (res.data.id) {
                                                window.location.href = `/anime/${res.data.id}`;
                                            }
                                        } catch (e) {
                                            console.error(e);
                                        }
                                    }}
                                    className="group glass-card rounded-2xl p-6 cursor-pointer hover:border-orange-500/30 transition-all"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-12 transition-transform">
                                        <TrendingUp className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">Rastgele Anime</h3>
                                    <p className="text-sm text-gray-500">Şansını dene</p>
                                </div>
                            </div>
                        </section>

                        {/* Footer */}
                        <footer className="text-center py-10 border-t border-white/[0.03]">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-crimson-500 to-crimson-700 flex items-center justify-center">
                                    <span className="text-white font-bold text-xs">A</span>
                                </div>
                                <span className="text-white font-bold">Arian<span className="text-crimson-400">Watch</span></span>
                            </div>
                            <p className="text-xs text-gray-600">
                                © 2024 ArianWatch. Tüm hakları saklıdır.
                            </p>
                        </footer>
                    </div>
                </main>
            </div>

            {/* AI Recommend Component */}
            <AIRecommend />
        </div>
    );
}
