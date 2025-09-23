const fs = require('fs');

const checkMissingImages = () => {
    console.log('🔍 Checking for missing images...');

    // Read the jokes database
    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

    // Get all dates from the database
    const allDates = jokesData.jokes.map(joke => joke.date);
    console.log(`📊 Total jokes in database: ${allDates.length}`);

    // Check which images exist
    const missingImages = [];
    const existingImages = [];

    allDates.forEach(date => {
        const imagePath = `./previews/images/preview-${date}.png`;
        if (fs.existsSync(imagePath)) {
            existingImages.push(date);
        } else {
            missingImages.push(date);
            console.log(`❌ Missing image for: ${date}`);
        }
    });

    console.log(`\n📊 Summary:`);
    console.log(`✅ Images found: ${existingImages.length}`);
    console.log(`❌ Images missing: ${missingImages.length}`);

    if (missingImages.length > 0) {
        console.log(`\n📝 Missing image dates:`);
        missingImages.forEach(date => console.log(`  - ${date}`));
    } else {
        console.log(`\n🎉 All images are present!`);
    }

    return missingImages;
};

// Command line usage
if (require.main === module) {
    checkMissingImages();
}

module.exports = { checkMissingImages };