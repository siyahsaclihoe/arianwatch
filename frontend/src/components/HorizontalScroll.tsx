import { useRef, useState, useEffect, ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HorizontalScrollProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    showArrows?: boolean;
    showFade?: boolean;
    icon?: ReactNode;
    actionButton?: ReactNode;
    className?: string;
}

export default function HorizontalScroll({
    children,
    title,
    subtitle,
    showArrows = true,
    showFade = true,
    icon,
    actionButton,
    className = ''
}: HorizontalScrollProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const checkScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        setCanScrollLeft(scrollLeft > 10);
        setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (!scrollRef.current) return;
        const scrollAmount = scrollRef.current.clientWidth * 0.8;
        scrollRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth'
        });
    };

    return (
        <div
            className={`relative ${className}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Section Header */}
            {(title || subtitle || actionButton) && (
                <div className="flex items-center justify-between mb-5 px-1">
                    <div className="flex items-center gap-3">
                        {icon && (
                            <div className="p-2 bg-crimson-500/10 rounded-lg text-crimson-400">
                                {icon}
                            </div>
                        )}
                        <div>
                            {title && (
                                <h2 className="text-xl font-bold text-white flex items-center gap-2 group">
                                    {/* Accent Line */}
                                    <div className="w-1 h-5 bg-gradient-to-b from-crimson-400 to-crimson-600 rounded-full" />
                                    {title}
                                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-crimson-400 group-hover:translate-x-1 transition-all" />
                                </h2>
                            )}
                            {subtitle && (
                                <p className="text-xs text-gray-500 mt-0.5 ml-3">{subtitle}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {actionButton}

                        {/* Arrow Controls (Large screens) */}
                        {showArrows && (
                            <div className={`hidden md:flex items-center gap-2 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                                <button
                                    onClick={() => scroll('left')}
                                    disabled={!canScrollLeft}
                                    className={`p-2 rounded-lg transition-all ${canScrollLeft
                                            ? 'bg-white/10 hover:bg-white/20 text-white'
                                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => scroll('right')}
                                    disabled={!canScrollRight}
                                    className={`p-2 rounded-lg transition-all ${canScrollRight
                                            ? 'bg-white/10 hover:bg-white/20 text-white'
                                            : 'bg-white/5 text-gray-600 cursor-not-allowed'
                                        }`}
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Scroll Container */}
            <div className="relative">
                {/* Left Fade */}
                {showFade && canScrollLeft && (
                    <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
                )}

                {/* Right Fade */}
                {showFade && canScrollRight && (
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
                )}

                {/* Left Arrow (Mobile/Tablet) */}
                {showArrows && canScrollLeft && (
                    <button
                        onClick={() => scroll('left')}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/80 hover:bg-crimson-600 text-white shadow-xl backdrop-blur-sm transition-all hover:scale-110 md:hidden"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                )}

                {/* Right Arrow (Mobile/Tablet) */}
                {showArrows && canScrollRight && (
                    <button
                        onClick={() => scroll('right')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/80 hover:bg-crimson-600 text-white shadow-xl backdrop-blur-sm transition-all hover:scale-110 md:hidden"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                )}

                {/* Scrollable Content */}
                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide pb-4 px-1"
                    style={{
                        scrollSnapType: 'x mandatory',
                        WebkitOverflowScrolling: 'touch'
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
}

// Section Divider Component
export function SectionDivider() {
    return (
        <div className="relative my-10">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.03]" />
            </div>
            <div className="relative flex justify-center">
                <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-crimson-500/30 to-transparent" />
            </div>
        </div>
    );
}
