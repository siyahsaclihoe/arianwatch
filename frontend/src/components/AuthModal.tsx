import { useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { X, ArrowLeft, Mail, Lock, User, Loader2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [step, setStep] = useState(1);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLogin && step === 1) {
            if (!email) {
                setError("Lütfen e-posta girin.");
                return;
            }
            setStep(2);
            return;
        }

        setIsLoading(true);
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin ? { email, password } : { username, email, password };

            const res = await api.post(endpoint, payload);
            login(res.data.accessToken, res.data.user, false);
            onClose();
            setStep(1);
            setEmail('');
            setPassword('');
            setUsername('');
        } catch (err: any) {
            setError(err.response?.data?.error || "Bir hata oluştu");
        }
        setIsLoading(false);
    };

    const handleSwitchMode = (loginMode: boolean) => {
        setIsLogin(loginMode);
        setStep(1);
        setPassword('');
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
            <div className="glass-card w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl shadow-crimson-500/10 grid grid-cols-1 md:grid-cols-2 relative min-h-[600px] animate-scale-in">
                <button onClick={onClose} className="absolute top-4 right-4 z-10 icon-btn icon-btn-danger">
                    <X className="w-5 h-5" />
                </button>

                {/* Left Side - Image */}
                <div className="relative h-full hidden md:block bg-black overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop"
                        alt="Auth Art"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/50 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-crimson-950/30"></div>

                    {/* Branding */}
                    <div className="absolute bottom-8 left-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-crimson-500 to-crimson-700 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">A</span>
                            </div>
                            <span className="text-2xl font-bold text-white">ArianWatch</span>
                        </div>
                        <p className="text-gray-400 text-sm">En sevdiğiniz animeleri keşfedin</p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-12 flex flex-col justify-center h-full relative bg-dark-bg/50">

                    {/* Back Button for Login Step 2 */}
                    {isLogin && step === 2 && (
                        <button
                            className="absolute top-12 left-12 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            onClick={() => setStep(1)}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="text-sm font-medium">{email}</span>
                        </button>
                    )}

                    <div className="max-w-sm mx-auto w-full mt-8">
                        <h2 className="text-3xl font-bold text-white text-center mb-2">
                            {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                        </h2>
                        <p className="text-gray-500 text-center mb-8 text-sm">
                            Devam etmek için ArianWatch'a {isLogin ? 'giriş yap' : 'kayıt ol'}.
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Error Display */}
                            {error && (
                                <div className="bg-crimson-500/10 border border-crimson-500/30 text-crimson-400 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 shrink-0" />
                                    {error}
                                </div>
                            )}

                            {!isLogin && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 flex items-center gap-1">
                                        <User className="w-3 h-3" /> KULLANICI ADI
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={username}
                                        onChange={e => setUsername(e.target.value)}
                                        placeholder="Kullanıcı adınız"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-white focus:border-crimson-500 outline-none transition-colors placeholder-gray-600"
                                    />
                                </div>
                            )}

                            {/* Email Input */}
                            {(!isLogin || step === 1) && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 flex items-center gap-1">
                                        <Mail className="w-3 h-3" /> E-POSTA ADRESİ
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="mail@example.com"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-white focus:border-crimson-500 outline-none transition-colors placeholder-gray-600"
                                        autoFocus
                                    />
                                </div>
                            )}

                            {/* Password Input */}
                            {(!isLogin || step === 2) && (
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 flex items-center gap-1">
                                        <Lock className="w-3 h-3" /> ŞİFRE
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-black/30 border border-white/10 rounded-xl p-3.5 text-white focus:border-crimson-500 outline-none transition-colors placeholder-gray-600"
                                        autoFocus
                                    />
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-crimson-600 hover:bg-crimson-700 disabled:bg-crimson-800 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl mt-6 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        İşleniyor...
                                    </>
                                ) : (
                                    isLogin && step === 1 ? 'Devam Et' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')
                                )}
                            </button>
                        </form>

                        {isLogin && step === 2 && (
                            <div className="mt-4 text-center">
                                <button className="text-crimson-400 hover:text-crimson-300 text-sm font-medium">
                                    Şifrenizi mi Unuttunuz?
                                </button>
                            </div>
                        )}

                        <div className="mt-6 text-center text-sm text-gray-500">
                            {isLogin ? (
                                <>
                                    Hesabınız yok mu?{' '}
                                    <button onClick={() => handleSwitchMode(false)} className="text-crimson-400 hover:text-crimson-300 font-medium">
                                        Kaydolun.
                                    </button>
                                </>
                            ) : (
                                <>
                                    Zaten hesabınız var mı?{' '}
                                    <button onClick={() => handleSwitchMode(true)} className="text-crimson-400 hover:text-crimson-300 font-medium">
                                        Giriş yapın.
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
