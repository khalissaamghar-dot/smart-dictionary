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
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { message, lang = 'fr' } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!GEMINI_API_KEY) {
        return res.status(500).json({ reply: "Configuration error: API Key missing on server." });
    }

    // List of models to try in order of preference
    const models = ['gemini-1.5-flash', 'gemini-pro'];
    let lastError = "Unknown error";
    
    for (const modelName of models) {
        try {
            // Try both v1 and v1beta
            const apiVersions = ['v1', 'v1beta'];
            for (const version of apiVersions) {
                const response = await fetch(`https://generativelanguage.googleapis.com/${version}/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: systemPrompt(lang) + "\n\nStudent asks: " + message }] }]
                    })
                });

                const data = await response.json();

                if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                    return res.status(200).json({ reply: data.candidates[0].content.parts[0].text });
                }
                
                if (data.error) {
                    lastError = `${modelName} (${version}): ${data.error.message}`;
                    continue; 
                }
            }
        } catch (err) {
            lastError = err.message;
            continue;
        }
    }

    return res.status(500).json({ reply: `Désolé, l'IA est indisponible. Détail technique : ${lastError}` });
}
