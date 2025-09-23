const fs = require('fs');

const freshJokes = [
    { joke: "Why don't calendars ever get stressed? They take it one day at a time!", category: "wordplay" },
    { joke: "What do you call a sleeping vampire? A coffin break!", category: "wordplay" },
    { joke: "Why did the pencil go to therapy? It had too much lead in its life!", category: "wordplay" },
    { joke: "What do you call a fish that's good at magic? A wizard of the seas!", category: "animals" },
    { joke: "Why don't mountains ever get cold? They wear snow caps!", category: "wordplay" },
    { joke: "What do you call a cat that works for the Red Cross? A first aid kit!", category: "animals" },
    { joke: "Why did the computer go to the doctor? It had a virus and needed a byte!", category: "technology" },
    { joke: "What do you call a sheep with no legs? A cloud!", category: "animals" },
    { joke: "Why don't books ever get tired? They have too many pages to rest!", category: "wordplay" },
    { joke: "What do you call a dinosaur that's good at word games? A thesaurus rex!", category: "animals" },
    { joke: "Why did the lamp post break up with the street light? It wasn't feeling bright enough!", category: "wordplay" },
    { joke: "What do you call a potato that's good at detective work? Sherlock Spuds!", category: "food" },
    { joke: "Why don't clouds ever feel lonely? They're always hanging with their cumulus friends!", category: "wordplay" },
    { joke: "What do you call a robot that takes the long way around? R2-Detour!", category: "technology" },
    { joke: "Why did the backpack go to school? It wanted to be packed with knowledge!", category: "school" },
    { joke: "What do you call a frog that's illegally parked? Toad away!", category: "animals" },
    { joke: "Why don't mirrors ever lie? They always reflect the truth!", category: "wordplay" },
    { joke: "What do you call a bee that can't make up its mind? A maybe!", category: "animals" },
    { joke: "Why did the clock go to the gym? To work on its timing!", category: "wordplay" },
    { joke: "What do you call a turtle that flies planes? A pilot shell!", category: "animals" },
    { joke: "Why don't shoes ever get lost? They always know their sole purpose!", category: "wordplay" },
    { joke: "What do you call a sandwich that's good at karate? A ninja roll!", category: "food" },
    { joke: "Why did the broom get promoted? It was outstanding in its field... of sweeping!", category: "wordplay" },
    { joke: "What do you call a duck that gets all A's? A wise quacker!", category: "animals" },
    { joke: "Why don't hammers ever get tired? They always nail it on the first try!", category: "wordplay" },
    { joke: "What do you call a cow that's good at math? A cow-culator!", category: "animals" },
    { joke: "Why did the elevator break up with the stairs? It was tired of all the ups and downs!", category: "wordplay" },
    { joke: "What do you call a fish that needs help with vocals? Auto-tuna! Just kidding, a bass singer!", category: "music" },
    { joke: "Why don't gardens ever get angry? They just go with the flow-er!", category: "wordplay" },
    { joke: "What do you call a spider that just got married? A newlyweb!", category: "animals" },
    { joke: "Why did the light bulb go to school? To get brighter!", category: "school" },
    { joke: "What do you call a pig that does magic tricks? Abra-ca-ham!", category: "animals" },
    { joke: "Why don't trains ever get lost? They always stay on track!", category: "wordplay" },
    { joke: "What do you call a bear that's stuck in the rain? A drizzly bear!", category: "animals" },
    { joke: "Why did the keyboard go to the doctor? It had a case of the typos!", category: "technology" },
    { joke: "What do you call a chicken that tells jokes? A comedi-hen!", category: "animals" },
    { joke: "Why don't rivers ever get stressed? They just go with the flow!", category: "wordplay" },
    { joke: "What do you call a dinosaur that loves to sleep? A dino-snooze!", category: "animals" },
    { joke: "Why did the camera go to therapy? It couldn't focus!", category: "wordplay" },
    { joke: "What do you call a dog that can do magic? A labra-cadabra-dor!", category: "animals" },
    { joke: "Why don't batteries ever feel down? They're always positive!", category: "wordplay" },
    { joke: "What do you call a fish that's really good at basketball? A slam-dunk fish!", category: "sports" },
    { joke: "Why did the wallet go to the doctor? It was feeling a little flat!", category: "wordplay" },
    { joke: "What do you call a cat that's good at bowling? An alley cat!", category: "animals" },
    { joke: "Why don't pillows ever get into arguments? They like to keep things soft!", category: "wordplay" },
    { joke: "What do you call a horse that lives next door? A neigh-bor!", category: "animals" },
    { joke: "Why did the phone go to the gym? To improve its reception!", category: "technology" },
    { joke: "What do you call a fish that's good at tennis? A racket fish!", category: "sports" },
    { joke: "Why don't candles ever feel sad? They always look on the bright side!", category: "wordplay" },
    { joke: "What do you call a cow that's good at guitar? A moo-sician!", category: "music" },
    { joke: "Why did the door go to school? To learn how to handle situations!", category: "school" },
    { joke: "What do you call a pig that knows karate? A pork chopper!", category: "animals" },
    { joke: "Why don't erasers ever make mistakes? They're always ready to correct things!", category: "school" },
    { joke: "What do you call a fish that's good at math? A cal-cu-later!", category: "school" },
    { joke: "Why did the hat go to the party? It wanted to cap off the night!", category: "wordplay" },
    { joke: "What do you call a dinosaur that's really good at archery? A bow-saurus!", category: "animals" },
    { joke: "Why don't trees ever get speeding tickets? They stick to their roots!", category: "wordplay" },
    { joke: "What do you call a sheep that's good at martial arts? Lamb chop!", category: "animals" },
    { joke: "Why did the spoon go to the doctor? It was feeling a little stirred up!", category: "wordplay" },
    { joke: "What do you call a fish that's really good at cooking? A chef-ish!", category: "food" },
    { joke: "Why don't windows ever get jealous? They're always transparent about their feelings!", category: "wordplay" },
    { joke: "What do you call a cow that's really good at dancing? A ball-room dancer!", category: "animals" }
];

