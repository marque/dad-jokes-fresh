require('dotenv').config();
const fs = require('fs');
const { Storage } = require('@google-cloud/storage');

// Initialize Google Cloud Storage
const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    projectId: 'daily-dad-joke-472514'
});

const bucketName = 'dad-jokes-ai-images-2024';
const bucket = storage.bucket(bucketName);

const uploadImage = async (localPath, cloudPath) => {
    try {
        console.log(`📤 Uploading ${localPath} to ${cloudPath}...`);

        // Upload the file
        const [file] = await bucket.upload(localPath, {
            destination: cloudPath,
            metadata: {
                cacheControl: 'public, max-age=31536000', // Cache for 1 year
            },
        });

        // Make the file publicly readable
        await file.makePublic();

        const publicUrl = `https://storage.googleapis.com/${bucketName}/${cloudPath}`;
        console.log(`✅ Successfully uploaded: ${publicUrl}`);
        return publicUrl;

    } catch (error) {
        console.error(`❌ Failed to upload ${localPath}:`, error.message);
        return null;
    }
};

const uploadMissingImages = async () => {
    const dates = ['2025-09-24', '2025-09-25'];

    for (const date of dates) {
        const localPath = `./previews/images/preview-${date}.png`;
        const cloudPath = `enhanced/${date}.png`;

        if (fs.existsSync(localPath)) {
            await uploadImage(localPath, cloudPath);
        } else {
            console.log(`⚠️  Local file not found: ${localPath}`);
        }
    }
};

// Run if called directly
if (require.main === module) {
    uploadMissingImages().catch(console.error);
}

module.exports = { uploadImage };