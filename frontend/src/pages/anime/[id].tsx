import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import Comments from '../../components/Comments';
import WatchStatus from '../../components/WatchStatus';
import VideoPlayer from '../../components/VideoPlayer';
import { useAuth } from '../../context/AuthContext';
import { Play, Calendar, Tag, TrendingUp, Search, Clock, Loader2 } from 'lucide-react';

export default function AnimeWatch() {
    const router = useRouter();
    const { id } = router.query;
    const { token } = useAuth();
    const [anime, setAnime] = useState<any>(null);
    const [currentEp, setCurrentEp] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const progressInterval = useRef<any>(null);

    useEffect(() => {
        if (id) loadAnime();
        return () => clearInterval(progressInterval.current);
    }, [id]);

    useEffect(() => {
        if (currentEp && token) {
            clearInterval(progressInterval.current);
            progressInterval.current = setInterval(() => {
                saveProgress();
            }, 30000);
        }
    }, [currentEp, token]);

    const loadAnime = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/api/anime/${id}`);
            setAnime(res.data);
            if (res.data.episodes?.length > 0) {
                setCurrentEp(res.data.episodes[0]);
            }
        } catch (e) { console.error(e); }
    };

    const saveProgress = async () => {
        if (!currentEp) return;
        try {
            await axios.post('http://localhost:4000/api/history/progress', {
                animeId: id,
                progress: 0.5
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (e) { console.error("Failed to save progress"); }
    };

    const filteredEpisodes = anime?.episodes?.filter((ep: any) =>
        ep.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ep.number.toString().includes(searchQuery)
    );

    if (!anime) return (
        <div className="min-h-screen bg-dark-bg flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-crimson-500 animate-spin" />
        </div>
    );

    return (
        <Layout noNavbar>
            <div className="flex flex-col lg:flex-row min-h-screen bg-dark-bg">
                {/* Left: Player Section */}
                <div className="flex-1 lg:mr-96">
                    {/* Video Player with Intro Skip */}
                    {currentEp ? (
                        <VideoPlayer
                            embedUrl={currentEp.embedUrl}
                            introStart={currentEp.introStart}
                            introEnd={currentEp.introEnd}
                            title={currentEp.title || `Bölüm ${currentEp.number}`}
                            episodeNumber={currentEp.number}
                        />
                    ) : (
                        <div className="w-full aspect-video bg-black flex items-center justify-center text-gray-500 flex-col gap-2">
                            <Play className="w-12 h-12 opacity-30" />
                            Video kaynağı bulunamadı veya seçim yapılmadı.
                        </div>
                    )}

                    {/* Video Info */}
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-white mb-2">{anime.title}</h1>
                                <h2 className="text-lg text-gray-400 flex items-center gap-2">
                                    <Play className="w-4 h-4 text-crimson-500" />
                                    Bölüm {currentEp?.number}: {currentEp?.title || `Episode ${currentEp?.number}`}
                                </h2>
                            </div>
                            <WatchStatus animeId={anime.id} onUpdate={() => { }} />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-6 glass-card p-4 rounded-xl">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" /> {anime.year}
                            </span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="flex items-center gap-1">
                                <Tag className="w-4 h-4" /> {anime.genres}
                            </span>
                            <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                            <span className="flex items-center gap-1 text-crimson-400">
                                <TrendingUp className="w-4 h-4" /> {anime.popularity} Popülerlik
                            </span>
                        </div>

                        {/* Synopsis */}
                        {anime.synopsis && (
                            <div className="glass-card p-4 rounded-xl mb-6">
                                <h3 className="font-bold text-white mb-2">Özet</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{anime.synopsis}</p>
                            </div>
                        )}

                        <Comments animeId={anime.id} />
                    </div>
                </div>

                {/* Right: Episodes Sidebar */}
                <div className="lg:w-96 lg:fixed lg:right-0 lg:top-0 lg:h-full glass border-l border-white/5 flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-white/10">
                        <h2 className="font-bold text-white mb-3 flex items-center gap-2">
                            <Play className="w-4 h-4 text-crimson-500" />
                            Bölümler ({anime.episodes?.length || 0})
                        </h2>
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Bölüm ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-black/30 text-sm p-2.5 pl-10 rounded-xl border border-white/10 text-white outline-none focus:border-crimson-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Episodes List */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-2">
                        {(filteredEpisodes || anime.episodes)?.map((ep: any) => (
                            <div
                                key={ep.id}
                                onClick={() => setCurrentEp(ep)}
                                className={`flex gap-3 p-2 rounded-xl cursor-pointer transition-all ${currentEp?.id === ep.id
                                    ? 'bg-crimson-500/20 border border-crimson-500/50 shadow-lg shadow-crimson-500/10'
                                    : 'hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <div className="w-24 h-14 bg-gray-800 rounded-lg overflow-hidden relative shrink-0">
                                    <img
                                        src={anime.posterUrl || `https://source.unsplash.com/random/100x60?anime&sig=${ep.number}`}
                                        className="w-full h-full object-cover"
                                    />
                                    {currentEp?.id === ep.id && (
                                        <div className="absolute inset-0 bg-crimson-500/30 flex items-center justify-center">
                                            <Play className="w-6 h-6 text-white fill-white" />
                                        </div>
                                    )}
                                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[10px] text-white flex items-center gap-0.5">
                                        <Clock className="w-2.5 h-2.5" /> 24:00
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className={`text-sm font-medium truncate ${currentEp?.id === ep.id ? 'text-crimson-400' : 'text-gray-300'}`}>
                                        Bölüm {ep.number}
                                    </h4>
                                    <p className="text-xs text-gray-500 truncate">{ep.title || 'Başlıksız'}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout >
    );
}
