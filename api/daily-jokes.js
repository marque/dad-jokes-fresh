const fs = require('fs');
const path = require('path');

// API endpoint to serve daily jokes data
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Read the daily-jokes.json file
        const filePath = path.join(process.cwd(), 'daily-jokes.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jokesData = JSON.parse(fileContent);

        res.json(jokesData);

    } catch (error) {
        console.error('❌ Error serving daily jokes:', error.message);

        // Fallback to hardcoded data if file read fails
        const fallbackData = {
            "jokes": [
                {
                    "date": "2025-09-19",
                    "joke": "Why don't scientists trust atoms? Because they make up everything!",
                    "image": "https://storage.googleapis.com/dad-jokes-ai-images-2024/science/V2h5IGRvbi_1758278701254.png",
                    "category": "science"
                }
            ]
        };

        res.json(fallbackData);
    }
};