const fs = require('fs');

const verifyCloudImages = async () => {
    console.log('🔍 Verifying Google Cloud Storage image URLs...');

    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

    let accessibleCount = 0;
    let inaccessibleCount = 0;
    const inaccessibleImages = [];

    console.log(`📊 Testing ${jokesData.jokes.length} image URLs...`);

    for (const joke of jokesData.jokes) {
        if (joke.image && joke.image.includes('storage.googleapis.com')) {
            try {
                // Use curl to test if the URL is accessible
                const { execSync } = require('child_process');
                const result = execSync(`curl -s -o /dev/null -w "%{http_code}" "${joke.image}"`, {
                    encoding: 'utf8',
                    timeout: 10000
                });

                const statusCode = result.trim();
                if (statusCode === '200') {
                    accessibleCount++;
                    console.log(`✅ ${joke.date}: Accessible`);
                } else {
                    inaccessibleCount++;
                    inaccessibleImages.push({
                        date: joke.date,
                        url: joke.image,
                        statusCode: statusCode
                    });
                    console.log(`❌ ${joke.date}: Status ${statusCode}`);
                }
            } catch (error) {
                inaccessibleCount++;
                inaccessibleImages.push({
                    date: joke.date,
                    url: joke.image,
                    error: error.message
                });
                console.log(`❌ ${joke.date}: Error - ${error.message}`);
            }
        }

        // Add small delay to avoid rate limiting
        if ((accessibleCount + inaccessibleCount) % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`✅ Accessible images: ${accessibleCount}`);
    console.log(`❌ Inaccessible images: ${inaccessibleCount}`);

    if (inaccessibleImages.length > 0) {
        console.log(`\n📝 Inaccessible image details:`);
        inaccessibleImages.forEach(img => {
            console.log(`  - ${img.date}: ${img.statusCode || img.error}`);
        });
    }

    return { accessibleCount, inaccessibleCount, inaccessibleImages };
};

// Command line usage
if (require.main === module) {
    verifyCloudImages().catch(error => {
        console.error('❌ Verification failed:', error);
        process.exit(1);
    });
}

module.exports = { verifyCloudImages };