import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Play, ChevronRight, ChevronLeft, Star, Clock, Tv, Sparkles, Volume2, VolumeX } from 'lucide-react';

// Floating particles component
function FloatingParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full"
                    style={{
                        width: `${2 + Math.random() * 4}px`,
                        height: `${2 + Math.random() * 4}px`,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        background: i % 3 === 0
                            ? 'rgba(220, 38, 38, 0.4)'
                            : 'rgba(255, 255, 255, 0.1)',
                        animation: `particle-float ${10 + Math.random() * 20}s linear infinite`,
                        animationDelay: `${Math.random() * 10}s`,
                    }}
                />
            ))}
        </div>
    );
}

export default function Hero() {
    const [slides, setSlides] = useState<any[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const activeSlide = slides[activeIndex];

    useEffect(() => {
        axios.get('http://localhost:4000/api/hero')
            .then(res => {
                if (res.data.length > 0) {
                    setSlides(res.data);
                    setTimeout(() => setIsLoaded(true), 100);
                }
            })
            .catch(err => console.error("Slider fetch failed", err));
    }, []);

    // Auto-play carousel
    useEffect(() => {
        if (slides.length > 1) {
            intervalRef.current = setInterval(() => {
                setActiveIndex(prev => (prev + 1) % slides.length);
            }, 8000);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [slides.length]);

    const goToSlide = (index: number) => {
        setActiveIndex(index);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = setInterval(() => {
                setActiveIndex(prev => (prev + 1) % slides.length);
            }, 8000);
        }
    };

    const nextSlide = () => goToSlide((activeIndex + 1) % slides.length);
    const prevSlide = () => goToSlide((activeIndex - 1 + slides.length) % slides.length);

    // Default state when no slides
    if (!activeSlide) {
        return (
            <div className="relative w-full h-[90vh] overflow-hidden">
                {/* Animated Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-crimson-950 via-dark-bg to-dark-bg" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-crimson-900/30 via-transparent to-transparent animate-pulse" />
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-crimson-950/40 via-transparent to-transparent" />
                </div>

                <FloatingParticles />

                {/* Content */}
                <div className="relative z-20 h-full flex flex-col justify-center px-12 max-w-4xl pt-20">
                    <div className="animate-slide-up">
                        <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="w-5 h-5 text-crimson-400 animate-bounce-soft" />
                            <span className="text-crimson-400 text-sm font-medium uppercase tracking-widest">Hoş Geldiniz</span>
                        </div>
                        <h1 className="text-7xl font-black text-white mb-4 leading-tight">
                            Arian<span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson-400 to-crimson-600 animate-glow-pulse">Watch</span>
                        </h1>
                        <p className="text-gray-400 text-xl mb-8 max-w-xl">
                            En sevdiğiniz animeleri HD kalitede, Türkçe altyazılı izleyin. Binlerce anime sizi bekliyor.
                        </p>
                        <div className="flex gap-4">
                            <Link href="/discover">
                                <button className="px-8 py-4 bg-gradient-to-r from-crimson-600 to-crimson-700 hover:from-crimson-500 hover:to-crimson-600 text-white rounded-xl transition-all font-semibold shadow-lg shadow-crimson-500/30 hover:shadow-crimson-500/50 hover:scale-105 flex items-center gap-2 group">
                                    <Play className="w-5 h-5 fill-current group-hover:animate-bounce-soft" />
                                    Keşfetmeye Başla
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="relative w-full h-[90vh] overflow-hidden">
            {/* Background Image with Parallax */}
            <div className="absolute inset-0 z-0">
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-out ${index === activeIndex
                            ? 'opacity-100 scale-100'
                            : 'opacity-0 scale-105'
                            }`}
                    >
                        <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="w-full h-full object-cover object-center"
                        />
                    </div>
                ))}

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-crimson-950/40 via-transparent to-transparent" />

                {/* Vignette Effect */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(10,10,10,0.3)_100%)]" />
            </div>

            {/* Floating Particles */}
            <FloatingParticles />

            {/* Content Layer */}
            <div className="relative z-20 h-full flex flex-col justify-center px-12 pt-20">
                <div className="max-w-3xl">
                    {/* Category Badge */}
                    <div className={`flex items-center gap-3 mb-4 transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <span className="px-3 py-1 bg-crimson-500/20 border border-crimson-500/40 rounded-full text-crimson-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3" />
                            Öne Çıkan
                        </span>
                        {activeSlide.anime?.rating && (
                            <span className="flex items-center gap-1 text-yellow-400 text-sm">
                                <Star className="w-4 h-4 fill-current" />
                                {activeSlide.anime.rating}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1
                        className={`text-6xl font-black text-white mb-4 leading-tight transition-all duration-700 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        style={{ textShadow: '0 4px 30px rgba(0,0,0,0.5)' }}
                    >
                        {activeSlide.title}
                    </h1>

                    {/* Meta Info */}
                    <div className={`flex items-center gap-4 mb-4 text-gray-400 text-sm transition-all duration-700 delay-150 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {activeSlide.anime?.year && (
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {activeSlide.anime.year}
                            </span>
                        )}
                        {activeSlide.anime?.episodes?.length > 0 && (
                            <span className="flex items-center gap-1">
                                <Tv className="w-4 h-4" />
                                {activeSlide.anime.episodes.length} Bölüm
                            </span>
                        )}
                        {activeSlide.anime?.genres && (
                            <span className="text-crimson-400">
                                {activeSlide.anime.genres.split(',').slice(0, 2).join(' • ')}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className={`text-gray-300 text-lg mb-8 line-clamp-3 max-w-2xl transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {activeSlide.description}
                    </p>

                    {/* Action Buttons */}
                    <div className={`flex gap-4 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {activeSlide.animeId && (
                            <Link href={`/anime/${activeSlide.animeId}`}>
                                <button className="group relative px-8 py-4 bg-gradient-to-r from-crimson-600 to-crimson-700 text-white rounded-xl transition-all font-semibold shadow-lg shadow-crimson-500/30 hover:shadow-crimson-500/50 hover:scale-105 flex items-center gap-2 overflow-hidden">
                                    {/* Shimmer Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                                    <Play className="w-5 h-5 fill-current relative z-10" />
                                    <span className="relative z-10">Şimdi İzle</span>
                                </button>
                            </Link>
                        )}
                        <Link href="/discover">
                            <button className="group px-8 py-4 glass-button text-white rounded-xl transition-all font-semibold flex items-center gap-2 hover:scale-105">
                                Keşfet
                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </Link>

                        {/* Mute Button */}
                        <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-4 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all"
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Carousel Navigation */}
                {slides.length > 1 && (
                    <div className="absolute bottom-8 left-12 right-12 flex items-center justify-between">
                        {/* Carousel Thumbnails */}
                        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                            {slides.map((slide, index) => (
                                <button
                                    key={slide.id}
                                    onClick={() => goToSlide(index)}
                                    className={`relative flex-shrink-0 w-48 h-28 rounded-xl overflow-hidden transition-all duration-500 group ${activeIndex === index
                                        ? 'ring-2 ring-crimson-500 scale-105 shadow-lg shadow-crimson-500/30'
                                        : 'ring-1 ring-white/10 opacity-60 hover:opacity-100 hover:ring-white/30'
                                        }`}
                                >
                                    <img
                                        src={slide.imageUrl}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                    {/* Title */}
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <span className="text-white text-xs font-bold truncate block drop-shadow-lg">
                                            {slide.title}
                                        </span>
                                    </div>

                                    {/* Play Icon Overlay */}
                                    {activeIndex !== index && (
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <div className="w-10 h-10 rounded-full bg-crimson-500/80 flex items-center justify-center">
                                                <Play className="w-4 h-4 text-white fill-current" />
                                            </div>
                                        </div>
                                    )}

                                    {/* Active Overlay */}
                                    {activeIndex === index && (
                                        <div className="absolute inset-0 bg-crimson-500/10" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <div className="flex gap-2 ml-4">
                            <button
                                onClick={prevSlide}
                                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={nextSlide}
                                className="p-3 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Progress Bar */}
                {slides.length > 1 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                        <div
                            className="h-full bg-gradient-to-r from-crimson-500 to-crimson-600 transition-all duration-300"
                            style={{ width: `${((activeIndex + 1) / slides.length) * 100}%` }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
