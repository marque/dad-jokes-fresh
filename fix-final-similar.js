const fs = require('fs');

const fixFinalSimilarJokes = () => {
    console.log('🔄 Fixing the final similar jokes with completely unique concepts...');

    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

    // Get all existing jokes to avoid duplicates
    const existingJokes = jokesData.jokes.map(j => j.joke.toLowerCase());

    // Completely fresh jokes that don't exist anywhere in the database
    const uniqueReplacements = [
        {
            date: "2025-09-22",
            newJoke: "Why don't telescopes ever feel lonely? They're always seeing stars!",
            category: "wordplay"
        },
        {
            date: "2025-09-21",
            newJoke: "What do you call a bear that's good at photography? A snap bear!",
            category: "animals"
        },
        {
            date: "2025-08-28",
            newJoke: "Why don't magnets ever feel rejected? They're always attractive!",
            category: "wordplay"
        }
    ];

    let replacedCount = 0;

    // Process each replacement
    uniqueReplacements.forEach(replacement => {
        const jokeIndex = jokesData.jokes.findIndex(joke => joke.date === replacement.date);
        if (jokeIndex !== -1) {
            // Check if new joke already exists
            if (!existingJokes.includes(replacement.newJoke.toLowerCase())) {
                const oldJoke = jokesData.jokes[jokeIndex].joke;
                jokesData.jokes[jokeIndex].joke = replacement.newJoke;
                jokesData.jokes[jokeIndex].category = replacement.category;
                console.log(`✅ Replaced joke for ${replacement.date}:`);
                console.log(`   Old: "${oldJoke}"`);
                console.log(`   New: "${replacement.newJoke}"`);
                replacedCount++;
            } else {
                console.log(`⚠️  Skipped ${replacement.date} - replacement already exists`);
            }
        }
    });

    // Update metadata
    jokesData.metadata.lastUpdated = new Date().toISOString();

    // Write back to file
    fs.writeFileSync('./daily-jokes.json', JSON.stringify(jokesData, null, 2));

    console.log(`\n🎉 Successfully replaced ${replacedCount} jokes with completely unique concepts!`);

    return replacedCount;
};

// Command line usage
if (require.main === module) {
    fixFinalSimilarJokes();
}

module.exports = { fixFinalSimilarJokes };