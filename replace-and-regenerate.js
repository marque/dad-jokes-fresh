const fs = require('fs');
const { replaceJokeImage } = require('./replace-image');

const replaceAndRegenerate = async () => {
    console.log('🔄 Replacing 3 similar jokes and generating new images...');

    // Read the current state
    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

    // The specific replacements we want to make
    const replacements = [
        {
            date: "2025-09-22",
            oldJoke: "Why don't scientists trust atoms? Because they make up everything!",
            newJoke: "Why don't telescopes ever feel lonely? They're always seeing stars!",
            category: "wordplay"
        },
        {
            date: "2025-09-21",
            oldJoke: "What do you call a pig that does karate? A pork chop!",
            newJoke: "What do you call a bear that's good at photography? A snap bear!",
            category: "animals"
        },
        {
            date: "2025-08-28",
            oldJoke: "What do you call a fish that needs help with his vocals? Auto-tuna!",
            newJoke: "Why don't magnets ever feel rejected? They're always attractive!",
            category: "wordplay"
        }
    ];

    let replacedCount = 0;
    const datesToRegenerate = [];

    // Process each replacement
    for (const replacement of replacements) {
        const jokeIndex = jokesData.jokes.findIndex(joke =>
            joke.date === replacement.date && joke.joke === replacement.oldJoke
        );

        if (jokeIndex !== -1) {
            console.log(`✅ Replacing joke for ${replacement.date}:`);
            console.log(`   Old: "${replacement.oldJoke}"`);
            console.log(`   New: "${replacement.newJoke}"`);

            jokesData.jokes[jokeIndex].joke = replacement.newJoke;
            jokesData.jokes[jokeIndex].category = replacement.category;
            datesToRegenerate.push(replacement.date);
            replacedCount++;
        }
    }

    // Update metadata
    jokesData.metadata.lastUpdated = new Date().toISOString();

    // Write back to file
    fs.writeFileSync('./daily-jokes.json', JSON.stringify(jokesData, null, 2));
    console.log(`\n🎉 Successfully replaced ${replacedCount} jokes!`);

    // Generate new images for the replaced jokes
    console.log('\n🎨 Generating new images for replaced jokes...');

    for (const date of datesToRegenerate) {
        try {
            console.log(`\n🖼️  Generating image for ${date}...`);
            await replaceJokeImage(date);
            console.log(`✅ Successfully generated image for ${date}`);
        } catch (error) {
            console.error(`❌ Failed to generate image for ${date}:`, error.message);
        }
    }

    console.log('\n🎉 All similar jokes replaced and images regenerated!');
    return { replacedCount, regeneratedImages: datesToRegenerate.length };
};

// Command line usage
if (require.main === module) {
    replaceAndRegenerate().catch(error => {
        console.error('❌ Process failed:', error);
        process.exit(1);
    });
}

module.exports = { replaceAndRegenerate };