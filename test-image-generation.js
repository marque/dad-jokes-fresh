require('dotenv').config();
const generateImage = require('./api/generate-image');

// Mock request/response objects for testing
const testImageGeneration = async () => {
    console.log('🧪 Testing Image Generation Pipeline...\n');

    // Test joke
    const testJoke = "Why don't scientists trust atoms? Because they make up everything!";

    console.log('📝 Test joke:', testJoke);
    console.log('🔑 Checking environment variables...');

    // Check environment
    if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
        console.error('❌ GOOGLE_APPLICATION_CREDENTIALS not found');
        console.log('💡 Please create a .env file with your Google Cloud credentials');
        console.log('💡 See .env.example for the format');
        return;
    }

    console.log('✅ Environment variables found');
    console.log('🎨 Attempting image generation...\n');

    // Mock request and response
    const mockReq = {
        method: 'POST',
        body: {
            prompt: testJoke
        }
    };

    const mockRes = {
        setHeader: () => {},
        status: (code) => ({
            json: (data) => {
                console.log(`📊 Response Status: ${code}`);
                console.log('📋 Response Data:', JSON.stringify(data, null, 2));

                if (data.success) {
                    console.log('\n✅ SUCCESS! Image generation pipeline is working');
                    console.log('🖼️  Image URL type:', data.imageUrl.substring(0, 50) + '...');
                } else {
                    console.log('\n⚠️  Image generation failed, but fallback worked');
                    console.log('🔄 Fallback URL:', data.imageUrl);
                }
            },
            end: () => {}
        }),
        json: (data) => {
            console.log('📊 Response Status: 200');
            console.log('📋 Response Data:', JSON.stringify(data, null, 2));

            if (data.success) {
                console.log('\n✅ SUCCESS! Image generation pipeline is working');
                console.log('🖼️  Image URL type:', data.imageUrl.substring(0, 50) + '...');
            } else {
                console.log('\n⚠️  Image generation failed, but fallback worked');
                console.log('🔄 Fallback URL:', data.imageUrl);
            }
        }
    };

    try {
        await generateImage(mockReq, mockRes);
    } catch (error) {
        console.error('\n❌ Pipeline test failed:', error.message);
        console.log('\n🔧 Troubleshooting steps:');
        console.log('1. Verify your Google Cloud credentials in .env');
        console.log('2. Check that Vertex AI is enabled in your project');
        console.log('3. Ensure your service account has proper permissions');
        console.log('4. Run: npm install');
    }
};

// Run the test
testImageGeneration().catch(console.error);