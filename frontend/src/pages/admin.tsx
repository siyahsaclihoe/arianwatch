import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import {
    Shield, Users, Film, PlayCircle, MessageSquare,
    Trash2, Edit3, Eye, Plus, RefreshCw, X, Check,
    Home, Ban, Calendar, Star, Loader2, LogOut, AlertCircle
} from 'lucide-react';

// Tab configuration with icons
const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Kullanıcılar', icon: Users },
    { id: 'anime', label: 'Anime', icon: Film },
    { id: 'comments', label: 'Yorumlar', icon: MessageSquare },
    { id: 'home', label: 'Ana Sayfa', icon: Home },
];

export default function AdminPanel() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [recentComments, setRecentComments] = useState<any[]>([]);
    const [animes, setAnimes] = useState<any[]>([]);
    const [editingAnime, setEditingAnime] = useState<any>(null);
    const [error, setError] = useState('');

    const { user, token, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!user || user.role !== 'ADMIN')) {
            router.push('/');
            return;
        }
        if (token) {
            fetchStats();
            if (activeTab === 'anime') fetchAnimes();
        }
    }, [user, isLoading, token, activeTab]);

    const fetchAnimes = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/anime?limit=50&sort=newest');
            setAnimes(res.data);
        } catch (e) { console.error(e); }
    };

    const fetchStats = async () => {
        try {
            const [resStats, resUsers, resComments] = await Promise.all([
                axios.get('http://localhost:4000/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:4000/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
                axios.get('http://localhost:4000/api/admin/comments/recent', { headers: { Authorization: `Bearer ${token}` } })
            ]);
            setStats(resStats.data);
            setUsers(resUsers.data);
            setRecentComments(resComments.data);
        } catch (e: any) {
            console.error(e);
            setError(e.response?.status === 403 || e.response?.status === 401
                ? "Yetki hatası. Lütfen çıkış yapıp tekrar girin."
                : "Veriler yüklenemedi. Backend'in çalıştığından emin olun.");
        }
    };

    const handleBan = async (id: string) => {
        if (!confirm("Kullanıcıyı banlamak (silmek) istediğine emin misin?")) return;
        try {
            await axios.post(`http://localhost:4000/api/admin/users/${id}/ban`, {}, { headers: { Authorization: `Bearer ${token}` } });
            fetchStats();
        } catch (e) { alert("Hata!"); }
    };

    const handleDeleteComment = async (id: string) => {
        if (!confirm("Yorumu silmek istediğine emin misin?")) return;
        try {
            await axios.delete(`http://localhost:4000/api/admin/comments/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchStats();
        } catch (e) { alert("Hata!"); }
    };

    const handleDeleteAnime = async (id: string) => {
        if (!confirm("Bu animeyi ve tüm bölümlerini silmek istediğine emin misin? Bu işlem geri alınamaz!")) return;
        try {
            await axios.delete(`http://localhost:4000/api/anime/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchAnimes();
            fetchStats();
            if (editingAnime?.id === id) setEditingAnime(null);
            alert("Anime silindi!");
        } catch (e) { alert("Anime silinemedi!"); }
    };

    const handleDeleteEpisode = async (animeId: string, episodeId: string) => {
        if (!confirm("Bölümü silmek istediğine emin misin?")) return;
        try {
            await axios.delete(`http://localhost:4000/api/anime/${animeId}/episodes/${episodeId}`, { headers: { Authorization: `Bearer ${token}` } });
            const res = await axios.get(`http://localhost:4000/api/anime/${animeId}`);
            setEditingAnime(res.data);
            fetchAnimes();
        } catch (e) { alert("Bölüm silinemedi!"); }
    };

    // Error State
    if (error) return (
        <Layout>
            <div className="p-8 pt-24 min-h-screen bg-dark-bg text-white flex flex-col items-center justify-center">
                <div className="glass-card p-8 rounded-2xl max-w-md text-center animate-fade-in">
                    <AlertCircle className="w-16 h-16 text-crimson-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-4 text-crimson-400">Hata</h2>
                    <p className="mb-6 text-gray-400">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button onClick={() => window.location.href = '/'} className="glass-button px-4 py-2 rounded-lg text-white transition flex items-center gap-2">
                            <Home className="w-4 h-4" /> Anasayfa
                        </button>
                        <button
                            onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.location.href = '/';
                            }}
                            className="bg-crimson-600 hover:bg-crimson-700 px-4 py-2 rounded-lg text-white transition flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" /> Çıkış Yap
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );

    // Loading State
    if (!stats) return (
        <Layout>
            <div className="p-8 pt-32 min-h-screen bg-dark-bg text-white flex justify-center">
                <div className="flex flex-col items-center gap-4 animate-fade-in">
                    <Loader2 className="w-12 h-12 text-crimson-500 animate-spin" />
                    <span className="text-gray-400 animate-pulse">Admin paneli yükleniyor...</span>
                    {!user && <span className="text-xs text-yellow-500">Kullanıcı bilgisi bekleniyor...</span>}
                    {user && user.role !== 'ADMIN' && <span className="text-xs text-crimson-500">Yetki yetersiz, yönlendiriliyor...</span>}
                </div>
            </div>
        </Layout>
    );

    return (
        <Layout>
            <div className="p-8 pt-24 min-h-screen text-white">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8 animate-slide-up">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-crimson-600 to-crimson-800 flex items-center justify-center shadow-lg">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Admin Paneli</h1>
                        <p className="text-sm text-gray-500">Sistem yönetimi ve moderasyon</p>
                    </div>
                </div>

                {/* Tabs - Windows 11 Style */}
                <div className="glass rounded-xl p-1.5 mb-8 inline-flex gap-1 animate-fade-in">
                    {TABS.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                className={`px-4 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-crimson-600 text-white shadow-lg shadow-crimson-600/30'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Dashboard Tab */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <StatCard title="Toplam Üye" value={stats.users} icon={Users} />
                            <StatCard title="Animeler" value={stats.animes} icon={Film} />
                            <StatCard title="Bölümler" value={stats.episodes} icon={PlayCircle} />
                            <StatCard title="Yorumlar" value={stats.comments} icon={MessageSquare} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Recent Users */}
                            <div className="glass-card p-6 rounded-2xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <Users className="w-5 h-5 text-crimson-500" />
                                    <h3 className="font-bold">Son Üyeler</h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-400">
                                        <thead>
                                            <tr className="border-b border-white/10 uppercase font-bold text-xs text-gray-500">
                                                <th className="py-3">Kullanıcı</th>
                                                <th className="py-3">Rol</th>
                                                <th className="py-3">Rank</th>
                                                <th className="py-3">Tarih</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {users.slice(0, 5).map(u => (
                                                <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                    <td className="py-3 font-medium text-white">{u.username}</td>
                                                    <td className="py-3">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-crimson-500/20 text-crimson-400 border border-crimson-500/30' : 'bg-white/10 text-gray-400'}`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-gray-500">{u.rank}</td>
                                                    <td className="py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString('tr-TR')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recent Comments */}
                            <div className="glass-card p-6 rounded-2xl">
                                <div className="flex items-center gap-2 mb-4">
                                    <MessageSquare className="w-5 h-5 text-crimson-500" />
                                    <h3 className="font-bold">Son Yorumlar</h3>
                                </div>
                                <div className="space-y-4">
                                    {recentComments.slice(0, 4).map(c => (
                                        <div key={c.id} className="flex gap-3 text-sm group">
                                            <div className="w-1 bg-crimson-600/50 rounded-full group-hover:bg-crimson-500 transition-colors"></div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="font-bold text-crimson-400">{c.user?.username}</span>
                                                    <span className="text-xs text-gray-600">{c.anime?.title}</span>
                                                </div>
                                                <p className="text-gray-400 line-clamp-2">{c.content}</p>
                                            </div>
                                            <button onClick={() => handleDeleteComment(c.id)} className="icon-btn icon-btn-danger opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="glass-card p-6 rounded-2xl overflow-x-auto animate-fade-in">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-gray-500 border-b border-white/10">
                                <tr>
                                    <th className="px-6 py-4">Kullanıcı Adı</th>
                                    <th className="px-6 py-4">E-posta</th>
                                    <th className="px-6 py-4">Rol</th>
                                    <th className="px-6 py-4">İşlemler</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-medium text-white">{u.username}</td>
                                        <td className="px-6 py-4">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'ADMIN' ? 'bg-crimson-500/20 text-crimson-400' : 'bg-white/10'}`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleBan(u.id)}
                                                className="flex items-center gap-2 text-crimson-500 hover:text-white hover:bg-crimson-600 px-3 py-1.5 rounded-lg transition-all text-xs font-medium"
                                            >
                                                <Ban className="w-4 h-4" /> Ban
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Anime Management Tab */}
                {activeTab === 'anime' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
                        {/* Add/Edit Anime Form */}
                        <div className="lg:col-span-1 glass-card p-6 rounded-2xl h-fit">
                            <h3 className="font-bold mb-4 text-xl flex justify-between items-center">
                                <span className="flex items-center gap-2">
                                    {editingAnime ? <Edit3 className="w-5 h-5 text-green-500" /> : <Plus className="w-5 h-5 text-crimson-500" />}
                                    {editingAnime ? 'Animeyi Düzenle' : 'Yeni Anime Ekle'}
                                </span>
                                {editingAnime && (
                                    <button onClick={() => setEditingAnime(null)} className="icon-btn icon-btn-danger">
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </h3>
                            <form
                                key={editingAnime ? editingAnime.id : 'new'}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const data = Object.fromEntries(formData.entries());

                                    const request = editingAnime
                                        ? axios.put(`http://localhost:4000/api/anime/${editingAnime.id}`, data, { headers: { Authorization: `Bearer ${token}` } })
                                        : axios.post('http://localhost:4000/api/anime', data, { headers: { Authorization: `Bearer ${token}` } });

                                    request
                                        .then(() => {
                                            alert(editingAnime ? 'Anime güncellendi!' : 'Anime eklendi!');
                                            setEditingAnime(null);
                                            fetchStats();
                                            fetchAnimes();
                                        })
                                        .catch(err => alert('Hata: ' + err.message));
                                }} className="space-y-4">
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Başlık</label>
                                    <input name="title" defaultValue={editingAnime?.title} required className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-crimson-500 focus:outline-none transition-colors" />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Poster URL</label>
                                    <input name="posterUrl" defaultValue={editingAnime?.posterUrl} required className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-crimson-500 focus:outline-none transition-colors" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Yıl</label>
                                        <input name="year" type="number" defaultValue={editingAnime?.year} required className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-crimson-500 focus:outline-none transition-colors" />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500 mb-1">Türler</label>
                                        <input name="genres" placeholder="Action, Drama" defaultValue={Array.isArray(editingAnime?.genres) ? editingAnime.genres.join(', ') : editingAnime?.genres || ''} required className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-crimson-500 focus:outline-none transition-colors" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-500 mb-1">Özet</label>
                                    <textarea name="synopsis" rows={3} defaultValue={editingAnime?.synopsis} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-crimson-500 focus:outline-none transition-colors resize-none"></textarea>
                                </div>

                                {/* Broadcast Schedule */}
                                <div className="border-t border-white/10 pt-4 mt-2">
                                    <label className="block text-xs text-gray-500 mb-2 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> Yayın Takvimi
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Yayın Günü</label>
                                            <select name="broadcastDay" defaultValue={editingAnime?.broadcastDay ?? ''} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-crimson-500 focus:outline-none transition-colors">
                                                <option value="">Seçiniz...</option>
                                                <option value="0">Pazartesi</option>
                                                <option value="1">Salı</option>
                                                <option value="2">Çarşamba</option>
                                                <option value="3">Perşembe</option>
                                                <option value="4">Cuma</option>
                                                <option value="5">Cumartesi</option>
                                                <option value="6">Pazar</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs text-gray-500 mb-1">Yayın Saati</label>
                                            <input name="broadcastTime" type="time" defaultValue={editingAnime?.broadcastTime || ''} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-crimson-500 focus:outline-none transition-colors" />
                                        </div>
                                    </div>
                                </div>

                                <button type="submit" className={`w-full text-white py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${editingAnime ? 'bg-green-600 hover:bg-green-700' : 'bg-crimson-600 hover:bg-crimson-700'}`}>
                                    {editingAnime ? <><Check className="w-4 h-4" /> Güncelle</> : <><Plus className="w-4 h-4" /> Ekle</>}
                                </button>
                            </form>
                        </div>

                        {/* Episode Management Section */}
                        {editingAnime && (
                            <div className="lg:col-span-1 glass-card p-6 rounded-2xl h-fit">
                                <h3 className="font-bold mb-4 text-xl flex items-center gap-2">
                                    <PlayCircle className="w-5 h-5 text-crimson-500" />
                                    Bölüm Yönetimi
                                </h3>

                                {/* Add Episode Form */}
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.currentTarget);
                                    const data: any = Object.fromEntries(formData.entries());

                                    // Convert mm:ss to seconds
                                    const parseTime = (timeStr: string) => {
                                        if (!timeStr) return null;
                                        const parts = timeStr.split(':');
                                        if (parts.length === 2) {
                                            return parseInt(parts[0]) * 60 + parseInt(parts[1]);
                                        }
                                        return parseInt(timeStr) || null;
                                    };

                                    data.introStart = parseTime(data.introStart);
                                    data.introEnd = parseTime(data.introEnd);

                                    try {
                                        await axios.post(`http://localhost:4000/api/anime/${editingAnime.id}/episodes`, data, {
                                            headers: { Authorization: `Bearer ${token}` }
                                        });
                                        alert('Bölüm eklendi!');
                                        const res = await axios.get(`http://localhost:4000/api/anime/${editingAnime.id}`);
                                        setEditingAnime(res.data);
                                        fetchAnimes();
                                        (e.target as HTMLFormElement).reset();
                                    } catch (err: any) {
                                        alert('Hata: ' + err.message);
                                    }
                                }} className="space-y-3 mb-6 p-4 bg-black/20 rounded-xl border border-white/5">
                                    <h4 className="font-bold text-sm text-gray-400 flex items-center gap-2">
                                        <Plus className="w-4 h-4" /> Yeni Bölüm Ekle
                                    </h4>
                                    <input name="number" type="number" placeholder="Bölüm No (Örn: 1)" required className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white text-xs focus:border-crimson-500 focus:outline-none transition-colors" />
                                    <input name="title" placeholder="Bölüm Başlığı (Opsiyonel)" className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white text-xs focus:border-crimson-500 focus:outline-none transition-colors" />
                                    <input name="embedUrl" placeholder="Embed Video URL" required className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white text-xs focus:border-crimson-500 focus:outline-none transition-colors" />
                                    <div className="grid grid-cols-2 gap-2">
                                        <input name="introStart" type="text" placeholder="Intro Başlangıç (1:25)" className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white text-xs focus:border-crimson-500 focus:outline-none transition-colors" />
                                        <input name="introEnd" type="text" placeholder="Intro Bitiş (2:55)" className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white text-xs focus:border-crimson-500 focus:outline-none transition-colors" />
                                    </div>
                                    <p className="text-[10px] text-gray-600">Dakika:Saniye formatında girin (Örn: 1:25 veya 2:55)</p>
                                    <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2">
                                        <Plus className="w-4 h-4" /> Bölümü Ekle
                                    </button>
                                </form>

                                {/* Episode List */}
                                <div className="space-y-2 max-h-[350px] overflow-y-auto">
                                    <h4 className="font-bold text-sm text-gray-400 mb-2 flex items-center gap-2">
                                        <Film className="w-4 h-4" /> Mevcut Bölümler ({editingAnime.episodes?.length || 0})
                                    </h4>
                                    {editingAnime.episodes?.sort((a: any, b: any) => a.number - b.number).map((ep: any) => (
                                        <div key={ep.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg border border-white/5 hover:border-crimson-500/30 transition-colors group">
                                            <div>
                                                <div className="font-bold text-sm text-white">Bölüm {ep.number}</div>
                                                <div className="text-[10px] text-gray-500 max-w-[150px] truncate">{ep.title || 'Başlıksız'}</div>
                                            </div>
                                            <button onClick={() => handleDeleteEpisode(editingAnime.id, ep.id)} className="icon-btn icon-btn-danger opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Anime List */}
                        <div className={`${editingAnime ? 'lg:col-span-1' : 'lg:col-span-2'} glass-card p-6 rounded-2xl`}>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold flex items-center gap-2">
                                    <Film className="w-5 h-5 text-crimson-500" />
                                    Mevcut Animeler ({animes.length})
                                </h3>
                                <button onClick={fetchAnimes} className="icon-btn text-crimson-400 hover:text-white">
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                                {animes.length === 0 ? (
                                    <div className="text-center py-10 border border-dashed border-white/10 rounded-xl text-gray-500">
                                        Henüz anime eklenmemiş.
                                    </div>
                                ) : (
                                    animes.map((anime: any) => (
                                        <div key={anime.id} className="flex gap-4 p-3 border border-white/5 rounded-xl hover:border-crimson-500/30 hover:bg-white/5 transition-all group">
                                            <img src={anime.posterUrl} className="w-12 h-16 object-cover rounded-lg" alt={anime.title} />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-bold text-white group-hover:text-crimson-400 transition-colors truncate">{anime.title}</h4>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Calendar className="w-3 h-3" /> {anime.year}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1 line-clamp-1">{anime.synopsis}</div>
                                                <div className="mt-2 flex gap-2">
                                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 flex items-center gap-1">
                                                        <PlayCircle className="w-3 h-3" /> {anime.episodes?.length || 0}
                                                    </span>
                                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-gray-300 flex items-center gap-1">
                                                        <Star className="w-3 h-3" /> {anime.popularity}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button onClick={() => window.open(`/anime/${anime.id}`, '_blank')} className="icon-btn text-blue-400">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => setEditingAnime(anime)} className="icon-btn icon-btn-success">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDeleteAnime(anime.id)} className="icon-btn icon-btn-danger">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Comments Tab */}
                {activeTab === 'comments' && (
                    <div className="glass-card p-6 rounded-2xl animate-fade-in">
                        <h3 className="font-bold mb-6 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-crimson-500" />
                            Tüm Yorumlar (Moderasyon)
                        </h3>
                        <div className="space-y-4">
                            {recentComments.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">Yorum bulunamadı.</p>
                            ) : (
                                recentComments.map(c => (
                                    <div key={c.id} className="flex gap-4 p-4 border border-white/5 rounded-xl hover:border-crimson-500/20 hover:bg-white/5 transition-all group">
                                        <div className="w-10 h-10 bg-gradient-to-br from-crimson-600 to-crimson-800 rounded-full flex items-center justify-center shrink-0 font-bold text-white">
                                            {c.user?.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <span className="font-bold text-crimson-400 mr-2">{c.user?.username}</span>
                                                    <span className="text-xs text-gray-500">{c.anime?.title} • {new Date(c.createdAt).toLocaleDateString('tr-TR')}</span>
                                                </div>
                                                <button onClick={() => handleDeleteComment(c.id)} className="flex items-center gap-1 text-crimson-500 hover:text-white hover:bg-crimson-600 text-xs px-2 py-1 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                                                    <Trash2 className="w-3 h-3" /> Sil
                                                </button>
                                            </div>
                                            <p className="text-gray-300 text-sm bg-black/20 p-3 rounded-lg">{c.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Home Management Tab */}
                {activeTab === 'home' && (
                    <HomeManagement token={token} />
                )}
            </div>
        </Layout>
    );
}

function HomeManagement({ token }: { token: string | null }) {
    const [slides, setSlides] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState<any>(null);

    useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/hero/all', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSlides(res.data);
        } catch (e) { alert("Failed to fetch slides"); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Silmek istediğine emin misin?")) return;
        try {
            await axios.delete(`http://localhost:4000/api/hero/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchSlides();
        } catch (e) { alert("Failed to delete"); }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            if (isEditing) {
                await axios.put(`http://localhost:4000/api/hero/${isEditing.id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post('http://localhost:4000/api/hero', data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsEditing(null);
            fetchSlides();
            e.target.reset();
        } catch (e: any) {
            console.error(e);
            alert(e.response?.data?.error || "Operation failed");
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            {/* Form */}
            <div className="lg:col-span-1 glass-card p-6 rounded-2xl h-fit">
                <h3 className="font-bold mb-4 text-xl flex justify-between items-center">
                    <span className="flex items-center gap-2">
                        {isEditing ? <Edit3 className="w-5 h-5 text-green-500" /> : <Plus className="w-5 h-5 text-crimson-500" />}
                        {isEditing ? 'Slider Düzenle' : 'Yeni Slider Ekle'}
                    </span>
                    {isEditing && (
                        <button onClick={() => setIsEditing(null)} className="icon-btn icon-btn-danger">
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </h3>
                <form onSubmit={handleSubmit} key={isEditing ? isEditing.id : 'new'} className="space-y-4">
                    <div>
                        <label className="text-gray-500 text-xs block mb-1">Başlık</label>
                        <input name="title" defaultValue={isEditing?.title} required className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-crimson-500 focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="text-gray-500 text-xs block mb-1">Açıklama</label>
                        <textarea name="description" defaultValue={isEditing?.description} required rows={3} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-crimson-500 focus:outline-none transition-colors resize-none" />
                    </div>
                    <div>
                        <label className="text-gray-500 text-xs block mb-1">Görsel URL</label>
                        <input name="imageUrl" defaultValue={isEditing?.imageUrl} required className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-crimson-500 focus:outline-none transition-colors" />
                    </div>
                    <div>
                        <label className="text-gray-500 text-xs block mb-1">Anime ID (Opsiyonel)</label>
                        <input name="animeId" defaultValue={isEditing?.animeId} placeholder="Bağlanacak anime ID" className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-crimson-500 focus:outline-none transition-colors" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-gray-500 text-xs block mb-1">Sıra (Order)</label>
                            <input name="order" type="number" defaultValue={isEditing?.order || 0} className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-crimson-500 focus:outline-none transition-colors" />
                        </div>
                        <div className="flex items-center pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="isActive" value="true" defaultChecked={isEditing?.isActive ?? true} className="w-4 h-4 accent-crimson-600" />
                                <span className="text-sm text-gray-400">Aktif</span>
                            </label>
                        </div>
                    </div>
                    <button className={`w-full text-white py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${isEditing ? 'bg-green-600 hover:bg-green-700' : 'bg-crimson-600 hover:bg-crimson-700'}`}>
                        {isEditing ? <><Check className="w-4 h-4" /> Güncelle</> : <><Plus className="w-4 h-4" /> Ekle</>}
                    </button>
                </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
                {slides.map(slide => (
                    <div key={slide.id} className="glass-card p-4 rounded-xl flex gap-4 items-center group">
                        <img src={slide.imageUrl} className="w-24 h-14 object-cover rounded-lg" />
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-white flex items-center gap-2">
                                {slide.title}
                                {!slide.isActive && <span className="text-[10px] bg-crimson-500/20 text-crimson-500 px-2 py-0.5 rounded">Pasif</span>}
                            </h4>
                            <p className="text-xs text-gray-500 line-clamp-1">{slide.description}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setIsEditing(slide)} className="icon-btn icon-btn-success">
                                <Edit3 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(slide.id)} className="icon-btn icon-btn-danger">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                {slides.length === 0 && <div className="text-center text-gray-500 py-8 glass-card rounded-xl">Henüz slider eklenmemiş.</div>}
            </div>
        </div>
    );
}

// Stat Card Component with Lucide Icons
const StatCard = ({ title, value, icon: Icon }: { title: string; value: number; icon: any }) => (
    <div className="stat-card p-6 rounded-2xl">
        <div className="flex justify-between items-center">
            <div>
                <div className="text-gray-400 text-sm font-medium mb-1">{title}</div>
                <div className="text-3xl font-bold text-white">{value}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-crimson-600/20 flex items-center justify-center">
                <Icon className="w-6 h-6 text-crimson-500" />
            </div>
        </div>
    </div>
);
