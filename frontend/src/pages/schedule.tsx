import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import axios from 'axios';
import { Calendar, Bell, Clock, PlayCircle, Loader2, Info } from 'lucide-react';

const days = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi", "Pazar"];

const getDayIndex = (date: Date) => {
    const day = date.getDay();
    return day === 0 ? 6 : day - 1; // Convert Sunday (0) to 6, Monday (1) to 0, etc.
};

export default function Schedule() {
    const [activeDay, setActiveDay] = useState(getDayIndex(new Date()));
    const [animes, setAnimes] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadAnimes();
    }, []);

    const loadAnimes = async () => {
        setIsLoading(true);
        try {
            const res = await axios.get('http://localhost:4000/api/anime');
            setAnimes(res.data);
        } catch (e) {
            console.error(e);
        }
        setIsLoading(false);
    };

    // Filter animes that have broadcastDay set for the selected day
    const getScheduleForDay = (dayIndex: number) => {
        return animes
            .filter(anime => anime.broadcastDay === dayIndex)
            .sort((a, b) => {
                // Sort by broadcast time
                if (!a.broadcastTime) return 1;
                if (!b.broadcastTime) return -1;
                return a.broadcastTime.localeCompare(b.broadcastTime);
            })
            .map(anime => ({
                ...anime,
                time: anime.broadcastTime || '??:??',
                nextEp: anime.episodes?.length ? anime.episodes.length + 1 : 1
            }));
    };

    const scheduleData = getScheduleForDay(activeDay);
    const today = getDayIndex(new Date());

    // Count animes per day for badges
    const getDayCount = (dayIndex: number) => animes.filter(a => a.broadcastDay === dayIndex).length;

    return (
        <Layout>
            <div className="p-8 pt-24 min-h-screen">
                <h1 className="text-3xl font-bold mb-8 text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-crimson-600 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                    </div>
                    Haftalık Takvim
                </h1>

                {/* Day Selector */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-4 scrollbar-hide">
                    {days.map((d, i) => {
                        const count = getDayCount(i);
                        return (
                            <button
                                key={d}
                                onClick={() => setActiveDay(i)}
                                className={`min-w-[120px] p-4 rounded-xl cursor-pointer transition-all relative ${i === activeDay
                                        ? 'bg-crimson-600 text-white shadow-lg shadow-crimson-500/30 border border-crimson-500'
                                        : i === today
                                            ? 'glass-card text-crimson-400 border-crimson-500/30 hover:border-crimson-500/50'
                                            : 'glass-card text-gray-400 hover:text-white hover:border-white/20'
                                    }`}
                            >
                                <div className="text-xs uppercase tracking-wider mb-2 opacity-60">
                                    {i === today ? 'Bugün' : 'Gün'}
                                </div>
                                <div className="font-bold text-lg">{d}</div>
                                {count > 0 && (
                                    <div className={`absolute top-2 right-2 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${i === activeDay ? 'bg-white/20 text-white' : 'bg-crimson-500/20 text-crimson-400'
                                        }`}>
                                        {count}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Loading */}
                {isLoading && (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-crimson-500 animate-spin" />
                    </div>
                )}

                {/* Schedule List */}
                {!isLoading && (
                    <div className="space-y-4 max-w-4xl">
                        <h2 className="text-xl font-bold text-crimson-400 mb-4 flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            {days[activeDay]} Yayını
                            {activeDay === today && (
                                <span className="text-xs bg-crimson-500/20 text-crimson-400 px-2 py-0.5 rounded-full ml-2">
                                    Bugün
                                </span>
                            )}
                        </h2>

                        {scheduleData.length === 0 ? (
                            <div className="text-center py-12 glass-card rounded-2xl">
                                <Calendar className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500 mb-2">Bu gün için planlanmış yayın yok.</p>
                                <p className="text-xs text-gray-600">
                                    Admin panelinden anime yayın günü ayarlayabilirsiniz.
                                </p>
                            </div>
                        ) : (
                            scheduleData.map((item, i) => (
                                <Link
                                    href={`/anime/${item.id}`}
                                    key={i}
                                    className="flex items-center gap-6 glass-card p-4 rounded-2xl group hover:border-crimson-500/30 transition-all"
                                >
                                    <span className="text-2xl font-mono text-gray-500 group-hover:text-crimson-400 transition-colors flex items-center gap-2 min-w-[100px]">
                                        <Clock className="w-5 h-5 opacity-50" />
                                        {item.time}
                                    </span>
                                    <img
                                        src={item.posterUrl || 'https://via.placeholder.com/100x100?text=No+Image'}
                                        className="w-16 h-16 rounded-xl object-cover shadow-sm"
                                        alt={item.title}
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-crimson-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <span className="text-sm text-gray-500 flex items-center gap-1">
                                            <PlayCircle className="w-3 h-3" /> Bölüm {item.nextEp}
                                        </span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            alert(`"${item.title}" için bildirim açıldı!`);
                                        }}
                                        className="px-4 py-2.5 rounded-xl glass-button text-white text-sm font-medium hover:bg-crimson-600/30 transition-all flex items-center gap-2"
                                    >
                                        <Bell className="w-4 h-4" />
                                        Bildirim Al
                                    </button>
                                </Link>
                            ))
                        )}
                    </div>
                )}

                {/* Info Note */}
                <div className="mt-8 p-4 glass-card rounded-xl max-w-4xl flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm text-gray-400">
                            Yayın takvimi admin panelinden yönetilmektedir.
                        </p>
                        <p className="text-xs text-gray-600 mt-1">
                            Anime düzenlerken "Yayın Günü" ve "Yayın Saati" alanlarını doldurun.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
