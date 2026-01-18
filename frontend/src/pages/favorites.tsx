import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Heart, X, PlayCircle, Tv, Loader2, Trash2 } from 'lucide-react';

const tabs = [
    { id: 'all', label: 'Tümü', status: null },
    { id: 'watching', label: 'İzliyorum', status: 'WATCHING' },
    { id: 'completed', label: 'Tamamlandı', status: 'COMPLETED' },
    { id: 'planned', label: 'Planlanan', status: 'PLAN_TO_WATCH' },
    { id: 'dropped', label: 'Bırakılan', status: 'DROPPED' },
];

export default function Favorites() {
    const { user, token } = useAuth();
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');

    useEffect(() => {
        if (token) {
            loadWatchlist();
        } else {
            setIsLoading(false);
        }
    }, [token]);

    const loadWatchlist = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:4000/api/user/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWatchlist(res.data.watchList || []);
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    const handleRemove = async (animeId: string) => {
        if (!confirm('Bu animeyi listenden kaldırmak istediğinden emin misin?')) return;

        try {
            await axios.post('http://localhost:4000/api/user/watchlist', {
                animeId,
                status: 'REMOVED'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setWatchlist(prev => prev.filter(item => item.animeId !== animeId));
        } catch (e) {
            alert('Kaldırılamadı!');
        }
    };

    const filteredList = watchlist.filter(item => {
        if (activeTab === 'all') return item.status !== 'REMOVED';
        const tab = tabs.find(t => t.id === activeTab);
        return tab?.status === item.status;
    });

    const getStatusLabel = (status: string) => {
        const statusMap: any = {
            'WATCHING': 'İzleniyor',
            'COMPLETED': 'Tamamlandı',
            'PLAN_TO_WATCH': 'Planlandı',
            'DROPPED': 'Bırakıldı'
        };
        return statusMap[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colorMap: any = {
            'WATCHING': 'text-blue-400 bg-blue-500/20 border-blue-500/30',
            'COMPLETED': 'text-green-400 bg-green-500/20 border-green-500/30',
            'PLAN_TO_WATCH': 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30',
            'DROPPED': 'text-gray-400 bg-gray-500/20 border-gray-500/30'
        };
        return colorMap[status] || 'text-gray-400 bg-gray-500/20';
    };

    return (
        <Layout>
            <div className="p-8 pt-24 min-h-screen">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-crimson-600 flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white fill-white" />
                            </div>
                            İzleme Listem
                        </h1>
                        <p className="text-gray-500">
                            {user ? `${filteredList.length} anime listeleniyor` : 'Listeni görmek için giriş yap'}
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-1 glass rounded-xl p-1 overflow-x-auto">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-sm px-4 py-2 rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id
                                        ? 'bg-crimson-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </header>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-crimson-500 animate-spin" />
                    </div>
                )}

                {/* Not Logged In */}
                {!isLoading && !user && (
                    <div className="text-center py-20 glass-card rounded-2xl">
                        <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">İzleme listeni görmek için giriş yapmalısın.</p>
                        <Link href="/">
                            <button className="px-6 py-2 bg-crimson-600 text-white rounded-xl font-medium hover:bg-crimson-700 transition-all">
                                Ana Sayfa
                            </button>
                        </Link>
                    </div>
                )}

                {/* Watchlist Grid */}
                {!isLoading && user && filteredList.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredList.map((item) => (
                            <div key={item.animeId} className="glass-card rounded-2xl overflow-hidden flex group relative">
                                <Link href={`/anime/${item.animeId}`} className="w-24 h-32 shrink-0 relative">
                                    <img
                                        src={item.anime?.posterUrl || 'https://via.placeholder.com/200x300?text=No+Image'}
                                        className="w-full h-full object-cover"
                                        alt={item.anime?.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-dark-bg/50"></div>
                                </Link>
                                <div className="flex flex-col justify-center px-4 flex-1 py-3">
                                    <Link href={`/anime/${item.animeId}`}>
                                        <h3 className="font-bold text-white mb-1 group-hover:text-crimson-400 transition-colors line-clamp-1">
                                            {item.anime?.title || 'Yükleniyor...'}
                                        </h3>
                                    </Link>
                                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                        <Tv className="w-3 h-3" />
                                        <span>{item.anime?.episodes?.length || '?'} Bölüm</span>
                                    </div>

                                    {/* Status Badge */}
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border w-fit ${getStatusColor(item.status)}`}>
                                        {getStatusLabel(item.status)}
                                    </span>

                                    {/* Progress Bar */}
                                    {item.progress > 0 && item.anime?.episodes?.length > 0 && (
                                        <div className="mt-2">
                                            <div className="w-full h-1.5 bg-black/30 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-crimson-600 to-crimson-500 rounded-full transition-all"
                                                    style={{ width: `${(item.progress / item.anime.episodes.length) * 100}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-[10px] text-crimson-400 mt-1 block text-right font-medium">
                                                {item.progress}/{item.anime.episodes.length} İzlendi
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Remove Button */}
                                <button
                                    onClick={() => handleRemove(item.animeId)}
                                    className="absolute top-2 right-2 p-2 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-lg text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                    title="Listeden Kaldır"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && user && filteredList.length === 0 && (
                    <div className="text-center py-20 glass-card rounded-2xl">
                        <Heart className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500 mb-4">
                            {activeTab === 'all'
                                ? 'Henüz izleme listene anime eklemedin.'
                                : 'Bu kategoride anime bulunamadı.'
                            }
                        </p>
                        <Link href="/discover">
                            <button className="px-6 py-2 bg-crimson-600 text-white rounded-xl font-medium hover:bg-crimson-700 transition-all">
                                Keşfet
                            </button>
                        </Link>
                    </div>
                )}
            </div>
        </Layout>
    );
}
