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

const testUpload = async () => {
    try {
        console.log('🔑 Getting access token...');
        const accessToken = await getAccessToken();
        console.log('✅ Access token obtained');

        // Test with one image first
        const testDate = '2025-09-24';
        const localImagePath = `./previews/images/preview-${testDate}.png`;

        if (!fs.existsSync(localImagePath)) {
            throw new Error(`Test image not found: ${localImagePath}`);
        }

        console.log(`📤 Testing upload for ${testDate}...`);

        const imageData = fs.readFileSync(localImagePath);
        const fileName = `enhanced/${testDate}.png`;

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
                    console.log(`Upload response status: ${res.statusCode}`);
                    console.log(`Upload response: ${data}`);

                    if (res.statusCode === 200 || res.statusCode === 201) {
                        console.log('✅ Upload successful!');
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

    } catch (error) {
        console.error('❌ Test upload failed:', error.message);
        throw error;
    }
};

// Command line usage
if (require.main === module) {
    testUpload().catch(error => {
        console.error('❌ Test failed:', error);
        process.exit(1);
    });
}

module.exports = { testUpload, getAccessToken };