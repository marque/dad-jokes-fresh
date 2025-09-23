require('dotenv').config();
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');

const uploadToCloud = async () => {
    console.log('☁️ Uploading all local images to Google Cloud Storage...');

    // Initialize Google Cloud Storage
    const storage = new Storage({
        keyFilename: './service-account.json',
        projectId: 'daily-dad-joke-472514'
    });

    const bucketName = 'dad-jokes-ai-images-2024';
    const bucket = storage.bucket(bucketName);

    // Read the jokes database
    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

    let uploadedCount = 0;
    let updatedCount = 0;

    console.log(`📊 Processing ${jokesData.jokes.length} jokes...`);

    for (const [index, joke] of jokesData.jokes.entries()) {
        const date = joke.date;
        const localImagePath = `./previews/images/preview-${date}.png`;
        const cloudFileName = `enhanced/${date}.png`;
        const cloudUrl = `https://storage.googleapis.com/dad-jokes-ai-images-2024/enhanced/${date}.png`;

        // Check if local file exists
        if (fs.existsSync(localImagePath)) {
            try {
                // Upload to Google Cloud Storage
                console.log(`📤 Uploading ${date}...`);

                await bucket.upload(localImagePath, {
                    destination: cloudFileName,
                    metadata: {
                        cacheControl: 'public, max-age=31536000',
                    },
                });

                // Make the file public
                await bucket.file(cloudFileName).makePublic();

                console.log(`✅ Uploaded ${date} to cloud`);
                uploadedCount++;

                // Update the database entry to point to cloud URL
                jokesData.jokes[index].image = cloudUrl;
                updatedCount++;

            } catch (error) {
                console.error(`❌ Failed to upload ${date}:`, error.message);
            }
        } else {
            console.log(`⚠️  Local file missing for ${date}: ${localImagePath}`);
        }

        // Add small delay to avoid rate limiting
        if (uploadedCount % 5 === 0) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    // Update metadata and save database
    jokesData.metadata.lastUpdated = new Date().toISOString();
    fs.writeFileSync('./daily-jokes.json', JSON.stringify(jokesData, null, 2));

    console.log(`\n🎉 Upload complete!`);
    console.log(`📤 Uploaded: ${uploadedCount} images`);
    console.log(`🔗 Updated: ${updatedCount} database entries`);
    console.log(`☁️  All images now point to Google Cloud Storage!`);

    return { uploadedCount, updatedCount };
};

// Command line usage
if (require.main === module) {
    uploadToCloud().catch(error => {
        console.error('❌ Upload failed:', error);
        process.exit(1);
    });
}

module.exports = { uploadToCloud };