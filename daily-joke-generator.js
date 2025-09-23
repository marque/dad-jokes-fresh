require('dotenv').config();
const fs = require('fs');
const { replaceJokeImage } = require('./replace-image');

// AI-powered joke generation using OpenAI (you can switch to another AI service)
const generateDadJoke = async () => {
    // For now, we'll use a curated list of fresh dad jokes
    // In production, you could integrate with OpenAI GPT or another AI service
    const freshJokes = [
        { joke: "Why don't calculators ever get stressed? They always count on themselves!", category: "wordplay" },
        { joke: "What do you call a fish that's good at photography? A snap-per!", category: "animals" },
        { joke: "Why did the pencil break up with the eraser? It felt like it was being rubbed the wrong way!", category: "wordplay" },
        { joke: "What do you call a cow that can't produce milk? An udder failure!", category: "animals" },
        { joke: "Why don't traffic lights ever get tired? They're always changing!", category: "wordplay" },
        { joke: "What do you call a dinosaur that's really good at hide and seek? Do-you-think-he-saurus!", category: "animals" },
        { joke: "Why did the cookie become a detective? It was good at crumb-ling cases!", category: "food" },
        { joke: "What do you call a sleeping car? A car-nap!", category: "wordplay" },
        { joke: "Why don't robots ever panic? They have good circuit-ry!", category: "technology" },
        { joke: "What do you call a fish that's good at basketball? A slam-dunk-fish!", category: "sports" },
        { joke: "Why did the clock go to therapy? It had too much time on its hands!", category: "wordplay" },
        { joke: "What do you call a bear that's good at archery? Robin Bear!", category: "animals" },
        { joke: "Why don't keyboards ever get lost? They always know their way around!", category: "technology" },
        { joke: "What do you call a cow that's good at yoga? A flexi-bull!", category: "animals" },
        { joke: "Why did the lamp go to school? To get brighter!", category: "wordplay" },
        { joke: "What do you call a fish that's good at singing? A bass singer!", category: "music" },
        { joke: "Why don't doors ever get tired? They're always opening new opportunities!", category: "wordplay" },
        { joke: "What do you call a pig that's good at archery? A pork-cupine!", category: "animals" },
        { joke: "Why did the phone go to the doctor? It had a bad connection!", category: "technology" },
        { joke: "What do you call a cow that's good at detective work? Sherlock Moos!", category: "animals" }
    ];

    // Select a random joke
    const randomIndex = Math.floor(Math.random() * freshJokes.length);
    return freshJokes[randomIndex];
};

const getNextDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
};

const jokeExists = (date) => {
    try {
        const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));
        return jokesData.jokes.some(joke => joke.date === date);
    } catch (error) {
        console.error('Error reading jokes file:', error);
        return false;
    }
};

const addJokeToDatabase = (date, jokeText, category) => {
    try {
        const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

        // Create new joke entry
        const newJoke = {
            date: date,
            joke: jokeText,
            image: `/previews/images/preview-${date}.png`, // Default path, will be updated after image generation
            category: category
        };

        // Add to beginning of array (most recent first)
        jokesData.jokes.unshift(newJoke);

        // Update metadata
        jokesData.metadata.lastGenerated = new Date().toISOString();
        jokesData.metadata.totalJokes = jokesData.jokes.length;
        jokesData.metadata.newestDate = jokesData.jokes[0].date;

        // Write back to file
        fs.writeFileSync('./daily-jokes.json', JSON.stringify(jokesData, null, 2));

        console.log(`✅ Added new joke for ${date}: "${jokeText}"`);
        return true;
    } catch (error) {
        console.error('Error adding joke to database:', error);
        return false;
    }
};

const generateTomorrowsJoke = async () => {
    console.log('🚀 Starting automated daily joke generation...');

    const tomorrow = getNextDate();
    console.log(`📅 Checking for joke on ${tomorrow}...`);

    // Check if tomorrow's joke already exists
    if (jokeExists(tomorrow)) {
        console.log(`✅ Joke for ${tomorrow} already exists. Nothing to do!`);
        return;
    }

    try {
        // Generate new joke
        console.log('🎭 Generating new dad joke...');
        const newJoke = await generateDadJoke();

        // Add to database
        console.log('📝 Adding joke to database...');
        const added = addJokeToDatabase(tomorrow, newJoke.joke, newJoke.category);

        if (!added) {
            throw new Error('Failed to add joke to database');
        }

        // Generate image for the joke
        console.log('🎨 Generating AI image for the joke...');
        await replaceJokeImage(tomorrow);

        console.log(`🎉 Successfully generated tomorrow's joke for ${tomorrow}!`);
        console.log(`📊 Joke: "${newJoke.joke}"`);
        console.log(`📁 Category: ${newJoke.category}`);

    } catch (error) {
        console.error('❌ Failed to generate tomorrow\'s joke:', error.message);
        process.exit(1);
    }
};

// Command line usage
if (require.main === module) {
    generateTomorrowsJoke().catch(error => {
        console.error('❌ Daily joke generation failed:', error);
        process.exit(1);
    });
}

module.exports = { generateTomorrowsJoke, generateDadJoke, getNextDate };