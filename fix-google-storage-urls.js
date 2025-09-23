const fs = require('fs');

const fixGoogleStorageUrls = () => {
    console.log('🔧 Fixing Google Storage URLs to local paths...');

    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

    let fixedCount = 0;

    jokesData.jokes.forEach((joke, index) => {
        if (joke.image && joke.image.includes('storage.googleapis.com')) {
            const oldUrl = joke.image;
            const newPath = `/previews/images/preview-${joke.date}.png`;

            // Check if local file exists
            const localFilePath = `./previews/images/preview-${joke.date}.png`;
            if (fs.existsSync(localFilePath)) {
                jokesData.jokes[index].image = newPath;
                console.log(`✅ Fixed ${joke.date}: ${oldUrl} → ${newPath}`);
                fixedCount++;
            } else {
                console.log(`❌ Local file missing for ${joke.date}: ${localFilePath}`);
            }
        }
    });

    if (fixedCount > 0) {
        // Update metadata
        jokesData.metadata.lastUpdated = new Date().toISOString();

        // Write back to file
        fs.writeFileSync('./daily-jokes.json', JSON.stringify(jokesData, null, 2));
        console.log(`\n🎉 Fixed ${fixedCount} Google Storage URLs to local paths!`);
    } else {
        console.log(`\n✅ No Google Storage URLs found - all paths are already local!`);
    }

    return fixedCount;
};

// Command line usage
if (require.main === module) {
    fixGoogleStorageUrls();
}

module.exports = { fixGoogleStorageUrls };