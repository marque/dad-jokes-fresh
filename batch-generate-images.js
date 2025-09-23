require('dotenv').config();
const fs = require('fs');
const { replaceJokeImage } = require('./replace-image');

// Script to batch generate images with delays to manage quota
const batchGenerateImages = async () => {
    console.log('🚀 Starting batch image generation...');

    // Load current jokes to find which ones need images
    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));
    const jokesToProcess = [];

    // Find jokes that don't have generated images yet
    for (const joke of jokesData.jokes) {
        const imagePath = `./previews/ghibli-style/preview-${joke.date}.png`;
        if (!fs.existsSync(imagePath)) {
            jokesToProcess.push(joke.date);
        }
    }

    console.log(`📋 Found ${jokesToProcess.length} jokes that need images`);

    if (jokesToProcess.length === 0) {
        console.log('✅ All jokes already have images!');
        return;
    }

    // Process in batches with delays
    const BATCH_SIZE = 3; // Process 3 at a time
    const DELAY_BETWEEN_BATCHES = 10000; // 10 seconds between batches
    const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds between individual requests

    for (let i = 0; i < jokesToProcess.length; i += BATCH_SIZE) {
        const batch = jokesToProcess.slice(i, i + BATCH_SIZE);
        console.log(`\n🎯 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(jokesToProcess.length / BATCH_SIZE)}`);
        console.log(`📅 Dates: ${batch.join(', ')}`);

        for (const date of batch) {
            try {
                console.log(`\n🎨 Generating image for ${date}...`);
                await replaceJokeImage(date);
                console.log(`✅ Successfully generated image for ${date}`);

                // Small delay between individual requests
                if (batch.indexOf(date) < batch.length - 1) {
                    console.log(`⏳ Waiting ${DELAY_BETWEEN_REQUESTS / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
                }
            } catch (error) {
                console.error(`❌ Failed to generate image for ${date}:`, error.message);

                // If we hit quota limit, take a longer break
                if (error.message.includes('Quota exceeded')) {
                    console.log('🛑 Quota exceeded. Taking a longer break...');
                    await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute break
                }
            }
        }

        // Delay between batches (except for the last batch)
        if (i + BATCH_SIZE < jokesToProcess.length) {
            console.log(`\n⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000} seconds before next batch...`);
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
    }

    console.log('\n🎉 Batch image generation completed!');
};

// Command line usage
if (require.main === module) {
    batchGenerateImages().catch(error => {
        console.error('❌ Batch generation failed:', error);
        process.exit(1);
    });
}

module.exports = { batchGenerateImages };