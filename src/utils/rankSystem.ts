export const getRank = (xp: number): string => {
    if (xp < 100) return "Newbie 🥚";
    if (xp < 500) return "Kohai 🐣";
    if (xp < 1000) return "Senpai 🌸";
    if (xp < 5000) return "Sama 👑";
    return "Kami-sama ✨";
};

export const calculateNextRank = (xp: number): number => {
    if (xp < 100) return 100;
    if (xp < 500) return 500;
    if (xp < 1000) return 1000;
    return 5000;
}
