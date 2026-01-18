import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ChevronDown, Loader2, Calendar, Eye, CheckCircle, XCircle } from 'lucide-react';

const STATUS_OPTS = [
    { value: 'PLAN_TO_WATCH', label: 'Planlanan', icon: Calendar },
    { value: 'WATCHING', label: 'İzleniyor', icon: Eye },
    { value: 'COMPLETED', label: 'Tamamlandı', icon: CheckCircle },
    { value: 'DROPPED', label: 'Bırakıldı', icon: XCircle },
];

export default function WatchStatus({ animeId, initialStatus, onUpdate }: any) {
    const [status, setStatus] = useState(initialStatus || 'PLAN_TO_WATCH');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { token } = useAuth();

    const handleChange = async (newStatus: string) => {
        setStatus(newStatus);
        setIsOpen(false);
        setIsLoading(true);

        try {
            await axios.post('http://localhost:4000/api/user/watchlist', {
                animeId,
                status: newStatus
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (onUpdate) onUpdate(newStatus);
        } catch (err) {
            console.error("Failed to update status", err);
        } finally {
            setIsLoading(false);
        }
    };

    const currentOpt = STATUS_OPTS.find(o => o.value === status) || STATUS_OPTS[0];
    const CurrentIcon = currentOpt.icon;

    return (
        <div className="relative inline-block w-48">
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-crimson-600 hover:bg-crimson-700 disabled:bg-crimson-800 border border-crimson-500 rounded-xl text-white font-medium flex items-center justify-between gap-2 transition-all"
            >
                <span className="flex items-center gap-2">
                    {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <CurrentIcon className="w-4 h-4" />
                    )}
                    {currentOpt.label}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-50 animate-fade-in">
                    {STATUS_OPTS.map(opt => {
                        const Icon = opt.icon;
                        return (
                            <button
                                key={opt.value}
                                onClick={() => handleChange(opt.value)}
                                className={`w-full px-4 py-2.5 text-left flex items-center gap-2 transition-colors ${status === opt.value
                                        ? 'bg-crimson-500/20 text-crimson-400'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {opt.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
