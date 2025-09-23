// Enhanced prompt strategies for more comical images

const getComicalPrompt = (joke) => {
    // Extract key words from the joke for visual focus
    const keywords = extractJokeKeywords(joke);

    // Multiple prompt styles to choose from
    const styles = [
        // Style 1: Exaggerated cartoon
        `Create an extremely silly and exaggerated cartoon illustration of: ${joke}.
         Style: bright colors, oversized expressions, goofy characters, visual puns,
         comic book style, funny facial expressions, dramatic poses, family-friendly humor`,

        // Style 2: Visual pun focused
        `Illustrate the visual pun in this dad joke: ${joke}.
         Style: literal interpretation, absurd and funny, cartoon style,
         bright colors, silly characters, emphasize the wordplay visually`,

        // Style 3: Character-focused comedy
        `Draw funny cartoon characters acting out: ${joke}.
         Style: expressive faces, comical situations, colorful cartoon art,
         dad character with silly expressions, visual comedy, family-friendly`,

        // Style 4: Scene-based humor
        `Create a humorous cartoon scene showing: ${joke}.
         Style: funny background details, cartoon physics, exaggerated reactions,
         bright cheerful colors, comic timing captured in still image`
    ];

    // Randomly select a style or use keyword-based selection
    return selectBestStyle(joke, styles);
};

const extractJokeKeywords = (joke) => {
    // Extract nouns, verbs, and pun words for better visual focus
    const words = joke.toLowerCase().split(' ');
    // Add logic to identify key visual elements
    return words.filter(word =>
        word.length > 3 &&
        !['that', 'they', 'what', 'because', 'when', 'where'].includes(word)
    );
};

const selectBestStyle = (joke, styles) => {
    // Logic to match joke type with best visual style
    if (joke.includes('atom')) return styles[1]; // Visual pun style
    if (joke.includes('scientist')) return styles[2]; // Character style
    if (joke.includes('why')) return styles[0]; // Exaggerated style
    return styles[0]; // Default to exaggerated
};

module.exports = { getComicalPrompt };