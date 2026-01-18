import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/AuthModal';
import { Settings, User, Zap, Palette, Play, Wrench, Lock, Loader2, Save } from 'lucide-react';

const TABS = [
    { id: 'account', label: 'Hesap Ayarları', icon: User },
    { id: 'performance', label: 'Performans', icon: Zap },
    { id: 'appearance', label: 'Görünüm', icon: Palette },
    { id: 'player', label: 'Oynatıcı', icon: Play },
    { id: 'advanced', label: 'Gelişmiş', icon: Wrench },
];

export default function SettingsPage() {
    const { user, token } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('account');
    const [showAuthModal, setShowAuthModal] = useState(false);

    const [settings, setSettings] = useState({
        performanceMode: false,
        mouseEffect: true,
        theme: 'dark',
        useGpu: true,
        skipIntro: true,
        nsfwFilter: true,
        skipDuration: '10'
    });

    useEffect(() => {
        if (token) loadProfile();
        const savedSettings = localStorage.getItem('site_settings');
        if (savedSettings) {
            setSettings(JSON.parse(savedSettings));
        }
    }, [token]);

    const updateSetting = (key: string, value: any) => {
        const newSettings = { ...settings, [key]: value };
        setSettings(newSettings);
        localStorage.setItem('site_settings', JSON.stringify(newSettings));
    };

    const loadProfile = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/user/me', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProfile(res.data);
        } catch (e) { console.error(e); }
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            await axios.put('http://localhost:4000/api/user/me', {
                bio: profile.bio,
                avatarUrl: profile.avatarUrl,
                coverUrl: profile.coverUrl
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("Profil güncellendi!");
        } catch (e) { alert("Hata!"); }
        setIsSaving(false);
    };

    return (
        <Layout>
            <div className="p-8 pt-24 min-h-screen">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-crimson-600 flex items-center justify-center">
                            <Settings className="w-5 h-5 text-white" />
                        </div>
                        Ayarlar
                    </h1>
                    {!user && (
                        <button onClick={() => setShowAuthModal(true)} className="px-4 py-2 bg-crimson-600 hover:bg-crimson-700 text-white font-bold rounded-xl transition-all">
                            Giriş Yap
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Settings Sidebar */}
                    <div className="w-full md:w-64 shrink-0">
                        <div className="glass rounded-2xl p-2 space-y-1">
                            {TABS.map(tab => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all flex items-center gap-3 ${activeTab === tab.id
                                            ? 'bg-crimson-600 text-white'
                                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-6">

                        {activeTab === 'account' && (
                            <Section title="Hesap Ayarları" icon={User}>
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-crimson-600 to-crimson-800 overflow-hidden border-2 border-crimson-500 shadow-lg shadow-crimson-500/30">
                                                <img src={profile?.avatarUrl || user.avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=dc2626&color=fff`} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{user.username}</h3>
                                                <span className="px-3 py-1 bg-crimson-500/20 text-crimson-400 text-xs rounded-lg border border-crimson-500/30 inline-block mt-2">
                                                    {profile?.rank || 'Üye'}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 max-w-lg">
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm text-gray-400 font-medium">Avatar URL</label>
                                                <input
                                                    type="text"
                                                    className="bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-crimson-500 outline-none transition-colors"
                                                    value={profile?.avatarUrl || ''}
                                                    onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                                                    placeholder="https://..."
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <label className="text-sm text-gray-400 font-medium">Hakkımda</label>
                                                <textarea
                                                    className="bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:border-crimson-500 outline-none h-24 resize-none transition-colors"
                                                    value={profile?.bio || ''}
                                                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                                    placeholder="Kendinizden bahsedin..."
                                                />
                                            </div>
                                            <div className="pt-4 flex justify-end">
                                                <button
                                                    onClick={handleSaveProfile}
                                                    disabled={isSaving}
                                                    className="px-6 py-2.5 bg-crimson-600 hover:bg-crimson-700 disabled:bg-crimson-800 text-white font-bold rounded-xl transition-all flex items-center gap-2"
                                                >
                                                    {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="glass-card p-4 rounded-2xl mb-4">
                                            <Lock className="w-8 h-8 text-gray-500" />
                                        </div>
                                        <h3 className="text-lg font-bold text-white mb-2">Giriş Yapmalısın</h3>
                                        <p className="text-gray-500 text-sm mb-6 max-w-xs">İzlemeye devam et, öneriler ve daha fazlasına erişim sağla.</p>
                                        <button onClick={() => setShowAuthModal(true)} className="px-8 py-2.5 bg-crimson-600 hover:bg-crimson-700 text-white font-bold rounded-xl transition-all">
                                            Giriş Yap
                                        </button>
                                    </div>
                                )}
                            </Section>
                        )}

                        {activeTab === 'performance' && (
                            <Section title="Performans Ayarları" icon={Zap}>
                                <ToggleSetting
                                    label="Lokomotif kaydırma"
                                    desc="Kaydırma davranışını değiştirin"
                                    active={settings.performanceMode}
                                    onClick={() => updateSetting('performanceMode', !settings.performanceMode)}
                                />
                                <ToggleSetting
                                    label="Anasayfa afişi ışıltı efekti"
                                    desc="Anasayfa afişinde imlecin takip ettiği ışıltı efektini etkinleştirin"
                                    active={settings.mouseEffect}
                                    onClick={() => updateSetting('mouseEffect', !settings.mouseEffect)}
                                />
                            </Section>
                        )}

                        {activeTab === 'appearance' && (
                            <Section title="Görünüm Ayarları" icon={Palette}>
                                <div className="p-4 bg-black/20 rounded-xl border border-white/10 flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-medium mb-1">Tema</div>
                                        <div className="text-xs text-gray-500">Tercih ettiğiniz temayı seçin</div>
                                    </div>
                                    <select
                                        value={settings.theme}
                                        onChange={(e) => updateSetting('theme', e.target.value)}
                                        className="bg-black/30 border border-white/10 text-white text-sm rounded-xl focus:border-crimson-500 p-2.5 outline-none"
                                    >
                                        <option value="dark">Karanlık (Varsayılan)</option>
                                        <option value="light">Aydınlık</option>
                                        <option value="system">Sistem</option>
                                    </select>
                                </div>
                            </Section>
                        )}

                        {activeTab === 'player' && (
                            <Section title="Oynatıcı" icon={Play}>
                                <ToggleSetting
                                    label="Oynatıcı içinde ekran kartından yararlan"
                                    desc="Kapatmanız durumunda gerçek zamanlı görüntü iyileştirme kullanamayacaksınız."
                                    active={settings.useGpu}
                                    onClick={() => updateSetting('useGpu', !settings.useGpu)}
                                />
                                <div className="p-4 bg-black/20 rounded-xl border border-white/10 flex justify-between items-center">
                                    <div>
                                        <div className="text-white font-medium mb-1">Varsayılan ileri sarma süresi</div>
                                        <div className="text-xs text-gray-500">Tercih ettiğiniz süreyi seçin</div>
                                    </div>
                                    <select
                                        value={settings.skipDuration}
                                        onChange={(e) => updateSetting('skipDuration', e.target.value)}
                                        className="bg-black/30 border border-white/10 text-white text-sm rounded-xl p-2.5 outline-none focus:border-crimson-500"
                                    >
                                        <option value="5">5 saniye</option>
                                        <option value="10">10 saniye</option>
                                        <option value="15">15 saniye</option>
                                        <option value="30">30 saniye</option>
                                    </select>
                                </div>
                            </Section>
                        )}

                        {activeTab === 'advanced' && (
                            <Section title="Gelişmiş" icon={Wrench}>
                                <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/10">
                                    <div>
                                        <div className="text-white font-medium mb-1">NSFW uyarılarını sıfırla</div>
                                        <div className="text-xs text-gray-500">Yetişkin içerik uyarılarını sıfırlamak için bu seçeneği kullanın</div>
                                    </div>
                                    <button onClick={() => alert("Sıfırlandı")} className="text-crimson-400 hover:text-crimson-300 text-sm font-medium transition-colors">
                                        Uyarıları sıfırla
                                    </button>
                                </div>
                            </Section>
                        )}

                    </div>
                </div>
            </div>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </Layout>
    );
}

const Section = ({ title, children, icon: Icon }: any) => (
    <div className="glass-card p-6 rounded-2xl">
        <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
            {Icon && <Icon className="w-5 h-5 text-crimson-500" />}
            {title}
        </h2>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

const ToggleSetting = ({ label, desc, active, onClick }: any) => (
    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/10">
        <div>
            <div className="text-white font-medium mb-1">{label}</div>
            <div className="text-xs text-gray-500 max-w-md">{desc}</div>
        </div>
        <button
            onClick={onClick}
            className={`w-12 h-6 rounded-full relative transition-all ${active ? 'bg-crimson-600' : 'bg-gray-700'}`}
        >
            <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-md ${active ? 'left-6' : 'left-0.5'}`}></div>
        </button>
    </div>
);