const replaceDuplicates = () => {
    console.log('🔄 Replacing duplicate and similar jokes with fresh ones...');

    const jokesData = JSON.parse(fs.readFileSync('./daily-jokes.json', 'utf8'));
    const jokes = jokesData.jokes;

    // Define which dates to keep for each concept (keeping the earliest/most recent)
    const keepDates = {
        'fake_noodle': '2025-09-23', // Keep the most recent
        'atoms_makeup': '2025-09-22',
        'scientists_trust': '2025-09-22', // Keep atoms version
        'pig_karate': '2025-09-21',
        'bear_teeth': '2025-09-15',
        'eggs_crack': '2025-09-14', // Keep the main version
        'stairs_up_to_something': '2025-09-12',
        'dinosaur_crash': '2025-09-11', // Keep car version
        'sleeping_bull': '2025-09-09',
        'skeletons_fight': '2025-09-08',
        'fish_crown': '2025-09-07', // Keep king fish version
        'belt_watches': '2025-09-05',
        'pirates_shore': '2025-09-04',
        'cow_no_legs': '2025-09-03',
        'bicycle_tired': '2025-09-02',
        'dog_magician': '2025-09-01',
        'elephants_mouse': '2025-08-31',
        'snowman_sixpack': '2025-08-30',
        'banana_peeling': '2025-08-29',
        'fish_vocals': '2025-08-28',
        'nacho_cheese': '2025-08-26',
        'coffee_mugged': '2025-08-25' // Keep simple version
    };

    // Dates to replace (duplicates and similar concepts)
    const datesToReplace = [
        // Exact duplicates to remove
        '2025-09-13', // impasta duplicate
        '2025-06-29', // impasta duplicate
        '2025-08-27', // atoms duplicate
        '2025-08-07', // atoms duplicate
        '2025-07-10', // atoms duplicate
        '2025-08-12', // pig karate duplicate
        '2025-09-16', // scientists bonding duplicate
        '2025-07-24', // scientists bonding duplicate
        '2025-07-04', // scientists bonding duplicate
        '2025-07-25', // bear teeth duplicate
        '2025-07-05', // bear teeth duplicate
        '2025-07-26', // eggs crack duplicate
        '2025-07-06', // eggs crack duplicate
        '2025-07-30', // stairs duplicate
        '2025-07-14', // stairs duplicate
        '2025-06-28', // stairs duplicate
        '2025-07-15', // dinosaur duplicate
        '2025-09-10', // math book duplicate
        '2025-07-16', // math book duplicate
        '2025-07-27', // sleeping bull duplicate
        '2025-07-07', // sleeping bull duplicate
        '2025-07-18', // skeletons duplicate
        '2025-06-24', // skeletons duplicate
        '2025-07-17', // fish crown duplicate
        '2025-09-06', // cookie doctor duplicate
        '2025-07-22', // cookie doctor duplicate
        '2025-07-19', // belt watches duplicate
        '2025-06-25', // belt watches duplicate
        '2025-07-20', // pirates duplicate
        '2025-06-26', // pirates duplicate
        '2025-07-21', // cow no legs duplicate
        '2025-06-27', // cow no legs duplicate
        '2025-08-01', // bicycle duplicate
        '2025-06-30', // bicycle duplicate
        '2025-07-31', // dog magician duplicate
        '2025-07-03', // dog magician duplicate
        '2025-08-03', // elephants duplicate
        '2025-07-02', // elephants duplicate
        '2025-08-02', // snowman duplicate
        '2025-07-01', // snowman duplicate
        '2025-08-09', // banana duplicate
        '2025-07-12', // banana duplicate
        '2025-07-23', // fish vocals duplicate
        '2025-07-11', // fish vocals duplicate
        '2025-07-13', // nacho cheese duplicate
        '2025-07-08', // coffee duplicate
        '2025-08-24', // factory duplicate
        '2025-07-09', // factory duplicate

        // Similar concepts to replace
        '2025-07-29', // impasta chef (similar to impasta)
        '2025-08-19', // scientists staircases (similar to stairs)
        '2025-08-15', // eggs poker (similar to eggs crack)
        '2025-08-10', // dinosaur spaceship (similar to car crash)
        '2025-08-16', // sleeping bull meadow (similar to bulldozer)
        '2025-08-18', // fish King Neptune (similar to king fish)
        '2025-08-04', // fish crown cape (similar to king fish)
        '2025-08-06', // belt made out of (similar to belt of)
        '2025-08-05', // coffee mugged every morning (similar to mugged)
    ];

    console.log(`\n📝 Replacing ${datesToReplace.length} duplicate/similar jokes with fresh ones...`);

    let replacementIndex = 0;
    let replacedCount = 0;

    // Replace the jokes
    jokes.forEach(joke => {
        if (datesToReplace.includes(joke.date) && replacementIndex < freshJokes.length) {
            const oldJoke = joke.joke;
            const newJoke = freshJokes[replacementIndex];

            joke.joke = newJoke.joke;
            joke.category = newJoke.category;

            console.log(`✅ ${joke.date}: Replaced "${oldJoke.substring(0, 50)}..." with "${newJoke.joke.substring(0, 50)}..."`);

            replacementIndex++;
            replacedCount++;
        }
    });

    // Save the updated JSON
    fs.writeFileSync('./daily-jokes.json', JSON.stringify(jokesData, null, 2));

    console.log(`\n🎉 Successfully replaced ${replacedCount} jokes!`);
    console.log(`📊 Used ${replacementIndex} fresh jokes from the collection.`);
    console.log(`🎯 Keeping the best version of each concept and removing all duplicates.`);

    return {
        replaced: replacedCount,
        freshJokesUsed: replacementIndex,
        totalJokes: jokes.length
    };
};

if (require.main === module) {
    replaceDuplicates();
}

module.exports = { replaceDuplicates };