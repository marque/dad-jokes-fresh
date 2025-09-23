const fs = require('fs');

const revertToCloudUrls = () => {
    console.log('☁️ Reverting image URLs back to Google Cloud Storage...');

    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

    let revertedCount = 0;

    jokesData.jokes.forEach((joke, index) => {
        if (joke.image && (joke.image.startsWith('/previews/images/') || joke.image.startsWith('./previews/images/'))) {
            const oldPath = joke.image;
            const cloudUrl = `https://storage.googleapis.com/dad-jokes-ai-images-2024/enhanced/${joke.date}.png`;

            jokesData.jokes[index].image = cloudUrl;
            console.log(`✅ Reverted ${joke.date}: ${oldPath} → ${cloudUrl}`);
            revertedCount++;
        }
    });

    if (revertedCount > 0) {
        // Update metadata
        jokesData.metadata.lastUpdated = new Date().toISOString();

        // Write back to file
        fs.writeFileSync('./daily-jokes.json', JSON.stringify(jokesData, null, 2));
        console.log(`\n🎉 Reverted ${revertedCount} URLs back to Google Cloud Storage!`);
    } else {
        console.log(`\n✅ All URLs are already pointing to Google Cloud Storage!`);
    }

    return revertedCount;
};

// Command line usage
if (require.main === module) {
    revertToCloudUrls();
}

module.exports = { revertToCloudUrls };