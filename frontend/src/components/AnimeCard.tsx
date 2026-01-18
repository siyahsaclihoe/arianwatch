import Link from 'next/link';
import { useState, useRef } from 'react';
import { Play, Star, Plus, Check, Clock, Heart } from 'lucide-react';

interface AnimeCardProps {
    anime: {
        id: number;
        title: string;
        posterUrl?: string;
        year?: number;
        genres?: string;
        popularity?: number;
        episodes?: any[];
        rating?: number;
    };
    index?: number;
    size?: 'sm' | 'md' | 'lg';
    showRank?: boolean;
}

export default function AnimeCard({ anime, index = 0, size = 'md', showRank = false }: AnimeCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    // 3D tilt effect
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Reduced intensity for smoother effect
        setRotateY((x - centerX) / 20);
        setRotateX((centerY - y) / 20);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        setRotateX(0);
        setRotateY(0);
    };

    const sizeClasses = {
        sm: 'w-36',
        md: 'w-44',
        lg: 'w-52'
    };

    return (
        <Link href={`/anime/${anime.id}`}>
            <div
                ref={cardRef}
                className={`group relative ${sizeClasses[size]} cursor-pointer`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    animationDelay: `${index * 50}ms`,
                    perspective: '1000px'
                }}
            >
                {/* Rank Badge */}
                {showRank && index < 10 && (
                    <div className="absolute -left-3 top-2 z-30">
                        <div className={`text-4xl font-black ${index === 0 ? 'text-yellow-400' :
                                index === 1 ? 'text-gray-300' :
                                    index === 2 ? 'text-amber-600' :
                                        'text-gray-600'
                            }`} style={{
                                textShadow: '2px 2px 20px rgba(0,0,0,0.8)',
                                WebkitTextStroke: '1px rgba(0,0,0,0.3)'
                            }}>
                            {index + 1}
                        </div>
                    </div>
                )}

                {/* Card Container with 3D Transform */}
                <div
                    className="relative aspect-[2/3] rounded-xl overflow-hidden transition-all duration-300"
                    style={{
                        transform: isHovered
                            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`
                            : 'rotateX(0) rotateY(0) scale(1)',
                        transformStyle: 'preserve-3d'
                    }}
                >
                    {/* Glow Effect */}
                    <div className={`absolute -inset-2 bg-gradient-to-r from-crimson-500/50 to-crimson-700/50 rounded-xl blur-xl transition-opacity duration-500 ${isHovered ? 'opacity-60' : 'opacity-0'}`} />

                    {/* Image Container */}
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-900">
                        {/* Poster Image */}
                        <img
                            src={anime.posterUrl || 'https://via.placeholder.com/300x450?text=No+Image'}
                            alt={anime.title}
                            className={`w-full h-full object-cover transition-all duration-500 ${isHovered ? 'scale-110 brightness-75' : 'scale-100'}`}
                        />

                        {/* Top Gradient */}
                        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/60 to-transparent" />

                        {/* Bottom Gradient */}
                        <div className={`absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent transition-all duration-300 ${isHovered ? 'h-3/4' : 'h-1/3'}`} />

                        {/* Episode Badge */}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-crimson-600/90 backdrop-blur-sm text-[10px] font-bold rounded-lg text-white shadow-lg shadow-crimson-500/30 flex items-center gap-1 z-10">
                            <Play className="w-2.5 h-2.5 fill-current" />
                            {anime.episodes?.length || 0} Bölüm
                        </div>

                        {/* Rating Badge */}
                        {anime.rating && (
                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-[10px] font-bold rounded-lg text-yellow-400 flex items-center gap-1 z-10">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                {anime.rating}
                            </div>
                        )}

                        {/* Play Overlay */}
                        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                            <div className={`w-14 h-14 rounded-full bg-gradient-to-r from-crimson-500 to-crimson-600 flex items-center justify-center shadow-2xl shadow-crimson-500/50 transition-all duration-300 ${isHovered ? 'scale-100' : 'scale-50'}`}>
                                <Play className="w-6 h-6 text-white fill-current ml-1" />
                            </div>
                        </div>

                        {/* Hover Info Panel */}
                        <div className={`absolute bottom-0 left-0 right-0 p-3 transition-all duration-300 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                            {/* Quick Actions */}
                            <div className="flex gap-2 mb-3">
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setIsInWatchlist(!isInWatchlist);
                                    }}
                                    className={`p-2 rounded-full backdrop-blur-sm transition-all ${isInWatchlist
                                            ? 'bg-crimson-500 text-white'
                                            : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    {isInWatchlist ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={(e) => e.preventDefault()}
                                    className="p-2 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all"
                                >
                                    <Heart className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Genre Tags */}
                            {anime.genres && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {anime.genres.split(',').slice(0, 2).map((genre, i) => (
                                        <span key={i} className="text-[9px] px-1.5 py-0.5 bg-white/10 rounded text-white/80">
                                            {genre.trim()}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Meta */}
                            <div className="flex items-center gap-2 text-[10px] text-gray-400">
                                <span className="flex items-center gap-0.5">
                                    <Clock className="w-3 h-3" />
                                    {anime.year || 'N/A'}
                                </span>
                                {anime.popularity && (
                                    <span className="flex items-center gap-0.5">
                                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                        {anime.popularity}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Shine Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent transition-opacity duration-300 pointer-events-none rounded-xl ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                </div>

                {/* Title */}
                <div className="mt-3 px-1">
                    <h3 className={`text-sm font-semibold text-gray-200 group-hover:text-crimson-400 transition-colors truncate`}>
                        {anime.title}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        {anime.year} {anime.genres && `• ${anime.genres.split(',')[0]}`}
                    </p>
                </div>
            </div>
        </Link>
    );
}

// Skeleton Loading Card
export function AnimeCardSkeleton({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-36',
        md: 'w-44',
        lg: 'w-52'
    };

    return (
        <div className={`${sizeClasses[size]}`}>
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden skeleton" />
            <div className="mt-3 px-1 space-y-2">
                <div className="h-4 w-3/4 skeleton rounded" />
                <div className="h-3 w-1/2 skeleton rounded" />
            </div>
        </div>
    );
}
