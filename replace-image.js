require('dotenv').config();
const fs = require('fs');
const generateImage = require('./api/generate-image');

// Script to replace a specific joke's image with a more comical version

const replaceJokeImage = async (jokeDate, customPrompt = null) => {
    console.log(`🎨 Replacing image for joke: ${jokeDate}`);

    // Load current jokes
    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));
    const joke = jokesData.jokes.find(j => j.date === jokeDate);

    if (!joke) {
        console.error(`❌ Joke not found for date: ${jokeDate}`);
        return;
    }

    console.log(`📝 Original joke: ${joke.joke}`);
    console.log(`🖼️  Current image: ${joke.image}`);

    // Create enhanced prompt or use custom
    const enhancedPrompt = customPrompt || createEnhancedPrompt(joke.joke);
    console.log(`✨ Enhanced prompt: ${enhancedPrompt}`);

    // Mock request/response for image generation
    const mockReq = {
        method: 'POST',
        body: { prompt: enhancedPrompt }
    };

    const mockRes = {
        setHeader: () => {},
        json: (data) => {
            if (data.success) {
                console.log('✅ New image generated successfully!');

                // Here you would upload to Google Cloud Storage
                // and update the joke's image URL

                // For now, we'll simulate updating the JSON
                joke.image = `https://storage.googleapis.com/dad-jokes-ai-images-2024/enhanced/${jokeDate}.png`;

                // Save updated jokes
                fs.writeFileSync('./daily-jokes.json', JSON.stringify(jokesData, null, 2));
                console.log(`🎉 Image URL updated for ${jokeDate}`);

                // Optionally save the base64 image locally for review
                if (data.imageUrl.startsWith('data:image')) {
                    const base64Data = data.imageUrl.replace(/^data:image\/png;base64,/, '');
                    // Create previews directory if it doesn't exist
                    if (!fs.existsSync('./previews/images')) {
                        fs.mkdirSync('./previews/images', { recursive: true });
                    }
                    fs.writeFileSync(`./previews/images/preview-${jokeDate}.png`, base64Data, 'base64');
                    console.log(`💾 Preview saved as previews/images/preview-${jokeDate}.png`);
                }
            } else {
                console.log('⚠️  Image generation failed:', data.error);
            }
        }
    };

    try {
        await generateImage(mockReq, mockRes);
    } catch (error) {
        console.error('❌ Error replacing image:', error.message);
    }
};

const createEnhancedPrompt = (joke) => {
    // More comical prompt variations
    const comicalStyles = [
        `Create an EXTREMELY funny and exaggerated cartoon showing: ${joke}.
         Make it super silly with: huge googly eyes, enormous grins, wild gestures,
         bright rainbow colors, comic book style, visual puns, absolutely ridiculous and family-friendly`,

        `Draw a hilarious cartoon scene of: ${joke}.
         Style: dad joke humor, visual wordplay, silly cartoon physics,
         characters with funny expressions, colorful and cheerful, comic strip style`,

        `Illustrate this dad joke in the most comical way possible: ${joke}.
         Include: funny cartoon characters, absurd situations, bright colors,
         exaggerated reactions, visual comedy, family-friendly silliness`
    ];

    // Randomly select or use logic to pick best style
    return comicalStyles[Math.floor(Math.random() * comicalStyles.length)];
};

// Command line usage
if (require.main === module) {
    const jokeDate = process.argv[2];
    const customPrompt = process.argv[3];

    if (!jokeDate) {
        console.log('Usage: node replace-image.js YYYY-MM-DD [custom-prompt]');
        console.log('Example: node replace-image.js 2025-09-22');
        process.exit(1);
    }

    replaceJokeImage(jokeDate, customPrompt);
}

module.exports = { replaceJokeImage };