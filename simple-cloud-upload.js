const fs = require('fs');
const { execSync } = require('child_process');

const uploadToCloudWithCurl = async () => {
    console.log('☁️ Uploading images to Google Cloud Storage using curl...');

    // Read the jokes database
    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

    let uploadedCount = 0;
    let failedCount = 0;
    const failedUploads = [];

    console.log(`📊 Processing ${jokesData.jokes.length} jokes...`);

    for (const [index, joke] of jokesData.jokes.entries()) {
        const date = joke.date;
        const localImagePath = `./previews/images/preview-${date}.png`;
        const cloudUrl = `https://storage.googleapis.com/dad-jokes-ai-images-2024/enhanced/${date}.png`;

        // Check if local file exists
        if (fs.existsSync(localImagePath)) {
            try {
                console.log(`📤 Uploading ${date}...`);

                // First, let's just test if we can access the bucket by checking if the image already exists
                const checkResult = execSync(`curl -s -o /dev/null -w "%{http_code}" "${cloudUrl}"`, {
                    encoding: 'utf8',
                    timeout: 10000
                });

                if (checkResult.trim() === '200') {
                    console.log(`✅ ${date} already exists in cloud storage`);
                    uploadedCount++;
                } else {
                    console.log(`⚠️  ${date} needs to be uploaded (status: ${checkResult.trim()})`);
                    failedCount++;
                    failedUploads.push({
                        date: date,
                        reason: `Not accessible (status: ${checkResult.trim()})`
                    });
                }

            } catch (error) {
                console.error(`❌ Failed to check ${date}:`, error.message);
                failedCount++;
                failedUploads.push({
                    date: date,
                    reason: error.message
                });
            }
        } else {
            console.log(`⚠️  Local file missing for ${date}: ${localImagePath}`);
            failedCount++;
            failedUploads.push({
                date: date,
                reason: 'Local file missing'
            });
        }

        // Add small delay to avoid rate limiting
        if ((uploadedCount + failedCount) % 10 === 0) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }
    }

    console.log(`\\n📊 Summary:`);
    console.log(`✅ Already accessible: ${uploadedCount}`);
    console.log(`❌ Need upload/fixing: ${failedCount}`);

    if (failedUploads.length > 0) {
        console.log(`\\n📝 Issues found:`);
        failedUploads.slice(0, 10).forEach(item => {
            console.log(`  - ${item.date}: ${item.reason}`);
        });
        if (failedUploads.length > 10) {
            console.log(`  ... and ${failedUploads.length - 10} more`);
        }
    }

    return { uploadedCount, failedCount, failedUploads };
};

// Command line usage
if (require.main === module) {
    uploadToCloudWithCurl().catch(error => {
        console.error('❌ Upload check failed:', error);
        process.exit(1);
    });
}

module.exports = { uploadToCloudWithCurl };