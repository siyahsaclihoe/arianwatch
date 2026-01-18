import axios from 'axios';

interface RecommendationsResponse {
    recommendations: string[];
}

export const getRecommendations = async (userHistory: string[]): Promise<string[]> => {
    try {
        const prompt = `Based on the following anime history: ${userHistory.join(', ')}, recommend 10 kawaii or similar anime titles. Return only a JSON array of strings.`;

        // Fallback if env not set
        const apiUrl = process.env.LLAMA_API_URL || 'http://localhost:8080/infer';

        const response = await axios.post(apiUrl, {
            prompt: prompt,
            max_tokens: 256
        }, { timeout: 2000 }); // Fast timeout for fallback

        // Mock parsing assumption - in real life needs better parsing of LLM output
        // This assumes the LLM returns a raw JSON array string
        const text = response.data?.content || "[]";
        // basic cleanup
        const jsonStr = text.substring(text.indexOf('['), text.lastIndexOf(']') + 1);
        return JSON.parse(jsonStr);
    } catch (error) {
        console.warn("LLaMA offline or error, using fallback recommendations.");
        return ["Naruto", "One Piece", "Bleach", "K-On!", "Lucky Star"]; // Fallback
    }
};
