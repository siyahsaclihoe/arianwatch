import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import axios from 'axios';
import Link from 'next/link';
import { Search, Filter, SortDesc, PlayCircle, Star, Loader2, Frown } from 'lucide-react';

const GENRES = ["Action", "Adventure", "Comedy", "Drama", "Fantasy", "Horror", "Mecha", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural"];

export default function Discover() {
    const [animes, setAnimes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        genre: '',
        year: '',
        sort: 'popularity'
    });

    useEffect(() => {
        fetchAnimes();
    }, [filters]);

    const fetchAnimes = async () => {
        setIsLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.search) params.append('search', filters.search);
            if (filters.genre) params.append('genre', filters.genre);
            if (filters.year) params.append('year', filters.year);
            if (filters.sort) params.append('sort', filters.sort);

            const res = await axios.get(`http://localhost:4000/api/anime?${params.toString()}`);
            setAnimes(res.data);
        } catch (e) { console.error(e); }
        setIsLoading(false);
    };

    return (
        <Layout>
            <div className="p-8 pt-24 min-h-screen">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-crimson-600 flex items-center justify-center">
                                <Search className="w-5 h-5 text-white" />
                            </div>
                            Keşfet
                        </h1>
                        <p className="text-gray-500">Yeni favori animeni bul.</p>
                    </div>

                    {/* Filters Bar */}
                    <div className="flex gap-3 flex-wrap glass-card p-4 rounded-2xl items-center">
                        <div className="relative">
                            <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Anime ara..."
                                className="bg-black/30 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white outline-none focus:border-crimson-500 transition-colors w-48"
                                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            />
                        </div>

                        <div className="relative">
                            <Filter className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                                className="bg-black/30 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-white outline-none appearance-none focus:border-crimson-500 transition-colors"
                                onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                            >
                                <option value="">Tüm Türler</option>
                                {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                        </div>

                        <input
                            type="number"
                            placeholder="Yıl"
                            className="bg-black/30 border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none w-24 focus:border-crimson-500 transition-colors"
                            onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                        />

                        <div className="relative">
                            <SortDesc className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                                className="bg-black/30 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-white outline-none appearance-none focus:border-crimson-500 transition-colors"
                                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                            >
                                <option value="popularity">En Popüler</option>
                                <option value="newest">En Yeni</option>
                                <option value="oldest">En Eski</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-crimson-500 animate-spin" />
                    </div>
                )}

                {/* Grid Results */}
                {!isLoading && (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {animes.map((anime: any) => (
                            <Link href={`/anime/${anime.id}`} key={anime.id} className="group relative">
                                <div className="aspect-[2/3] rounded-xl overflow-hidden mb-3 glass-card !p-0">
                                    <img
                                        src={anime.posterUrl || 'https://via.placeholder.com/300x450'}
                                        alt={anime.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs font-bold text-yellow-400 flex items-center gap-1">
                                        <Star className="w-3 h-3 fill-current" /> {anime.popularity}
                                    </div>

                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                                        <div className="w-12 h-12 rounded-full bg-crimson-600/90 flex items-center justify-center shadow-lg scale-75 group-hover:scale-100 transition-transform">
                                            <PlayCircle className="w-6 h-6 text-white fill-current" />
                                        </div>
                                    </div>
                                </div>
                                <h3 className="text-white font-medium truncate group-hover:text-crimson-400 transition-colors">{anime.title}</h3>
                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                    {anime.year} • <PlayCircle className="w-3 h-3" /> {anime.episodes?.length || '?'} Bölüm
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {!isLoading && animes.length === 0 && (
                    <div className="text-center py-20 glass-card rounded-2xl">
                        <Frown className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-500">Aradığınız kriterlere uygun anime bulunamadı.</p>
                    </div>
                )}
            </div>
        </Layout>
    );
}
