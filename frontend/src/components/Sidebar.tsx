import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import {
    Home,
    Compass,
    Calendar,
    Heart,
    Settings,
    Play,
    TrendingUp,
    Clock,
    Award
} from 'lucide-react';

const NAV_ITEMS = [
    { href: '/', icon: Home, label: 'Ana Sayfa', color: 'from-rose-500 to-red-600' },
    { href: '/discover', icon: Compass, label: 'Keşfet', color: 'from-purple-500 to-indigo-600' },
    { href: '/schedule', icon: Calendar, label: 'Takvim', color: 'from-blue-500 to-cyan-600' },
    { href: '/favorites', icon: Heart, label: 'Listem', color: 'from-pink-500 to-rose-600' },
    { href: '/settings', icon: Settings, label: 'Ayarlar', color: 'from-gray-400 to-gray-600' },
];

// Floating particles component
function FloatingParticles() {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-crimson-500/30 rounded-full"
                    style={{
                        left: `${20 + (i * 10)}%`,
                        animationDelay: `${i * 2}s`,
                        animation: `particle-float ${15 + i * 2}s linear infinite`,
                    }}
                />
            ))}
        </div>
    );
}

export default function Sidebar() {
    const router = useRouter();
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const isActive = (path: string) => router.pathname === path;

    return (
        <div
            className={`fixed left-0 top-0 h-full bg-[#0a0a0a]/95 backdrop-blur-2xl border-r border-white/[0.03] flex flex-col items-center py-5 z-50 transition-all duration-500 ease-out ${isExpanded ? 'w-56' : 'w-16'}`}
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            {/* Particles Background */}
            <FloatingParticles />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-crimson-950/20 via-transparent to-crimson-950/10 pointer-events-none" />

            {/* Animated Logo */}
            <Link href="/" className="mb-8 group relative z-10">
                <div className="relative">
                    {/* Glow Ring */}
                    <div className="absolute -inset-2 bg-gradient-to-r from-crimson-500 to-crimson-700 rounded-xl opacity-0 group-hover:opacity-50 blur-lg transition-all duration-500" />

                    {/* Logo Container */}
                    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-500 via-crimson-600 to-crimson-700 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg shadow-crimson-500/20 group-hover:shadow-crimson-500/40">
                        {/* Inner Shine */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/10 to-white/20" />

                        {/* Logo Letter */}
                        <span className="text-white font-black text-lg relative z-10 group-hover:animate-bounce-soft">A</span>

                        {/* Play Icon Overlay on Hover */}
                        <Play className="absolute w-4 h-4 text-white/0 group-hover:text-white/80 transition-all duration-300 fill-current" />
                    </div>
                </div>

                {/* Brand Name (Expanded) */}
                {isExpanded && (
                    <div className="absolute left-14 top-1/2 -translate-y-1/2 whitespace-nowrap animate-fade-in">
                        <span className="text-white font-bold text-lg">Arian</span>
                        <span className="text-crimson-400 font-bold text-lg">Watch</span>
                    </div>
                )}
            </Link>

            {/* Navigation */}
            <nav className="flex flex-col gap-2 flex-1 w-full px-3 relative z-10">
                {NAV_ITEMS.map((item, index) => {
                    const Icon = item.icon;
                    const active = isActive(item.href);
                    const hovered = hoveredItem === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="group relative"
                            onMouseEnter={() => setHoveredItem(item.href)}
                            onMouseLeave={() => setHoveredItem(null)}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            {/* Active/Hover Background */}
                            <div className={`absolute inset-0 rounded-xl transition-all duration-300 ${active
                                ? 'bg-gradient-to-r from-crimson-500/20 to-crimson-600/10 shadow-lg shadow-crimson-500/10'
                                : hovered
                                    ? 'bg-white/[0.05]'
                                    : ''
                                }`} />

                            {/* Neon Border for Active */}
                            {active && (
                                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-crimson-400 via-crimson-500 to-crimson-600 rounded-full shadow-lg shadow-crimson-500/50 animate-glow-pulse" />
                            )}

                            {/* Content */}
                            <div className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ${active
                                ? 'text-crimson-400'
                                : 'text-gray-500 hover:text-white'
                                }`}>
                                {/* Icon with Animation */}
                                <div className={`relative transition-transform duration-300 ${hovered ? 'scale-110 -rotate-6' : ''}`}>
                                    <Icon
                                        className={`w-5 h-5 transition-all duration-300`}
                                        strokeWidth={active ? 2.5 : 2}
                                    />

                                    {/* Icon Glow */}
                                    {(active || hovered) && (
                                        <div className={`absolute inset-0 blur-md opacity-50 bg-gradient-to-r ${item.color}`} />
                                    )}
                                </div>

                                {/* Label (Expanded) */}
                                {isExpanded && (
                                    <span className={`text-sm font-medium whitespace-nowrap animate-fade-in ${active ? 'text-crimson-400' : ''
                                        }`}>
                                        {item.label}
                                    </span>
                                )}
                            </div>

                            {/* Tooltip (Collapsed) */}
                            {!isExpanded && (
                                <div className={`absolute left-16 top-1/2 -translate-y-1/2 px-3 py-2 bg-[#1a1a1a]/95 backdrop-blur-xl text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none transition-all duration-300 whitespace-nowrap border border-white/10 shadow-xl ${hovered ? 'opacity-100 translate-x-0' : '-translate-x-2'
                                    }`}>
                                    {item.label}

                                    {/* Tooltip Arrow */}
                                    <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1a1a1a]/95 border-l border-b border-white/10 rotate-45" />
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom Section - Quick Stats (Expanded) */}
            {isExpanded && (
                <div className="w-full px-3 mb-4 animate-fade-in relative z-10">
                    <div className="bg-gradient-to-br from-crimson-950/50 to-crimson-900/30 rounded-xl p-3 border border-crimson-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 text-crimson-400" />
                            <span className="text-xs text-gray-400">Bu Hafta</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3 text-gray-500" />
                                <span className="text-gray-400">12 saat</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Award className="w-3 h-3 text-yellow-500" />
                                <span className="text-gray-400">5 anime</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Version Badge */}
            <div className={`relative z-10 transition-all duration-300 ${isExpanded ? 'px-3 w-full' : ''}`}>
                <div className={`flex items-center justify-center gap-2 py-2 ${isExpanded ? 'bg-white/[0.02] rounded-lg' : ''}`}>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    {isExpanded && (
                        <span className="text-[10px] text-gray-500 animate-fade-in">v2.0 Beta</span>
                    )}
                </div>
            </div>
        </div>
    );
}
