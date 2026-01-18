import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import {
    Search,
    Bell,
    Shuffle,
    X,
    User,
    Settings,
    LogOut,
    ChevronDown,
    Sparkles,
    Command,
    TrendingUp,
    Clock,
    Star,
    Play,
    Heart
} from 'lucide-react';

import AuthModal from './AuthModal';

// Search suggestion type
interface SearchSuggestion {
    id: number;
    title: string;
    posterUrl?: string;
    year?: number;
}

export default function Navbar() {
    const router = useRouter();
    const { user, token, logout } = useAuth();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifs, setShowNotifs] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (token) fetchNotifications();
    }, [token]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            setShowNotifs(false);
            setShowProfileMenu(false);
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Search suggestions
    useEffect(() => {
        if (searchQuery.length > 1) {
            const timer = setTimeout(async () => {
                try {
                    const res = await api.get(`/api/anime?search=${searchQuery}&limit=5`);
                    setSuggestions(res.data);
                    setShowSuggestions(true);
                } catch (e) {
                    console.error(e);
                }
            }, 300);
            return () => clearTimeout(timer);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    }, [searchQuery]);

    const fetchNotifications = async () => {
        try {
            const res = await api.get('/api/notifications');
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch (e) {
            console.error(e);
        }
    };

    const handleRead = async (n: any) => {
        try {
            await api.put(`/api/notifications/${n.id}/read`);
            fetchNotifications();
            if (n.link) router.push(n.link);
        } catch (e) { }
    };

    const handleRandom = async () => {
        try {
            const res = await api.get('/api/anime/random');
            if (res.data.id) {
                router.push(`/anime/${res.data.id}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/discover?search=${encodeURIComponent(searchQuery)}`);
            setShowSuggestions(false);
        }
    };

    return (
        <>
            {/* Navbar Container */}
            <div className="fixed top-0 left-16 right-0 z-40">
                {/* Gradient Border Bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-crimson-500/30 to-transparent" />

                {/* Main Navbar */}
                <div className="flex items-center justify-between px-6 py-3 bg-[#0a0a0a]/80 backdrop-blur-2xl border-b border-white/[0.03]">

                    {/* Left - Brand */}
                    <div className="flex items-center gap-3">
                        <span className="text-white/90 text-sm font-semibold tracking-tight">
                            Arian<span className="text-crimson-400">Watch</span>
                        </span>
                        <span className="text-[10px] font-bold text-crimson-400 bg-gradient-to-r from-crimson-500/20 to-crimson-600/10 px-2 py-0.5 rounded-full border border-crimson-500/30 animate-glow-pulse">
                            BETA
                        </span>
                    </div>

                    {/* Center - Search */}
                    <div className="flex-1 max-w-xl mx-8" ref={searchRef} onClick={(e) => e.stopPropagation()}>
                        <form onSubmit={handleSearch}>
                            <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-[1.02]' : ''}`}>
                                {/* Search Glow */}
                                {searchFocused && (
                                    <div className="absolute -inset-1 bg-gradient-to-r from-crimson-500/20 via-crimson-600/10 to-crimson-500/20 rounded-xl blur-lg opacity-50 animate-pulse" />
                                )}

                                <div className="relative flex items-center gap-2">
                                    {/* Search Input Container */}
                                    <div className="relative flex-1">
                                        <Search className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${searchFocused ? 'text-crimson-400 scale-110' : 'text-gray-600'}`} />
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Anime, karakter veya tür ara..."
                                            onFocus={() => setSearchFocused(true)}
                                            onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                                            className={`w-full bg-white/[0.03] border text-white text-sm rounded-xl px-4 py-2.5 pl-11 pr-20 focus:outline-none transition-all duration-300 placeholder:text-gray-600 ${searchFocused
                                                ? 'border-crimson-500/50 bg-white/[0.06] shadow-lg shadow-crimson-500/10'
                                                : 'border-white/[0.05] hover:border-white/[0.1]'
                                                }`}
                                        />

                                        {/* Keyboard Shortcut */}
                                        <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 transition-opacity ${searchQuery ? 'opacity-0' : 'opacity-100'}`}>
                                            <kbd className="text-[10px] text-gray-500 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.08] flex items-center gap-0.5">
                                                <Command className="w-2.5 h-2.5" />
                                                K
                                            </kbd>
                                        </div>

                                        {/* Clear Button */}
                                        {searchQuery && (
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors"
                                            >
                                                <X className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </div>

                                    {/* AI Button - Itachi */}
                                    <button
                                        type="button"
                                        onClick={() => window.dispatchEvent(new CustomEvent('openAI'))}
                                        className="relative p-2.5 bg-gradient-to-br from-red-900/30 to-red-950/20 hover:from-red-900/50 hover:to-red-950/30 border border-red-800/30 hover:border-red-700/50 rounded-xl text-red-400 hover:text-red-300 transition-all duration-300 group overflow-hidden"
                                        title="Itachi ile konuş"
                                    >
                                        {/* Glow Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/10 to-red-500/0 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <Sparkles className="w-4 h-4 relative z-10 group-hover:animate-bounce-soft" />
                                    </button>
                                </div>

                                {/* Search Suggestions Dropdown */}
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-12 mt-2 bg-[#111]/95 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden animate-scale-in z-50">
                                        {suggestions.map((anime, index) => (
                                            <button
                                                key={anime.id}
                                                type="button"
                                                onClick={() => {
                                                    router.push(`/anime/${anime.id}`);
                                                    setShowSuggestions(false);
                                                    setSearchQuery('');
                                                }}
                                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.05] transition-colors text-left"
                                                style={{ animationDelay: `${index * 50}ms` }}
                                            >
                                                <div className="w-10 h-14 rounded-lg overflow-hidden bg-white/[0.05] flex-shrink-0">
                                                    {anime.posterUrl ? (
                                                        <img src={anime.posterUrl} alt={anime.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Play className="w-4 h-4 text-gray-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-sm text-white font-medium truncate">{anime.title}</div>
                                                    {anime.year && (
                                                        <div className="text-xs text-gray-500">{anime.year}</div>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Right - Actions */}
                    <div className="flex items-center gap-1">
                        {/* Random Anime */}
                        <button
                            onClick={handleRandom}
                            className="relative p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.05] transition-all duration-300 group"
                            title="Rastgele Anime"
                        >
                            <Shuffle className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                        </button>

                        {/* Trending */}
                        <button
                            onClick={() => router.push('/discover?sort=trending')}
                            className="relative p-2.5 rounded-xl text-gray-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all duration-300 group"
                            title="Trend Animeler"
                        >
                            <TrendingUp className="w-4 h-4 group-hover:animate-bounce-soft" />
                        </button>

                        {/* Notifications */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => { setShowNotifs(!showNotifs); setShowProfileMenu(false); }}
                                className="relative p-2.5 rounded-xl text-gray-500 hover:text-white hover:bg-white/[0.05] transition-all duration-300 group"
                            >
                                <Bell className="w-4 h-4 group-hover:animate-bounce-soft" />

                                {/* Notification Badge */}
                                {unreadCount > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-crimson-500 rounded-full animate-pulse">
                                        <span className="absolute inset-0 bg-crimson-500 rounded-full animate-ping opacity-75" />
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifs && (
                                <div className="absolute right-0 top-12 w-80 bg-[#111]/95 backdrop-blur-2xl border border-white/[0.08] rounded-xl shadow-2xl overflow-hidden animate-scale-in">
                                    {/* Header */}
                                    <div className="px-4 py-3 border-b border-white/[0.05] flex justify-between items-center bg-gradient-to-r from-crimson-950/30 to-transparent">
                                        <div className="flex items-center gap-2">
                                            <Bell className="w-4 h-4 text-crimson-400" />
                                            <span className="text-sm font-semibold text-white">Bildirimler</span>
                                        </div>
                                        {unreadCount > 0 && (
                                            <span className="text-[10px] font-bold bg-crimson-500/20 text-crimson-400 px-2 py-0.5 rounded-full border border-crimson-500/30">
                                                {unreadCount} yeni
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center">
                                                <Bell className="w-8 h-8 text-gray-700 mx-auto mb-2" />
                                                <div className="text-gray-500 text-sm">Henüz bildirim yok</div>
                                            </div>
                                        ) : (
                                            notifications.slice(0, 5).map((n, index) => (
                                                <div
                                                    key={n.id}
                                                    onClick={() => handleRead(n)}
                                                    className={`px-4 py-3.5 cursor-pointer hover:bg-white/[0.05] transition-all duration-200 border-b border-white/[0.03] ${!n.isRead ? 'bg-crimson-500/5' : ''}`}
                                                    style={{ animationDelay: `${index * 50}ms` }}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${!n.isRead ? 'bg-crimson-500 animate-pulse' : 'bg-gray-700'}`} />
                                                        <div className="flex-1 min-w-0">
                                                            <div className="text-sm text-white font-medium mb-0.5 truncate">{n.title}</div>
                                                            <div className="text-xs text-gray-500 line-clamp-2">{n.message}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="w-px h-6 bg-gradient-to-b from-transparent via-white/[0.1] to-transparent mx-2" />

                        {/* Profile */}
                        <div className="relative" onClick={(e) => e.stopPropagation()}>
                            <button
                                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifs(false); }}
                                className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-white/[0.05] transition-all duration-300 group"
                            >
                                {/* Avatar with Ring */}
                                <div className="relative">
                                    {/* Animated Ring */}
                                    <div className={`absolute -inset-0.5 bg-gradient-to-r from-crimson-500 to-crimson-700 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${showProfileMenu ? 'opacity-100' : ''}`} />

                                    <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-crimson-500 to-crimson-700 overflow-hidden">
                                        {user?.avatarUrl ? (
                                            <img src={user.avatarUrl} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {user && (
                                    <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform duration-300 ${showProfileMenu ? 'rotate-180' : ''}`} />
                                )}
                            </button>

                            {/* Profile Dropdown */}
                            {showProfileMenu && (
                                <div className="absolute right-0 top-12 w-72 bg-[#0f0f0f]/98 backdrop-blur-2xl border border-white/[0.06] rounded-2xl shadow-2xl overflow-hidden animate-scale-in">
                                    {user ? (
                                        <>
                                            {/* User Info Header - Reference Style */}
                                            <div className="p-4 border-b border-white/[0.05]">
                                                <div className="flex items-start gap-3">
                                                    {/* Large Avatar */}
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 overflow-hidden flex-shrink-0 ring-2 ring-white/10">
                                                        {user.avatarUrl ? (
                                                            <img src={user.avatarUrl} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center">
                                                                <User className="w-7 h-7 text-white" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* User Info */}
                                                    <div className="flex-1 min-w-0 pt-1">
                                                        <div className="text-base font-semibold text-white truncate">{user.username}</div>
                                                        <div className="text-xs text-gray-500 truncate mb-2">{user.email || 'Üye'}</div>

                                                        {/* Green Status Button */}
                                                        <button className="px-3 py-1 bg-emerald-500/90 hover:bg-emerald-400 text-white text-xs font-semibold rounded-md transition-all shadow-lg shadow-emerald-500/20">
                                                            Giriş Yap
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Menu Items - Clean Style */}
                                            <div className="p-2">
                                                <button
                                                    onClick={() => { router.push('/settings'); setShowProfileMenu(false); }}
                                                    className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-lg flex items-center gap-3 transition-all duration-200"
                                                >
                                                    <User className="w-4 h-4 text-gray-500" />
                                                    <span>Profilim</span>
                                                </button>
                                                <button
                                                    onClick={() => { router.push('/settings'); setShowProfileMenu(false); }}
                                                    className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-lg flex items-center gap-3 transition-all duration-200"
                                                >
                                                    <Settings className="w-4 h-4 text-gray-500" />
                                                    <span>Ayarlar</span>
                                                </button>

                                                <div className="border-t border-white/[0.05] my-2" />

                                                <button
                                                    onClick={() => { logout(); setShowProfileMenu(false); }}
                                                    className="w-full text-left px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-lg flex items-center gap-3 transition-all duration-200"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    <span>Çıkış Yap</span>
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            {/* Guest User Header */}
                                            <div className="p-4 border-b border-white/[0.05]">
                                                <div className="flex items-start gap-3">
                                                    {/* Avatar */}
                                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-600 to-gray-700 overflow-hidden flex-shrink-0 ring-2 ring-white/10">
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <User className="w-7 h-7 text-white/70" />
                                                        </div>
                                                    </div>

                                                    {/* Guest Info */}
                                                    <div className="flex-1 min-w-0 pt-1">
                                                        <div className="text-base font-semibold text-white">Misafir</div>
                                                        <div className="text-xs text-gray-500 mb-2">Giriş yapmadınız</div>

                                                        {/* Green Login Button */}
                                                        <button
                                                            onClick={() => { setShowAuthModal(true); setShowProfileMenu(false); }}
                                                            className="px-3 py-1 bg-emerald-500/90 hover:bg-emerald-400 text-white text-xs font-semibold rounded-md transition-all shadow-lg shadow-emerald-500/20"
                                                        >
                                                            Giriş Yap
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Guest Menu Items */}
                                            <div className="p-2">
                                                <button
                                                    onClick={() => { router.push('/settings'); setShowProfileMenu(false); }}
                                                    className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-lg flex items-center gap-3 transition-all duration-200"
                                                >
                                                    <User className="w-4 h-4 text-gray-500" />
                                                    <span>Profilim</span>
                                                </button>
                                                <button
                                                    onClick={() => { router.push('/settings'); setShowProfileMenu(false); }}
                                                    className="w-full text-left px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-lg flex items-center gap-3 transition-all duration-200"
                                                >
                                                    <Settings className="w-4 h-4 text-gray-500" />
                                                    <span>Ayarlar</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </>
    );
}
