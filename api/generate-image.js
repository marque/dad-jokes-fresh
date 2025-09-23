const { GoogleAuth } = require('google-auth-library');
const fs = require('fs');

// Google Cloud setup
let auth;
let credentials;

try {
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.error('❌ GOOGLE_APPLICATION_CREDENTIALS environment variable not found');
        throw new Error('GOOGLE_APPLICATION_CREDENTIALS environment variable not found');
    }

    const credentialsPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;

    // Check if it's a file path or JSON string
    if (credentialsPath.startsWith('/') || credentialsPath.startsWith('./')) {
        // It's a file path
        console.log('📁 Loading credentials from file:', credentialsPath);
        const credentialsContent = fs.readFileSync(credentialsPath, 'utf8');
        credentials = JSON.parse(credentialsContent);
    } else {
        // It's a JSON string
        console.log('📋 Parsing credentials from environment variable');
        let credentialsString = credentialsPath;

        // Handle potential double-encoding or escape characters
        if (credentialsString.startsWith('"') && credentialsString.endsWith('"')) {
            credentialsString = credentialsString.slice(1, -1);
        }

        // Replace escaped quotes if present
        credentialsString = credentialsString.replace(/\\"/g, '"');
        credentials = JSON.parse(credentialsString);
    }

    console.log('✅ Successfully loaded Google Cloud credentials');

    // Initialize Google Auth
    auth = new GoogleAuth({
        credentials: credentials,
        scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    console.log('✅ Google Auth initialized successfully');
} catch (error) {
    console.error('❌ Google Auth initialization failed:', error.message);
    auth = null;
}

const projectId = credentials?.project_id || 'daily-dad-joke-472514';
const location = 'us-central1';

// Vercel serverless function
module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // Body parsing
        let body = req.body;
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (_) {
                body = {};
            }
        }

        const { prompt } = body || {};

        if (!prompt || typeof prompt !== 'string') {
            return res.status(400).json({ error: 'Missing prompt' });
        }

        console.log('🎨 Generating image for prompt:', prompt);

        // Check if auth is initialized
        if (!auth) {
            throw new Error('Google Auth not initialized - check environment variables');
        }

        // Get authenticated client
        const client = await auth.getClient();
        console.log('✅ Google Auth client obtained');

        // Multiple endpoints to try for quota distribution
        const endpoints = [
            // Different regions
            `https://aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`,
            `https://aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-east1/publishers/google/models/imagen-3.0-generate-001:predict`,
            `https://aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-west1/publishers/google/models/imagen-3.0-generate-001:predict`,
            `https://aiplatform.googleapis.com/v1/projects/${projectId}/locations/europe-west4/publishers/google/models/imagen-3.0-generate-001:predict`,
            // Different models
            `https://aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-central1/publishers/google/models/imagen-3.0-fast-generate-001:predict`,
            `https://aiplatform.googleapis.com/v1/projects/${projectId}/locations/us-east1/publishers/google/models/imagen-3.0-fast-generate-001:predict`,
        ];

        let endpoint = endpoints[0];

        // Imagen 3 request
        const imageRequest = {
            instances: [
                {
                    prompt: `Create a funny cartoon illustration for this dad joke: ${prompt}. Style: colorful, simple cartoon, family-friendly, humorous`
                }
            ],
            parameters: {
                sampleCount: 1,
                aspectRatio: "1:1",
                safetyFilterLevel: "block_few",
                personGeneration: "dont_allow",
                includeRaiReason: false,
                addWatermark: false
            }
        };

        // Try multiple endpoints if quota is exceeded
        let response;
        let lastError;

        for (let i = 0; i < endpoints.length; i++) {
            endpoint = endpoints[i];

            try {
                console.log(`🌐 Making request to (attempt ${i + 1}/${endpoints.length}):`, endpoint);
                console.log('📝 Request payload:', JSON.stringify(imageRequest, null, 2));

                response = await client.request({
                    url: endpoint,
                    method: 'POST',
                    data: imageRequest
                });

                // If successful, break out of the loop
                if (response.data && response.data.predictions && response.data.predictions[0]) {
                    break;
                }

            } catch (error) {
                lastError = error;
                console.log(`❌ Attempt ${i + 1} failed:`, error.message);

                // If it's a quota error and we have more endpoints to try, continue
                if (error.message.includes('Quota exceeded') && i < endpoints.length - 1) {
                    console.log(`🔄 Trying next endpoint...`);
                    continue;
                }

                // If it's not a quota error or we're out of endpoints, throw
                throw error;
            }
        }

        console.log('📨 Response status:', response.status);
        console.log('📨 Response data:', JSON.stringify(response.data, null, 2));

        if (response.data && response.data.predictions && response.data.predictions[0]) {
            const imageBase64 = response.data.predictions[0].bytesBase64Encoded;
            console.log('✅ Image generated successfully!');

            res.json({
                success: true,
                imageUrl: `data:image/png;base64,${imageBase64}`,
                prompt: prompt
            });
        } else {
            console.log('⚠️ No predictions in response');
            throw new Error('No image generated - check response structure');
        }

    } catch (error) {
        console.error('❌ Image generation failed:', error.message);

        // Fallback to placeholder image
        const colors = ['FF6B6B', '4ECDC4', '45B7D1', 'F9CA24', 'F0932B', 'EB4D4B', '6C5CE7', 'A29BFE'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const fallbackCaption = encodeURIComponent('🎭 AI is thinking...');

        res.json({
            success: false,
            imageUrl: `https://via.placeholder.com/400x400/${randomColor}/FFFFFF?text=${fallbackCaption}`,
            error: error.message,
            fallback: true
        });
    }
};