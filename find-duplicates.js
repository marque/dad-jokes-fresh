const fs = require('fs');

const findSimilarJokes = () => {
    console.log('🔍 Finding duplicate and similar jokes...');

    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));
    const jokes = jokesData.jokes;

    // Find exact duplicates
    const exactDuplicates = {};
    const similarJokes = [];

    console.log('\n📋 EXACT DUPLICATES:');
    console.log('==================');

    for (let i = 0; i < jokes.length; i++) {
        const joke1 = jokes[i];
        for (let j = i + 1; j < jokes.length; j++) {
            const joke2 = jokes[j];

            // Exact match
            if (joke1.joke === joke2.joke) {
                const key = joke1.joke;
                if (!exactDuplicates[key]) {
                    exactDuplicates[key] = [];
                }
                if (exactDuplicates[key].length === 0) {
                    exactDuplicates[key].push({date: joke1.date, joke: joke1.joke});
                }
                exactDuplicates[key].push({date: joke2.date, joke: joke2.joke});
            }
        }
    }

    // Print exact duplicates
    Object.keys(exactDuplicates).forEach(joke => {
        console.log(`\n"${joke}"`);
        exactDuplicates[joke].forEach(entry => {
            console.log(`  📅 ${entry.date}`);
        });
    });

    console.log('\n🔍 VERY SIMILAR JOKES:');
    console.log('=====================');

    // Find very similar jokes (same key words/concepts)
    const keywordGroups = {};

    jokes.forEach(jokeEntry => {
        const joke = jokeEntry.joke.toLowerCase();

        // Extract key concepts
        const concepts = [];

        // Check for common joke patterns
        if (joke.includes('impasta') || joke.includes('fake noodle')) {
            concepts.push('fake_noodle');
        }
        if (joke.includes('atoms') && joke.includes('make up everything')) {
            concepts.push('atoms_makeup');
        }
        if (joke.includes('scientists') && joke.includes('trust')) {
            concepts.push('scientists_trust');
        }
        if (joke.includes('king fish') || joke.includes('fish') && joke.includes('crown')) {
            concepts.push('fish_crown');
        }
        if (joke.includes('belt') && joke.includes('watches')) {
            concepts.push('belt_watches');
        }
        if (joke.includes('bicycle') && joke.includes('tired')) {
            concepts.push('bicycle_tired');
        }
        if (joke.includes('coffee') && joke.includes('mugged')) {
            concepts.push('coffee_mugged');
        }
        if (joke.includes('snowman') && joke.includes('six-pack')) {
            concepts.push('snowman_sixpack');
        }
        if (joke.includes('banana') && joke.includes('peeling')) {
            concepts.push('banana_peeling');
        }
        if (joke.includes('cow') && (joke.includes('no legs') || joke.includes('ground beef'))) {
            concepts.push('cow_no_legs');
        }
        if (joke.includes('pirates') && joke.includes('shore')) {
            concepts.push('pirates_shore');
        }
        if (joke.includes('skeletons') && (joke.includes('guts') || joke.includes('fight'))) {
            concepts.push('skeletons_fight');
        }
        if (joke.includes('dog magician') || joke.includes('labracadabrador')) {
            concepts.push('dog_magician');
        }
        if (joke.includes('elephants') && joke.includes('mouse')) {
            concepts.push('elephants_mouse');
        }
        if (joke.includes('stairs') && joke.includes('up to something')) {
            concepts.push('stairs_up_to_something');
        }
        if (joke.includes('bear') && joke.includes('teeth')) {
            concepts.push('bear_teeth');
        }
        if (joke.includes('eggs') && joke.includes('crack')) {
            concepts.push('eggs_crack');
        }
        if (joke.includes('sleeping bull') || joke.includes('bulldozer')) {
            concepts.push('sleeping_bull');
        }
        if (joke.includes('dinosaur') && joke.includes('crash')) {
            concepts.push('dinosaur_crash');
        }
        if (joke.includes('auto-tuna') || (joke.includes('fish') && joke.includes('vocals'))) {
            concepts.push('fish_vocals');
        }
        if (joke.includes('cheese') && joke.includes('nacho')) {
            concepts.push('nacho_cheese');
        }
        if (joke.includes('pork chop') && joke.includes('karate')) {
            concepts.push('pig_karate');
        }

        concepts.forEach(concept => {
            if (!keywordGroups[concept]) {
                keywordGroups[concept] = [];
            }
            keywordGroups[concept].push(jokeEntry);
        });
    });

    // Print similar groups
    Object.keys(keywordGroups).forEach(concept => {
        if (keywordGroups[concept].length > 1) {
            console.log(`\n📝 ${concept.toUpperCase().replace(/_/g, ' ')} (${keywordGroups[concept].length} variations):`);
            keywordGroups[concept].forEach(entry => {
                console.log(`  📅 ${entry.date}: "${entry.joke}"`);
            });
        }
    });

    console.log('\n📊 SUMMARY:');
    console.log('===========');
    console.log(`Total jokes: ${jokes.length}`);
    console.log(`Exact duplicates: ${Object.keys(exactDuplicates).length}`);
    console.log(`Similar concept groups: ${Object.keys(keywordGroups).filter(k => keywordGroups[k].length > 1).length}`);
};

if (require.main === module) {
    findSimilarJokes();
}

module.exports = { findSimilarJokes };