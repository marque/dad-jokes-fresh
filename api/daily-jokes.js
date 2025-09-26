const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
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
        const filePath = path.join(process.cwd(), 'daily-jokes.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const jokesData = JSON.parse(fileContent);

        res.setHeader('Cache-Control', 'public, max-age=60');
        res.json(jokesData);

    } catch (error) {
        console.error('Error serving daily jokes:', error.message);

        const fallbackData = {
            jokes: [{
                date: new Date().toISOString().split('T')[0],
                joke: "Why don't scientists trust atoms? Because they make up everything!",
                image: "",
                category: "science"
            }],
            metadata: {
                lastGenerated: new Date().toISOString(),
                totalJokes: 1,
                oldestDate: new Date().toISOString().split('T')[0],
                newestDate: new Date().toISOString().split('T')[0]
            }
        };

        res.status(200).json(fallbackData);
    }
};