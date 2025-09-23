const { replaceJokeImage } = require('./replace-image');

const regenerateReplacedImages = async () => {
    console.log('🎨 Regenerating images for all 57 replaced jokes...');

    // List of all dates that had their jokes replaced
    const datesToRegenerate = [
        '2025-09-16', '2025-09-13', '2025-09-10', '2025-09-06',
        '2025-08-27', '2025-08-24', '2025-08-19', '2025-08-18',
        '2025-08-16', '2025-08-15', '2025-08-12', '2025-08-10',
        '2025-08-09', '2025-08-07', '2025-08-06', '2025-08-05',
        '2025-08-04', '2025-08-03', '2025-08-02', '2025-08-01',
        '2025-07-31', '2025-07-30', '2025-07-29', '2025-07-27',
        '2025-07-26', '2025-07-25', '2025-07-24', '2025-07-23',
        '2025-07-22', '2025-07-21', '2025-07-20', '2025-07-19',
        '2025-07-18', '2025-07-17', '2025-07-16', '2025-07-15',
        '2025-07-14', '2025-07-13', '2025-07-12', '2025-07-11',
        '2025-07-10', '2025-07-09', '2025-07-08', '2025-07-07',
        '2025-07-06', '2025-07-05', '2025-07-04', '2025-07-03',
        '2025-07-02', '2025-07-01', '2025-06-30', '2025-06-29',
        '2025-06-28', '2025-06-27', '2025-06-26', '2025-06-25',
        '2025-06-24'
    ];

    console.log(`📋 Found ${datesToRegenerate.length} dates to regenerate images for`);

    // Process in batches with delays to manage quota
    const BATCH_SIZE = 3; // Process 3 at a time
    const DELAY_BETWEEN_BATCHES = 10000; // 10 seconds between batches
    const DELAY_BETWEEN_REQUESTS = 2000; // 2 seconds between individual requests

    let successCount = 0;
    let failureCount = 0;

    for (let i = 0; i < datesToRegenerate.length; i += BATCH_SIZE) {
        const batch = datesToRegenerate.slice(i, i + BATCH_SIZE);
        console.log(`\n🎯 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(datesToRegenerate.length / BATCH_SIZE)}`);
        console.log(`📅 Dates: ${batch.join(', ')}`);

        for (const date of batch) {
            try {
                console.log(`\n🎨 Regenerating image for ${date}...`);
                await replaceJokeImage(date);
                console.log(`✅ Successfully regenerated image for ${date}`);
                successCount++;

                // Small delay between individual requests
                if (batch.indexOf(date) < batch.length - 1) {
                    console.log(`⏳ Waiting ${DELAY_BETWEEN_REQUESTS / 1000} seconds...`);
                    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS));
                }
            } catch (error) {
                console.error(`❌ Failed to regenerate image for ${date}:`, error.message);
                failureCount++;

                // If we hit quota limit, take a longer break
                if (error.message.includes('Quota exceeded')) {
                    console.log('🛑 Quota exceeded. Taking a longer break...');
                    await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute break
                }
            }
        }

        // Delay between batches (except for the last batch)
        if (i + BATCH_SIZE < datesToRegenerate.length) {
            console.log(`\n⏳ Waiting ${DELAY_BETWEEN_BATCHES / 1000} seconds before next batch...`);
            await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_BATCHES));
        }
    }

    console.log('\n🎉 Image regeneration completed!');
    console.log(`📊 Results: ${successCount} successful, ${failureCount} failed out of ${datesToRegenerate.length} total`);

    return {
        total: datesToRegenerate.length,
        successful: successCount,
        failed: failureCount
    };
};

// Command line usage
if (require.main === module) {
    regenerateReplacedImages().catch(error => {
        console.error('❌ Image regeneration failed:', error);
        process.exit(1);
    });
}

module.exports = { regenerateReplacedImages };