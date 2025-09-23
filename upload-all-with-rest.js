const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

// Simple JWT implementation for service account authentication
function createJWT(serviceAccount) {
    const header = {
        alg: 'RS256',
        typ: 'JWT'
    };

    const now = Math.floor(Date.now() / 1000);
    const payload = {
        iss: serviceAccount.client_email,
        scope: 'https://www.googleapis.com/auth/devstorage.full_control',
        aud: 'https://oauth2.googleapis.com/token',
        exp: now + 3600,
        iat: now
    };

    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64url');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');

    const signatureInput = `${encodedHeader}.${encodedPayload}`;
    const signature = crypto.sign('RSA-SHA256', Buffer.from(signatureInput), serviceAccount.private_key);
    const encodedSignature = signature.toString('base64url');

    return `${signatureInput}.${encodedSignature}`;
}

// Get access token using service account
async function getAccessToken() {
    const serviceAccount = JSON.parse(fs.readFileSync('./service-account.json', 'utf8'));
    const jwt = createJWT(serviceAccount);

    const postData = `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`;

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'oauth2.googleapis.com',
            port: 443,
            path: '/token',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.access_token) {
                        resolve(response.access_token);
                    } else {
                        reject(new Error('No access token received: ' + data));
                    }
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(postData);
        req.end();
    });
}

// Upload single image
async function uploadImage(accessToken, date, imageData) {
    const fileName = `enhanced/${date}.png`;

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'storage.googleapis.com',
            port: 443,
            path: `/upload/storage/v1/b/dad-jokes-ai-images-2024/o?uploadType=media&name=${encodeURIComponent(fileName)}`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'image/png',
                'Content-Length': imageData.length
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    resolve(true);
                } else {
                    reject(new Error(`Upload failed with status ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(imageData);
        req.end();
    });
}

// Make image public
async function makeImagePublic(accessToken, date) {
    const fileName = `enhanced/${date}.png`;
    const aclData = JSON.stringify({
        entity: 'allUsers',
        role: 'READER'
    });

    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'storage.googleapis.com',
            port: 443,
            path: `/storage/v1/b/dad-jokes-ai-images-2024/o/${encodeURIComponent(fileName)}/acl`,
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(aclData)
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                if (res.statusCode === 200 || res.statusCode === 201) {
                    resolve(true);
                } else {
                    reject(new Error(`Make public failed with status ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (error) => {
            reject(error);
        });

        req.write(aclData);
        req.end();
    });
}

const uploadAllImages = async () => {
    try {
        console.log('🔑 Getting access token...');
        const accessToken = await getAccessToken();
        console.log('✅ Access token obtained');

        // Read the jokes database
        const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

        let uploadedCount = 0;
        let publicCount = 0;
        let failedCount = 0;
        const failedUploads = [];

        console.log(`📊 Processing ${jokesData.jokes.length} images...`);

        for (const joke of jokesData.jokes) {
            const date = joke.date;
            const localImagePath = `./previews/images/preview-${date}.png`;

            if (fs.existsSync(localImagePath)) {
                try {
                    console.log(`📤 Uploading ${date}...`);
                    const imageData = fs.readFileSync(localImagePath);

                    await uploadImage(accessToken, date, imageData);
                    uploadedCount++;
                    console.log(`✅ Uploaded ${date}`);

                    // Make it public
                    await makeImagePublic(accessToken, date);
                    publicCount++;
                    console.log(`🌐 Made ${date} public`);

                } catch (error) {
                    console.error(`❌ Failed ${date}:`, error.message);
                    failedCount++;
                    failedUploads.push({
                        date: date,
                        reason: error.message
                    });
                }

                // Add delay to avoid rate limiting
                if ((uploadedCount + failedCount) % 5 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } else {
                console.log(`⚠️  Local file missing for ${date}: ${localImagePath}`);
                failedCount++;
                failedUploads.push({
                    date: date,
                    reason: 'Local file missing'
                });
            }
        }

        console.log(`\\n📊 Summary:`);
        console.log(`✅ Uploaded: ${uploadedCount}`);
        console.log(`🌐 Made public: ${publicCount}`);
        console.log(`❌ Failed: ${failedCount}`);

        if (failedUploads.length > 0) {
            console.log(`\\n📝 Failed uploads:`);
            failedUploads.slice(0, 10).forEach(item => {
                console.log(`  - ${item.date}: ${item.reason}`);
            });
            if (failedUploads.length > 10) {
                console.log(`  ... and ${failedUploads.length - 10} more`);
            }
        }

        return { uploadedCount, publicCount, failedCount, failedUploads };

    } catch (error) {
        console.error('❌ Upload process failed:', error.message);
        throw error;
    }
};

// Command line usage
if (require.main === module) {
    uploadAllImages().catch(error => {
        console.error('❌ Upload failed:', error);
        process.exit(1);
    });
}

module.exports = { uploadAllImages };