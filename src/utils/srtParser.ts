export interface SubtitleLine {
    id: number;
    startTime: string;
    endTime: string;
    text: string;
}

export const parseSRT = (srtContent: string): SubtitleLine[] => {
    const lines = srtContent.replace(/\r\n/g, '\n').split('\n\n');
    return lines.map(line => {
        const parts = line.split('\n');
        if (parts.length >= 3) {
            return {
                id: Number(parts[0]),
                startTime: parts[1].split(' --> ')[0],
                endTime: parts[1].split(' --> ')[1],
                text: parts.slice(2).join('\n')
            };
        }
        return null;
    }).filter(Boolean) as SubtitleLine[];
};
