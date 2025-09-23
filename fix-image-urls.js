const fs = require('fs');

// Script to update all Google Storage URLs to local preview URLs
const fixImageUrls = () => {
    console.log('🔧 Fixing image URLs in daily-jokes.json...');

    // Load current jokes data
    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

    let updatedCount = 0;

    // Update each joke's image URL if it points to Google Storage
    jokesData.jokes.forEach(joke => {
        if (joke.image && joke.image.includes('storage.googleapis.com')) {
            // Check if local preview file exists
            const localImagePath = `./previews/ghibli-style/preview-${joke.date}.png`;
            if (fs.existsSync(localImagePath)) {
                // Update to local preview URL
                joke.image = `./previews/ghibli-style/preview-${joke.date}.png`;
                updatedCount++;
                console.log(`✅ Updated ${joke.date}: ${joke.joke.substring(0, 50)}...`);
            } else {
                console.log(`⚠️  No local image found for ${joke.date}`);
            }
        }
    });

    // Save updated JSON
    fs.writeFileSync('./daily-jokes.json', JSON.stringify(jokesData, null, 2));

    console.log(`\n🎉 Updated ${updatedCount} image URLs to use local previews!`);
    console.log('All images now point to local preview files.');
};

// Run the fix
if (require.main === module) {
    fixImageUrls();
}

module.exports = { fixImageUrls };