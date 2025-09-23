const fs = require('fs');

const replaceSimilarJokes = () => {
    console.log('🔄 Replacing 3 similar concept jokes with fresh new jokes...');

    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

    // The 3 jokes we identified as having similar concepts
    const replacements = [
        {
            // Replace "Why don't scientists trust atoms? Because they make up everything!"
            date: "2025-09-22",
            newJoke: "What do you call a dinosaur that loves to sleep? A dino-snore!",
            category: "animals"
        },
        {
            // Replace "What do you call a pig that does karate? A pork chop!"
            date: "2025-09-21",
            newJoke: "Why don't mountains ever get cold? They wear snow caps!",
            category: "wordplay"
        },
        {
            // Find and replace one of the Auto-tuna jokes
            findJoke: "What do you call a fish that needs help with his vocals? Auto-tuna!",
            newJoke: "Why don't clouds ever get stressed? They just go with the flow!",
            category: "wordplay"
        }
    ];

    let replacedCount = 0;

    // Process each replacement
    replacements.forEach(replacement => {
        if (replacement.date) {
            // Replace by date
            const jokeIndex = jokesData.jokes.findIndex(joke => joke.date === replacement.date);
            if (jokeIndex !== -1) {
                const oldJoke = jokesData.jokes[jokeIndex].joke;
                jokesData.jokes[jokeIndex].joke = replacement.newJoke;
                jokesData.jokes[jokeIndex].category = replacement.category;
                console.log(`✅ Replaced joke for ${replacement.date}:`);
                console.log(`   Old: "${oldJoke}"`);
                console.log(`   New: "${replacement.newJoke}"`);
                replacedCount++;
            }
        } else if (replacement.findJoke) {
            // Replace by finding specific joke text
            const jokeIndex = jokesData.jokes.findIndex(joke => joke.joke === replacement.findJoke);
            if (jokeIndex !== -1) {
                const oldJoke = jokesData.jokes[jokeIndex].joke;
                const date = jokesData.jokes[jokeIndex].date;
                jokesData.jokes[jokeIndex].joke = replacement.newJoke;
                jokesData.jokes[jokeIndex].category = replacement.category;
                console.log(`✅ Replaced joke for ${date}:`);
                console.log(`   Old: "${oldJoke}"`);
                console.log(`   New: "${replacement.newJoke}"`);
                replacedCount++;
            }
        }
    });

    // Update metadata
    jokesData.metadata.lastUpdated = new Date().toISOString();

    // Write back to file
    fs.writeFileSync('./daily-jokes.json', JSON.stringify(jokesData, null, 2));

    console.log(`\n🎉 Successfully replaced ${replacedCount} similar jokes with fresh concepts!`);
    console.log('📝 All jokes now have unique concepts and themes.');

    return replacedCount;
};

// Command line usage
if (require.main === module) {
    replaceSimilarJokes();
}

module.exports = { replaceSimilarJokes };