const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'users.json');

app.use(cors());
app.use(bodyParser.json());

// Ensure data directory and file exist
async function ensureData() {
    await fs.ensureDir(path.join(__dirname, 'data'));
    if (!await fs.pathExists(DATA_FILE)) {
        // Initial Admin account
        const initialUsers = [
            {
                id: 'admin_01',
                email: 'admin@ssd.com',
                password: 'admin',
                name: 'System Admin',
                role: 'administrator',
                status: 'approved'
            }
        ];
        await fs.writeJson(DATA_FILE, initialUsers);
    }
}

// Routes
app.post('/api/register', async (req, res) => {
    const { email, password, name, role, lastName, institution } = req.body;
    const users = await fs.readJson(DATA_FILE);

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = {
        id: 'u_' + Date.now(),
        email,
        password,
        name,
        lastName: lastName || '',
        institution: institution || '',
        role,
        status: role === 'teacher' ? 'pending' : 'approved'
    };

    users.push(newUser);
    await fs.writeJson(DATA_FILE, users);

    res.json({
        message: 'Registration successful',
        status: newUser.status
    });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    const users = await fs.readJson(DATA_FILE);

    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.status === 'pending') {
        return res.status(403).json({ message: 'Your teacher account is pending administrator approval.' });
    }

    // Don't send password back
    const { password: _, ...userSafe } = user;
    res.json(userSafe);
});

// Admin: Get pending teachers
app.get('/api/admin/pending', async (req, res) => {
    const users = await fs.readJson(DATA_FILE);
    const pending = users.filter(u => u.role === 'teacher' && u.status === 'pending');
    res.json(pending);
});

// Admin: Process approval
app.post('/api/admin/approve', async (req, res) => {
    const { userId, action } = req.body; // action: 'approved' or 'rejected'
    const users = await fs.readJson(DATA_FILE);

    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex === -1) return res.status(404).json({ message: 'User not found' });

    if (action === 'approved') {
        users[userIndex].status = 'approved';
    } else {
        users.splice(userIndex, 1); // Delete if rejected for simplicity
    }

    await fs.writeJson(DATA_FILE, users);
    res.json({ message: `User ${action}` });
});

// AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
    const { message, lang } = req.body;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const systemPrompt = `You are the "Scientific Assistant" for the Smart Scientific Dictionary. 
    Your audience is students aged 12-18 (Collège/Lycée).
    - Tone: Pedagogical, encouraging, clear, and modern.
    - Level: Explain complex concepts using analogies suitable for teens.
    - Structure: Short paragraphs, bullet points when useful.
    - Security: Focus ONLY on science, education, and the dictionary terms.
    - Language: Respond in ${lang === 'fr' ? 'French' : lang === 'ar' ? 'Arabic' : lang === 'amz' ? 'Amazigh (Tamazight)' : 'English'}.
    - Goal: Foster scientific curiosity and help with school-level science questions.
    - Integration: If you mention a specific scientific term that is commonly found in a dictionary, highlight it (e.g. **Term**).`;

    if (!GEMINI_API_KEY) {
        // High-Quality Pedagogical Fallback (Internal AI)
        const lower = message.toLowerCase();
        let reply = "";

        if (lower.includes('atome') || lower.includes('atom')) {
            reply = "Imagine l'atome comme un mini système solaire ! Au centre, le noyau (le Soleil), et autour, les électrons qui gravitent (les planètes). C'est la base de toute la matière qui nous entoure.";
        } else if (lower.includes('gravit') || lower.includes('gravity')) {
            reply = "La gravité, c'est comme un aimant géant invisible qui nous colle au sol. Plus un objet est massif (comme la Terre), plus il nous attire fort. C'est grâce à elle que la Lune reste près de nous !";
        } else if (lower.includes('photo')) {
            reply = "La photosynthèse, c'est la cuisine magique des plantes : elles prennent du soleil, du gaz carbonique (CO2) et de l'eau pour fabriquer leur propre nourriture et rejeter de l'oxygène pour nous !";
        } else {
            reply = `En tant qu'assistant scientifique pour le niveau Collège/Lycée, je trouve ta question sur "${message}" passionnante ! Pour t'aider au mieux, peux-tu préciser si tu veux une explication simple, un exemple concret ou une expérience à faire ?`;
        }

        return res.json({ reply: reply + "\n\n(Mode: Pedagogical Local IA)" });
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            body: JSON.stringify({
                contents: [{ parts: [{ text: systemPrompt + "\n\nStudent asks: " + message }] }]
            })
        });
        const data = await response.json();
        const aiReply = data.candidates[0].content.parts[0].text;
        res.json({ reply: aiReply });
    } catch (err) {
        res.status(500).json({ message: 'Error calling AI Service' });
    }
});

(async () => {
    await ensureData();
    app.listen(PORT, () => {
        console.log(`SSD Backend running at http://localhost:${PORT}`);
    });
})();
