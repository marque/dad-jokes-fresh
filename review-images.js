require('dotenv').config();
const fs = require('fs');
const { replaceJokeImage } = require('./replace-image');

// Interactive script to review and replace images

const reviewAllImages = async () => {
    console.log('🎨 Dad Jokes Image Review Tool\n');

    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

    console.log('📋 Available jokes for review:');
    jokesData.jokes.forEach((joke, index) => {
        console.log(`${index + 1}. ${joke.date}: "${joke.joke.substring(0, 50)}..."`);
    });

    // In a real implementation, you'd use readline for interactive input
    console.log('\n🔧 How to replace images:');
    console.log('1. Run: npm run replace-image YYYY-MM-DD');
    console.log('2. Or use custom prompt: npm run replace-image YYYY-MM-DD "your custom prompt"');
    console.log('3. Review the generated preview-YYYY-MM-DD.png file');
    console.log('4. If satisfied, the JSON will be updated with new URL\n');

    // Show current prompt style
    console.log('💡 Current prompt style examples:');
    console.log('- Basic: "Create a funny cartoon illustration for this dad joke"');
    console.log('- Enhanced: "Create an EXTREMELY funny and exaggerated cartoon with huge googly eyes..."');
    console.log('- Custom: You can specify exactly what you want!\n');

    // Example replacements
    console.log('🎯 Suggested improvements for more comical images:');
    console.log('• Add "googly eyes" and "exaggerated expressions"');
    console.log('• Use "comic book style" and "visual puns"');
    console.log('• Include "silly cartoon physics" and "rainbow colors"');
    console.log('• Specify "dad character with mustache and funny face"');
    console.log('• Add "speech bubbles" and "action lines"');
};

// Quick test function for the atom joke
const testAtomJoke = async () => {
    console.log('🧪 Testing enhanced prompt for atom joke...\n');

    const enhancedPrompt = `Create an EXTREMELY comical cartoon of tiny atoms with huge googly eyes,
    wearing tiny lab coats, pointing at each other and laughing mischievously.
    Show them literally "making up" (like makeup) everything around them with funny brushes and cosmetics.
    Style: bright rainbow colors, exaggerated cartoon expressions, visual pun,
    comic book style with action lines, absolutely silly and family-friendly`;

    console.log('Enhanced prompt:', enhancedPrompt);
    console.log('\nRun this to test:');
    console.log('node replace-image.js 2025-09-22 "' + enhancedPrompt + '"');
};

if (require.main === module) {
    const command = process.argv[2];

    if (command === 'test') {
        testAtomJoke();
    } else {
        reviewAllImages();
    }
}

module.exports = { reviewAllImages };