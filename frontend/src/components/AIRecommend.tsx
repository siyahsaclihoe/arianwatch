import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Send, X, Loader2, RefreshCw, Minimize2, Maximize2 } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    mentionedAnimes?: { id: string; title: string }[];
}

export default function AIRecommend() {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        checkAvailability();

        const handleOpenAI = () => {
            setIsOpen(true);
            setIsMinimized(false);
        };
        window.addEventListener('openAI', handleOpenAI);
        return () => window.removeEventListener('openAI', handleOpenAI);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const checkAvailability = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/ai/status');
            setIsAvailable(res.data.available);
        } catch {
            setIsAvailable(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:4000/api/ai/recommend', {
                message: userMessage,
                history: messages.slice(-6),
                userId: user?.id || null
            }, {
                timeout: 130000 // 130 seconds timeout
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: res.data.response,
                mentionedAnimes: res.data.mentionedAnimes
            }]);
        } catch (error: any) {
            let errorMessage = 'Bir hata oluştu.';

            if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
                errorMessage = 'Llama biraz yavaş çalışıyor 🐢 Tekrar dene!';
            } else if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            }

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: `⚠️ ${errorMessage}`
            }]);
        }

        setIsLoading(false);
    };

    const clearChat = () => setMessages([]);

    const formatMessage = (message: Message) => {
        let content = message.content;
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-red-400">$1</strong>');
        return { __html: content };
    };

    if (!isOpen) return null;

    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 bg-[#0f0f0f] border border-red-900/30 rounded-xl shadow-2xl flex items-center gap-3 p-3 z-50">
                <img src="/itachi3.png" alt="Itachi" className="w-8 h-8 object-contain" />
                <span className="text-sm font-medium text-white">Itachi</span>
                <button onClick={() => setIsMinimized(false)} className="p-1.5 hover:bg-white/5 rounded-lg">
                    <Maximize2 className="w-4 h-4 text-gray-500" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/5 rounded-lg">
                    <X className="w-4 h-4 text-gray-500" />
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Decorative Itachi images around chat */}
            <img
                src="/itachi1.png"
                alt=""
                className="fixed bottom-[520px] right-[360px] w-28 h-28 object-contain z-40 pointer-events-none opacity-90 drop-shadow-2xl animate-float"
                style={{ animation: 'float 3s ease-in-out infinite' }}
            />
            <img
                src="/itachi2.png"
                alt=""
                className="fixed bottom-20 right-[400px] w-24 h-24 object-contain z-40 pointer-events-none opacity-80 drop-shadow-2xl"
                style={{ animation: 'float 4s ease-in-out infinite 0.5s' }}
            />

            {/* Main Chat Window */}
            <div className="fixed bottom-6 right-6 w-[380px] h-[520px] bg-[#0a0a0a] rounded-2xl shadow-2xl shadow-black/80 flex flex-col z-50 overflow-hidden border border-red-900/30">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-950/60 to-[#0a0a0a] p-4 border-b border-red-900/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <img
                                src="/itachi3.png"
                                alt="Itachi"
                                className="w-11 h-11 object-contain drop-shadow-lg"
                            />
                            <div>
                                <h3 className="font-bold text-white text-lg flex items-center gap-2">
                                    Itachi
                                    <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-green-500' : 'bg-gray-600'}`} />
                                </h3>
                                <p className="text-xs text-red-400/70">Anime Öneri Asistanı</p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <button onClick={clearChat} className="p-2 hover:bg-white/5 rounded-lg" title="Temizle">
                                <RefreshCw className="w-4 h-4 text-gray-500" />
                            </button>
                            <button onClick={() => setIsMinimized(true)} className="p-2 hover:bg-white/5 rounded-lg">
                                <Minimize2 className="w-4 h-4 text-gray-500" />
                            </button>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-lg">
                                <X className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#080808]">
                    {messages.length === 0 && (
                        <div className="text-center py-6">
                            <img src="/itachi1.png" alt="Itachi" className="w-24 h-24 mx-auto mb-4 object-contain drop-shadow-xl" />
                            <p className="text-white font-medium mb-1">
                                Selam{user ? `, ${user.username}` : ''}! 🔥
                            </p>
                            <p className="text-gray-500 text-sm mb-5">
                                Ben Itachi. Sana en iyi animeleri önermek için buradayım.
                            </p>
                            <div className="space-y-2 max-w-[260px] mx-auto">
                                {[
                                    '🔥 Aksiyon anime öner',
                                    '💔 Duygusal bir şey istiyorum',
                                    '🎭 Psikolojik gerilim'
                                ].map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setInput(s)}
                                        className="block w-full text-left text-sm px-4 py-2.5 bg-white/[0.02] hover:bg-red-950/40 border border-white/5 hover:border-red-900/40 rounded-xl text-gray-300 transition-all"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {messages.map((msg, i) => (
                        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                            {msg.role === 'assistant' ? (
                                <img src="/itachi3.png" alt="Itachi" className="w-8 h-8 object-contain shrink-0" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 text-xs font-bold text-gray-400">
                                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                            <div className={`max-w-[75%] ${msg.role === 'user' ? 'text-right' : ''}`}>
                                <div
                                    className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                        ? 'bg-white/10 text-white rounded-br-sm'
                                        : 'bg-red-950/40 text-gray-200 rounded-bl-sm border border-red-900/20'
                                        }`}
                                    dangerouslySetInnerHTML={formatMessage(msg)}
                                />
                                {msg.mentionedAnimes && msg.mentionedAnimes.length > 0 && (
                                    <div className="mt-2 flex flex-wrap gap-1">
                                        {msg.mentionedAnimes.map(anime => (
                                            <Link
                                                key={anime.id}
                                                href={`/anime/${anime.id}`}
                                                className="text-[10px] px-2 py-1 bg-red-950/50 text-red-300 rounded-lg hover:bg-red-900/50 border border-red-900/30"
                                            >
                                                {anime.title} →
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex gap-3">
                            <img src="/itachi3.png" alt="Itachi" className="w-8 h-8 object-contain" />
                            <div className="bg-red-950/40 px-4 py-3 rounded-2xl rounded-bl-sm border border-red-900/20">
                                <div className="flex gap-1.5">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-red-900/20 bg-[#0a0a0a]">
                    <div className="flex gap-2">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={isAvailable ? "Mesajını yaz..." : "Ollama başlatılmamış..."}
                            disabled={!isAvailable || isLoading}
                            className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:border-red-900/50 outline-none disabled:opacity-50"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading || !isAvailable}
                            className="px-5 bg-red-900/80 hover:bg-red-800 disabled:bg-red-950/50 disabled:cursor-not-allowed text-white rounded-xl transition-all"
                        >
                            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>
                </form>
            </div>

            {/* CSS for floating animation */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
            `}</style>
        </>
    );
}
