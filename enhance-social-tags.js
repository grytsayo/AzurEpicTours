const fs = require('fs');
const path = require('path');

// Tour-specific social metadata
const tourMeta = {
    'monaco-majesty.html': {
        title: 'Monaco Majesty Private Tour | 4 Hours | AzurEpicTours',
        description: 'Immerse yourself in Monaco\'s glamour: Prince\'s Palace, Monte Carlo Casino, medieval Èze, Formula 1 track. Private 4-hour luxury tour from €225.',
        image: 'https://www.azurepictours.com/images/monaco-majesty/MC_magesty_01.jpg',
        imageAlt: 'Panoramic view of Monaco harbor with luxury yachts and Mediterranean Sea',
        url: 'https://www.azurepictours.com/monaco-majesty.html'
    },
    'monaco-coastline.html': {
        title: 'Monaco Coastline Journey | 6 Hours | AzurEpicTours',
        description: 'Extended Monaco and French Riviera discovery: Èze village, Monaco highlights, scenic coastal drives. Private 6-hour luxury tour with flexible itinerary.',
        image: 'https://www.azurepictours.com/images/monaco-coastline/MC_coast_02.jpg',
        imageAlt: 'Medieval Èze village perched on cliff overlooking Mediterranean Sea',
        url: 'https://www.azurepictours.com/monaco-coastline.html'
    },
    'monaco-by-night.html': {
        title: 'Monaco by Night | 3 Hours | Evening Tour | AzurEpicTours',
        description: 'Experience Monaco\'s nightlife magic: illuminated Monaco, sunset at Èze, evening champagne, and glittering Monte Carlo. Romantic 3-hour private tour.',
        image: 'https://www.azurepictours.com/images/monaco-by-night/MC_night_01.jpg',
        imageAlt: 'Monaco illuminated at night with harbor lights and luxury yachts',
        url: 'https://www.azurepictours.com/monaco-by-night.html'
    },
    'grand-riviera-tour.html': {
        title: 'Grand French Riviera Tour | 8 Hours | Full Day | AzurEpicTours',
        description: 'Complete French Riviera experience: Monaco, Nice, Cannes, Antibes, medieval villages. All-inclusive 8-hour luxury tour with gourmet lunch.',
        image: 'https://www.azurepictours.com/images/grand-riviera/grandtour_01.jpg',
        imageAlt: 'Panoramic view of French Riviera coastline with Mediterranean Sea',
        url: 'https://www.azurepictours.com/grand-riviera-tour.html'
    }
};

function enhanceSocialTags(filePath, fileName) {
    console.log(`\n📄 Processing: ${fileName}`);

    if (!tourMeta[fileName]) {
        console.log('  ⚠️  No metadata defined for this file');
        return false;
    }

    let html = fs.readFileSync(filePath, 'utf8');
    const meta = tourMeta[fileName];
    let changeCount = 0;

    // Check if already enhanced (look for og:site_name)
    if (html.includes('property="og:site_name"')) {
        console.log('  ℹ️  Social tags already enhanced');
        return false;
    }

    // Find the Open Graph section
    const ogSectionRegex = /<!-- Open Graph \/ Facebook -->([\s\S]*?)<!-- Twitter -->/;
    const ogMatch = html.match(ogSectionRegex);

    if (ogMatch) {
        // Build enhanced Open Graph section
        const enhancedOG = `<!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="AzurEpicTours">
    <meta id="og-title" property="og:title" content="${meta.title}">
    <meta id="og-description" property="og:description" content="${meta.description}">
    <meta property="og:image" content="${meta.image}">
    <meta property="og:image:secure_url" content="${meta.image}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${meta.imageAlt}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:url" content="${meta.url}">
    <meta property="og:locale" content="en_US">
    <meta property="og:locale:alternate" content="ru_RU">
    <meta property="og:locale:alternate" content="fr_FR">

    <!-- Twitter -->`;

        html = html.replace(ogSectionRegex, enhancedOG);
        console.log('  ✓ Enhanced Open Graph tags');
        changeCount++;
    }

    // Find and enhance Twitter section
    const twitterSectionRegex = /<!-- Twitter -->([\s\S]*?)(?=\n\n    <!-- |<\/head>)/;
    const twitterMatch = html.match(twitterSectionRegex);

    if (twitterMatch) {
        const enhancedTwitter = `<!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@AzurEpicTours">
    <meta name="twitter:creator" content="@AzurEpicTours">
    <meta property="twitter:url" content="${meta.url}">
    <meta id="twitter-title" property="twitter:title" content="${meta.title}">
    <meta id="twitter-description" property="twitter:description" content="${meta.description}">
    <meta property="twitter:image" content="${meta.image}">
    <meta property="twitter:image:alt" content="${meta.imageAlt}">`;

        html = html.replace(twitterSectionRegex, enhancedTwitter + '\n\n    ');
        console.log('  ✓ Enhanced Twitter Card tags');
        changeCount++;
    }

    // Add Pinterest meta tag if not present
    if (!html.includes('name="pinterest"')) {
        const pinterestTag = `\n    <!-- Pinterest -->\n    <meta name="pinterest" content="nopin" description="This page is not available for pinning.">\n`;

        // Add after Twitter section
        html = html.replace(/(<meta property="twitter:image:alt"[^>]*>)/, '$1' + pinterestTag);
        console.log('  ✓ Added Pinterest meta tag');
        changeCount++;
    }

    if (changeCount > 0) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`  ✅ Updated ${fileName} (${changeCount} sections enhanced)`);
        return true;
    }

    return false;
}

function main() {
    console.log('📱 Enhancing Social Media Meta Tags...\n');
    console.log('═'.repeat(60));

    const files = [
        'monaco-majesty.html',
        'monaco-coastline.html',
        'monaco-by-night.html',
        'grand-riviera-tour.html'
    ];

    let updatedCount = 0;

    files.forEach(fileName => {
        const filePath = path.join(__dirname, fileName);
        if (fs.existsSync(filePath)) {
            if (enhanceSocialTags(filePath, fileName)) {
                updatedCount++;
            }
        } else {
            console.log(`\n⚠️  Skipping ${fileName} (not found)`);
        }
    });

    console.log('\n' + '═'.repeat(60));
    console.log(`\n✅ Done! Enhanced ${updatedCount} tour pages.\n`);
    console.log('What was added:');
    console.log('• og:site_name - Brand consistency');
    console.log('• og:image:width & height - Proper dimensions (1200x630)');
    console.log('• og:image:alt - Image descriptions for accessibility');
    console.log('• og:image:secure_url - HTTPS image URL');
    console.log('• og:image:type - Image MIME type');
    console.log('• twitter:site & creator - Twitter attribution');
    console.log('• twitter:image:alt - Image alt text for Twitter');
    console.log('• pinterest meta - Control Pinterest pinning\n');
    console.log('Social Media Benefits:');
    console.log('• 📱 Rich previews on Facebook, Twitter, LinkedIn');
    console.log('• 🖼️  Large, attractive image cards when shared');
    console.log('• ✨ Professional brand presentation');
    console.log('• 🔍 Better discoverability on social platforms');
    console.log('• 📊 Tracking with twitter:site for analytics\n');
}

main();
