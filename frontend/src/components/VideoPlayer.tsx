import { useState, useEffect, useRef } from 'react';
import { SkipForward, Play, Pause, Volume2, VolumeX, Maximize, Minimize, Clock, Settings, Subtitles, ChevronRight, FastForward, Rewind, Volume1 } from 'lucide-react';

interface VideoPlayerProps {
    embedUrl: string;
    introStart?: number | null;
    introEnd?: number | null;
    title?: string;
    episodeNumber?: number;
    onTimeUpdate?: (currentTime: number) => void;
}

export default function VideoPlayer({ embedUrl, introStart, introEnd, title, episodeNumber, onTimeUpdate }: VideoPlayerProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);
    const volumeRef = useRef<HTMLDivElement>(null);

    const [showSkipIntro, setShowSkipIntro] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [skipCountdown, setSkipCountdown] = useState(0);
    const [showControls, setShowControls] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showVolumeSlider, setShowVolumeSlider] = useState(false);
    const [buffered, setBuffered] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [showSettings, setShowSettings] = useState(false);

    const hideControlsTimeout = useRef<NodeJS.Timeout | null>(null);

    // Create proxy URL to bypass CORS
    const getProxyUrl = (url: string) => {
        // If it's already a local URL or data URL, use directly
        if (url.startsWith('/') || url.startsWith('data:') || url.startsWith('blob:')) {
            return url;
        }
        // Route through backend proxy
        return `http://localhost:4000/api/video/stream?url=${encodeURIComponent(url)}`;
    };

    const videoSrc = getProxyUrl(embedUrl);
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => {
            const time = Math.floor(video.currentTime);
            setCurrentTime(video.currentTime);

            // Skip intro logic
            if (introStart && introEnd) {
                const showAt = introStart - 2;
                if (time >= showAt && time < introEnd) {
                    setShowSkipIntro(true);
                    if (time < introStart) {
                        setSkipCountdown(introStart - time);
                    } else {
                        setSkipCountdown(0);
                    }
                } else {
                    setShowSkipIntro(false);
                }
            }

            if (onTimeUpdate) onTimeUpdate(time);
        };

        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        const handleProgress = () => {
            if (video.buffered.length > 0) {
                setBuffered(video.buffered.end(video.buffered.length - 1));
            }
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);
        const handleEnded = () => setIsPlaying(false);

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);
        video.addEventListener('progress', handleProgress);
        video.addEventListener('play', handlePlay);
        video.addEventListener('pause', handlePause);
        video.addEventListener('ended', handleEnded);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
            video.removeEventListener('progress', handleProgress);
            video.removeEventListener('play', handlePlay);
            video.removeEventListener('pause', handlePause);
            video.removeEventListener('ended', handleEnded);
        };
    }, [introStart, introEnd, onTimeUpdate]);

    // Fullscreen change listener
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    // Keyboard controls
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const video = videoRef.current;
            if (!video) return;

            switch (e.code) {
                case 'Space':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    video.currentTime = Math.min(video.currentTime + 10, duration);
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    video.currentTime = Math.max(video.currentTime - 10, 0);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    handleVolumeChange(Math.min(volume + 0.1, 1));
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    handleVolumeChange(Math.max(volume - 0.1, 0));
                    break;
                case 'KeyM':
                    toggleMute();
                    break;
                case 'KeyF':
                    toggleFullscreen();
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [volume, duration]);

    const handleMouseMove = () => {
        setShowControls(true);
        if (hideControlsTimeout.current) clearTimeout(hideControlsTimeout.current);
        hideControlsTimeout.current = setTimeout(() => {
            if (isPlaying) setShowControls(false);
        }, 3000);
    };

    const togglePlay = () => {
        const video = videoRef.current;
        if (!video) return;

        if (video.paused) {
            video.play();
        } else {
            video.pause();
        }
    };

    const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const video = videoRef.current;
        const progress = progressRef.current;
        if (!video || !progress) return;

        const rect = progress.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = clickX / rect.width;
        video.currentTime = percentage * duration;
    };

    const handleVolumeChange = (newVolume: number) => {
        const video = videoRef.current;
        if (!video) return;

        setVolume(newVolume);
        video.volume = newVolume;
        setIsMuted(newVolume === 0);
    };

    const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const volumeBar = volumeRef.current;
        if (!volumeBar) return;

        const rect = volumeBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = Math.max(0, Math.min(1, clickX / rect.width));
        handleVolumeChange(percentage);
    };

    const toggleMute = () => {
        const video = videoRef.current;
        if (!video) return;

        if (isMuted) {
            video.volume = volume || 0.5;
            setIsMuted(false);
        } else {
            video.volume = 0;
            setIsMuted(true);
        }
    };

    const toggleFullscreen = () => {
        const container = containerRef.current;
        if (!container) return;

        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            container.requestFullscreen();
        }
    };

    const handleSkipIntro = () => {
        const video = videoRef.current;
        if (!video || !introEnd) return;
        video.currentTime = introEnd;
        setShowSkipIntro(false);
    };

    const handlePlaybackRateChange = (rate: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.playbackRate = rate;
        setPlaybackRate(rate);
        setShowSettings(false);
    };

    const skip = (seconds: number) => {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = Math.max(0, Math.min(video.currentTime + seconds, duration));
    };

    const formatTime = (seconds: number): string => {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getVolumeIcon = () => {
        if (isMuted || volume === 0) return <VolumeX className="w-5 h-5 text-white" />;
        if (volume < 0.5) return <Volume1 className="w-5 h-5 text-white" />;
        return <Volume2 className="w-5 h-5 text-white" />;
    };

    return (
        <div
            ref={containerRef}
            className="relative w-full aspect-video bg-black group overflow-hidden rounded-xl"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setShowControls(false)}
        >
            {/* Video Element */}
            <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-contain"
                onClick={togglePlay}
                playsInline
            />

            {/* Top Gradient Overlay */}
            <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Episode Info */}
                <div className="absolute top-4 left-6 right-6 flex justify-between items-start pointer-events-auto">
                    <div>
                        {episodeNumber && (
                            <div className="text-crimson-400 text-xs font-bold mb-1 flex items-center gap-1">
                                <Play className="w-3 h-3 fill-current" /> Bölüm {episodeNumber}
                            </div>
                        )}
                        <h2 className="text-white font-bold text-lg drop-shadow-lg">{title || 'Video'}</h2>
                    </div>

                    {/* Top Right Actions */}
                    <div className="flex items-center gap-2 relative">
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                        >
                            <Settings className="w-4 h-4 text-white" />
                        </button>

                        {/* Settings Dropdown */}
                        {showSettings && (
                            <div className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-xl rounded-lg p-3 min-w-[150px] z-50">
                                <div className="text-white/60 text-xs mb-2">Oynatma Hızı</div>
                                {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                    <button
                                        key={rate}
                                        onClick={() => handlePlaybackRateChange(rate)}
                                        className={`block w-full text-left px-3 py-1.5 rounded text-sm transition-all ${playbackRate === rate
                                            ? 'bg-crimson-600 text-white'
                                            : 'text-white/80 hover:bg-white/10'
                                            }`}
                                    >
                                        {rate}x
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Overlay */}
            <div className={`absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
                {/* Progress Bar */}
                <div className="absolute bottom-20 left-6 right-6">
                    <div
                        ref={progressRef}
                        onClick={handleProgressClick}
                        className="relative h-1.5 bg-white/20 rounded-full cursor-pointer group/progress hover:h-2 transition-all"
                    >
                        {/* Buffered */}
                        <div
                            className="absolute h-full bg-white/30 rounded-full"
                            style={{ width: `${(buffered / duration) * 100}%` }}
                        />

                        {/* Progress */}
                        <div
                            className="absolute h-full bg-crimson-500 rounded-full"
                            style={{ width: `${(currentTime / duration) * 100}%` }}
                        >
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-crimson-500 rounded-full scale-0 group-hover/progress:scale-100 transition-transform shadow-lg shadow-crimson-500/50" />
                        </div>

                        {/* Intro Markers */}
                        {introStart && introEnd && duration > 0 && (
                            <>
                                <div
                                    className="absolute top-0 h-full w-0.5 bg-yellow-400"
                                    style={{ left: `${(introStart / duration) * 100}%` }}
                                />
                                <div
                                    className="absolute top-0 h-full bg-yellow-400/20"
                                    style={{
                                        left: `${(introStart / duration) * 100}%`,
                                        width: `${((introEnd - introStart) / duration) * 100}%`
                                    }}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom Controls */}
                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-center">
                    {/* Left Controls */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={togglePlay}
                            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all"
                        >
                            {isPlaying ? (
                                <Pause className="w-5 h-5 text-white" />
                            ) : (
                                <Play className="w-5 h-5 text-white fill-current" />
                            )}
                        </button>

                        <button
                            onClick={() => skip(-10)}
                            className="p-2 rounded-full hover:bg-white/10 transition-all"
                        >
                            <Rewind className="w-5 h-5 text-white" />
                        </button>

                        <button
                            onClick={() => skip(10)}
                            className="p-2 rounded-full hover:bg-white/10 transition-all"
                        >
                            <FastForward className="w-5 h-5 text-white" />
                        </button>

                        {/* Volume Control */}
                        <div
                            className="flex items-center gap-2 relative"
                            onMouseEnter={() => setShowVolumeSlider(true)}
                            onMouseLeave={() => setShowVolumeSlider(false)}
                        >
                            <button
                                onClick={toggleMute}
                                className="p-2 rounded-full hover:bg-white/10 transition-all"
                            >
                                {getVolumeIcon()}
                            </button>

                            <div className={`flex items-center transition-all overflow-hidden ${showVolumeSlider ? 'w-24 opacity-100' : 'w-0 opacity-0'}`}>
                                <div
                                    ref={volumeRef}
                                    onClick={handleVolumeClick}
                                    className="w-24 h-1.5 bg-white/20 rounded-full cursor-pointer relative"
                                >
                                    <div
                                        className="absolute h-full bg-white rounded-full"
                                        style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                                    >
                                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <span className="text-white/80 text-sm font-mono ml-2">
                            {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
                    </div>

                    {/* Right Controls */}
                    <div className="flex items-center gap-2">
                        {playbackRate !== 1 && (
                            <span className="text-white/60 text-xs bg-white/10 px-2 py-1 rounded">
                                {playbackRate}x
                            </span>
                        )}

                        <button
                            onClick={toggleFullscreen}
                            className="p-2 rounded-full hover:bg-white/10 transition-all"
                        >
                            {isFullscreen ? (
                                <Minimize className="w-5 h-5 text-white" />
                            ) : (
                                <Maximize className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Skip Intro Button - Modern Glassmorphism Style */}
            {showSkipIntro && introStart && introEnd && (
                <div className="absolute bottom-32 right-6 animate-fade-in z-30">
                    <button
                        onClick={handleSkipIntro}
                        className="group relative overflow-hidden flex items-center gap-3 px-6 py-3 bg-white/95 hover:bg-white text-black font-bold rounded-xl shadow-2xl shadow-black/50 transition-all hover:scale-105 hover:shadow-crimson-500/20"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-crimson-500/20 to-transparent" />

                        <SkipForward className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">
                            {skipCountdown > 0 ? (
                                <>Intro <span className="text-crimson-500">{skipCountdown}s</span> içinde</>
                            ) : (
                                <>Intro Atla</>
                            )}
                        </span>
                        <ChevronRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Intro Time Info */}
                    <div className="mt-2 text-right">
                        <span className="text-xs text-white/60 bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg">
                            <Clock className="w-3 h-3 inline mr-1" />
                            {formatTime(introStart)} → {formatTime(introEnd)}
                        </span>
                    </div>
                </div>
            )}

            {/* Center Play Button (when paused and controls visible) */}
            {!isPlaying && showControls && (
                <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                    onClick={togglePlay}
                >
                    <div className="w-20 h-20 rounded-full bg-crimson-600/90 flex items-center justify-center shadow-2xl shadow-crimson-500/50 animate-scale-in hover:scale-110 transition-transform">
                        <Play className="w-8 h-8 text-white fill-current ml-1" />
                    </div>
                </div>
            )}

            {/* Loading indicator */}
            {duration === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <div className="w-12 h-12 border-4 border-crimson-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );
}
