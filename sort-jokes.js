const fs = require('fs');

// Read the current jokes file
const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));

// Sort jokes by date (newest first)
jokesData.jokes.sort((a, b) => new Date(b.date) - new Date(a.date));

// Update metadata
jokesData.metadata.newestDate = jokesData.jokes[0].date;
jokesData.metadata.oldestDate = jokesData.jokes[jokesData.jokes.length - 1].date;

// Write back to file
fs.writeFileSync('./daily-jokes.json', JSON.stringify(jokesData, null, 2));

console.log('✅ Jokes sorted by date (newest first)');
console.log(`📅 Date range: ${jokesData.metadata.newestDate} to ${jokesData.metadata.oldestDate}`);
console.log(`📊 Total jokes: ${jokesData.jokes.length}`);

// Show first few dates to verify
console.log('\n📋 First 5 dates:');
jokesData.jokes.slice(0, 5).forEach((joke, i) => {
  console.log(`${i + 1}. ${joke.date}: ${joke.joke.substring(0, 50)}...`);
});