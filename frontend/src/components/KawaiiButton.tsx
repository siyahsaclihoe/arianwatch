export default function KawaiiButton({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) {
    return (
        <button
            onClick={onClick}
            className="px-6 py-2 bg-pink-300 hover:bg-pink-400 text-white font-bold rounded-full shadow-lg transform transition hover:scale-105 active:scale-95"
        >
            {children} ✨
        </button>
    );
}
