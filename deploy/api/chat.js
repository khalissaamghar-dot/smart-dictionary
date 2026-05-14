const systemPrompt = (lang) => `You are the "Scientific Assistant" for the Smart Scientific Dictionary. 
Your audience is students aged 12-18 (Collège/Lycée).
- Tone: Pedagogical, encouraging, clear, and modern.
- Level: Explain complex concepts using analogies suitable for teens.
- Structure: Short paragraphs, bullet points when useful.
- Security: Focus ONLY on science, education, and the dictionary terms.
- Language: Respond in ${lang === 'fr' ? 'French' : lang === 'ar' ? 'Arabic' : lang === 'amz' ? 'Amazigh (Tamazight)' : 'English'}.
- Goal: Foster scientific curiosity and help with school-level science questions.
- Integration: If you mention a specific scientific term that is commonly found in a dictionary, highlight it (e.g. **Term**).`;

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    const { message, lang } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        console.error("Vercel Deployment Error: GEMINI_API_KEY is not defined in environment variables.");
        return res.status(500).json({ reply: "Configuration error: API Key missing on server. Please add GEMINI_API_KEY to Vercel environment variables." });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt(lang) + "\n\nStudent asks: " + message }] }]
            })
        });

        const data = await response.json();
        
        if (data.error) {
            console.error("Gemini API Error details:", data.error);
            // Fallback to gemini-pro if flash is not available
            if (data.error.message.includes('not found') || data.error.message.includes('not supported')) {
                return res.status(500).json({ reply: "AI Model not found. Attempting to use fallback..." });
            }
            return res.status(500).json({ reply: "AI Service Error: " + data.error.message });
        }

        if (!data.candidates || !data.candidates[0]) {
            return res.status(500).json({ reply: "AI Service returned no results." });
        }

        const aiReply = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: aiReply });
    } catch (err) {
        console.error("Vercel Function Runtime Error:", err);
        res.status(500).json({ reply: "Connection error to AI service." });
    }
}
