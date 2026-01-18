import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, ThumbsUp, ThumbsDown, Reply, Loader2, AlertTriangle, Eye, EyeOff, X, ChevronDown, ChevronUp } from 'lucide-react';

interface CommentItemProps {
    comment: any;
    animeId: string;
    token: string | null;
    user: any;
    onReply: () => void;
    depth?: number;
}

export default function Comments({ animeId }: { animeId: string }) {
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user, token } = useAuth();

    useEffect(() => {
        if (animeId) loadComments();
    }, [animeId]);

    const loadComments = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/api/comments/${animeId}`);
            setComments(res.data);
        } catch (e) { console.error(e); }
    };

    const handleSubmit = async (e: React.FormEvent, parentId?: string) => {
        e.preventDefault();
        if (!newComment) return;

        setIsLoading(true);
        try {
            await axios.post('http://localhost:4000/api/comments', {
                animeId,
                content: newComment,
                isSpoiler,
                parentId
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewComment('');
            setIsSpoiler(false);
            loadComments();
        } catch (e) {
            alert("Yorum gönderilemedi!");
        }
        setIsLoading(false);
    };

    return (
        <div className="glass-card p-6 rounded-2xl">
            <h3 className="font-bold text-white mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-crimson-500" />
                Yorumlar ({comments.length})
                <span className="text-xs font-normal text-gray-500 ml-2">XP Kazanmak için yorum yap!</span>
            </h3>

            {/* Input */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-600 to-crimson-800 shrink-0 overflow-hidden">
                        <img
                            src={(user as any).avatarUrl || `https://ui-avatars.com/api/?name=${user.username}&background=dc2626&color=fff`}
                            alt="me"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex-1">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder={isSpoiler ? "Spoiler içeren yorumunuzu yazın..." : "Bu bölüm hakkında ne düşünüyorsun?"}
                            className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:border-crimson-500 outline-none h-24 transition-all resize-none placeholder-gray-600"
                        />
                        <div className="flex justify-between items-center mt-2">
                            {/* Spoiler Checkbox */}
                            <label
                                className={`flex items-center gap-2 cursor-pointer select-none px-3 py-1.5 rounded-lg transition-all ${isSpoiler
                                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400'
                                    : 'bg-white/5 border border-white/10 text-gray-400 hover:border-white/20'
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSpoiler}
                                    onChange={(e) => setIsSpoiler(e.target.checked)}
                                    className="sr-only"
                                />
                                <AlertTriangle className={`w-4 h-4 ${isSpoiler ? 'text-amber-400' : 'text-gray-500'}`} />
                                <span className="text-sm font-medium">Spoiler olarak işaretle</span>
                            </label>

                            <button
                                type="submit"
                                disabled={isLoading || !newComment.trim()}
                                className="px-6 py-2.5 bg-crimson-600 hover:bg-crimson-700 disabled:bg-crimson-800 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                                Gönder
                            </button>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="p-4 bg-crimson-500/10 border border-crimson-500/20 rounded-xl text-crimson-200 mb-8 text-center">
                    Yorum yapmak için giriş yapmalısın.
                </div>
            )}

            {/* List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        animeId={animeId}
                        token={token}
                        user={user}
                        onReply={loadComments}
                    />
                ))}
                {comments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Henüz yorum yok. İlk yorumu sen yap!
                    </div>
                )}
            </div>
        </div>
    );
}

const CommentItem = ({ comment, animeId, token, user, onReply, depth = 0 }: CommentItemProps) => {
    const [showSpoiler, setShowSpoiler] = useState(false);
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [isReplySpoiler, setIsReplySpoiler] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [upvotes, setUpvotes] = useState(comment.upvotes || 0);
    const [downvotes, setDownvotes] = useState(comment.downvotes || 0);
    const [hasVoted, setHasVoted] = useState<'up' | 'down' | null>(null);
    const [showReplies, setShowReplies] = useState(true);

    const getBadgeColor = (rank: string) => {
        if (rank.includes('Kami')) return 'bg-gradient-to-r from-yellow-500 to-amber-500 text-black';
        if (rank.includes('Sama')) return 'bg-gradient-to-r from-purple-500 to-violet-500 text-white';
        if (rank.includes('Senpai')) return 'bg-gradient-to-r from-crimson-500 to-crimson-600 text-white';
        return 'bg-white/10 text-gray-300';
    };

    const handleVote = async (type: 'up' | 'down') => {
        if (!token) {
            alert('Oy vermek için giriş yapmalısın!');
            return;
        }
        if (hasVoted) return; // Already voted

        try {
            await axios.post(`http://localhost:4000/api/comments/${comment.id}/vote`, { type }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (type === 'up') {
                setUpvotes(prev => prev + 1);
            } else {
                setDownvotes(prev => prev + 1);
            }
            setHasVoted(type);
        } catch (e) {
            console.error('Vote failed:', e);
        }
    };

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        try {
            await axios.post('http://localhost:4000/api/comments', {
                animeId,
                content: replyContent,
                isSpoiler: isReplySpoiler,
                parentId: comment.id
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setReplyContent('');
            setIsReplySpoiler(false);
            setShowReplyForm(false);
            onReply();
        } catch (e) {
            alert("Yanıt gönderilemedi!");
        }
        setIsSubmitting(false);
    };

    return (
        <div className={`flex gap-4 group ${depth > 0 ? 'ml-8 pt-4 border-l-2 border-white/10 pl-4' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-crimson-600/50 to-crimson-800/50 shrink-0 overflow-hidden border border-white/10">
                <img
                    src={comment.user.avatarUrl || `https://ui-avatars.com/api/?name=${comment.user.username}&background=dc2626&color=fff`}
                    alt="user"
                    className="w-full h-full object-cover"
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-white text-sm hover:text-crimson-400 cursor-pointer transition-colors">
                        {comment.user.username}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${getBadgeColor(comment.user.rank)}`}>
                        {comment.user.rank}
                    </span>
                    {comment.isSpoiler && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            SPOILER
                        </span>
                    )}
                    <span className="text-xs text-gray-600">{new Date(comment.createdAt).toLocaleDateString('tr-TR')}</span>
                </div>

                {/* Spoiler Content with Frosted Glass Effect */}
                {comment.isSpoiler && !showSpoiler ? (
                    <div className="relative">
                        <div className="bg-black/30 p-3 rounded-lg relative overflow-hidden">
                            <div className="absolute inset-0 backdrop-blur-xl bg-black/40 flex flex-col items-center justify-center z-10 rounded-lg border border-amber-500/20">
                                <AlertTriangle className="w-6 h-6 text-amber-400 mb-2" />
                                <p className="text-amber-200 text-sm font-medium mb-3">Bu yorum spoiler içeriyor</p>
                                <button
                                    onClick={() => setShowSpoiler(true)}
                                    className="px-4 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 rounded-lg text-amber-300 text-sm font-medium transition-all flex items-center gap-2"
                                >
                                    <Eye className="w-4 h-4" />
                                    Spoileri Göster
                                </button>
                            </div>
                            <p className="text-transparent text-sm leading-relaxed select-none pointer-events-none min-h-[60px]">
                                {comment.content}
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        <p className="text-gray-300 text-sm leading-relaxed bg-black/20 p-3 rounded-lg">
                            {comment.content}
                        </p>
                        {comment.isSpoiler && showSpoiler && (
                            <button
                                onClick={() => setShowSpoiler(false)}
                                className="absolute top-2 right-2 p-1.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 rounded-lg text-amber-400 transition-all"
                                title="Spoileri Gizle"
                            >
                                <EyeOff className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <button
                        onClick={() => handleVote('up')}
                        className={`flex items-center gap-1 transition-colors ${hasVoted === 'up' ? 'text-crimson-400' : 'hover:text-crimson-400'
                            }`}
                        disabled={hasVoted !== null}
                    >
                        <ThumbsUp className={`w-3 h-3 ${hasVoted === 'up' ? 'fill-current' : ''}`} /> {upvotes}
                    </button>
                    <button
                        onClick={() => handleVote('down')}
                        className={`flex items-center gap-1 transition-colors ${hasVoted === 'down' ? 'text-gray-300' : 'hover:text-gray-300'
                            }`}
                        disabled={hasVoted !== null}
                    >
                        <ThumbsDown className={`w-3 h-3 ${hasVoted === 'down' ? 'fill-current' : ''}`} /> {downvotes}
                    </button>
                    {user && depth < 2 && (
                        <button
                            onClick={() => setShowReplyForm(!showReplyForm)}
                            className="hover:text-white flex items-center gap-1 transition-colors"
                        >
                            <Reply className="w-3 h-3" /> Yanıtla
                        </button>
                    )}
                </div>

                {/* Reply Form */}
                {showReplyForm && (
                    <form onSubmit={handleReplySubmit} className="mt-4 bg-black/20 rounded-xl p-4 border border-white/10">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-400">@{comment.user.username} kullanıcısına yanıt</span>
                            <button type="button" onClick={() => setShowReplyForm(false)} className="text-gray-500 hover:text-white">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Yanıtınızı yazın..."
                            className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-crimson-500 outline-none h-20 transition-all resize-none placeholder-gray-600"
                        />
                        <div className="flex justify-between items-center mt-2">
                            <label className={`flex items-center gap-2 cursor-pointer select-none px-2 py-1 rounded-lg text-xs transition-all ${isReplySpoiler ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-400'
                                }`}>
                                <input
                                    type="checkbox"
                                    checked={isReplySpoiler}
                                    onChange={(e) => setIsReplySpoiler(e.target.checked)}
                                    className="sr-only"
                                />
                                <AlertTriangle className="w-3 h-3" />
                                Spoiler
                            </label>
                            <button
                                type="submit"
                                disabled={isSubmitting || !replyContent.trim()}
                                className="px-4 py-1.5 bg-crimson-600 hover:bg-crimson-700 disabled:bg-crimson-800 text-white text-sm font-medium rounded-lg transition-all flex items-center gap-1"
                            >
                                {isSubmitting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                                Gönder
                            </button>
                        </div>
                    </form>
                )}

                {/* Child Comments (Replies) */}
                {comment.children && comment.children.length > 0 && (
                    <div className="mt-4">
                        <button
                            onClick={() => setShowReplies(!showReplies)}
                            className="text-xs text-crimson-400 hover:text-crimson-300 flex items-center gap-1 mb-2"
                        >
                            {showReplies ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            {comment.children.length} yanıt
                        </button>
                        {showReplies && (
                            <div className="space-y-4">
                                {comment.children.map((child: any) => (
                                    <CommentItem
                                        key={child.id}
                                        comment={child}
                                        animeId={animeId}
                                        token={token}
                                        user={user}
                                        onReply={onReply}
                                        depth={depth + 1}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
