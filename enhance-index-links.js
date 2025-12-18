const fs = require('fs');
const path = require('path');

function enhanceIndexPage() {
    const filePath = path.join(__dirname, 'index.html');

    console.log('🔗 Enhancing internal links on index.html...\n');
    console.log('═'.repeat(60));

    let html = fs.readFileSync(filePath, 'utf8');
    let changeCount = 0;

    // Add cross-references within tour descriptions
    const crossReferences = [
        {
            search: /<p class="tour-tagline" data-i18n="tour1Tagline">The luxury of the principality in one tour<\/p>/,
            replace: `<p class="tour-tagline" data-i18n="tour1Tagline">The luxury of the principality in one tour</p>
                    <p class="tour-description">Experience Monaco's highlights in 4 hours. Want more time? Check out our <a href="./monaco-coastline.html" style="color: #667eea; text-decoration: underline;">6-hour Monaco Coastline</a> or <a href="./grand-riviera-tour.html" style="color: #667eea; text-decoration: underline;">8-hour Grand Riviera Tour</a>.</p>`,
            tourName: 'Monaco Majesty'
        },
        {
            search: /<p class="tour-tagline" data-i18n="tour2Tagline">Extended discovery of the coast with stops and walks<\/p>/,
            replace: `<p class="tour-tagline" data-i18n="tour2Tagline">Extended discovery of the coast with stops and walks</p>
                    <p class="tour-description">Perfect for those who want more time to explore. Prefer evening magic? Try <a href="./monaco-by-night.html" style="color: #667eea; text-decoration: underline;">Monaco by Night</a>.</p>`,
            tourName: 'Monaco Coastline'
        },
        {
            search: /<p class="tour-tagline" data-i18n="tour3Tagline">Romantic evening drive with champagne and views<\/p>/,
            replace: `<p class="tour-tagline" data-i18n="tour3Tagline">Romantic evening drive with champagne and views</p>
                    <p class="tour-description">Experience Monaco's nightlife and glamour. Want to see it during the day? Explore our <a href="./monaco-majesty.html" style="color: #667eea; text-decoration: underline;">Monaco Majesty Tour</a>.</p>`,
            tourName: 'Monaco by Night'
        },
        {
            search: /<p class="tour-tagline" data-i18n="tour4Tagline">The most comprehensive French Riviera experience<\/p>/,
            replace: `<p class="tour-tagline" data-i18n="tour4Tagline">The most comprehensive French Riviera experience</p>
                    <p class="tour-description">Our most complete tour covering the entire French Riviera. Short on time? Check our <a href="./monaco-majesty.html" style="color: #667eea; text-decoration: underline;">4-hour Monaco Majesty</a> option.</p>`,
            tourName: 'Grand Riviera Tour'
        }
    ];

    // Apply cross-references
    crossReferences.forEach(ref => {
        if (html.match(ref.search)) {
            html = html.replace(ref.search, ref.replace);
            console.log(`✓ Added cross-links to ${ref.tourName} description`);
            changeCount++;
        }
    });

    // Add a "Quick Links" section before tours if it doesn't exist
    if (!html.includes('id="quick-tour-nav"')) {
        const quickLinksHTML = `
        <!-- Quick Tour Navigation -->
        <div id="quick-tour-nav" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; margin-bottom: 40px;">
            <div style="max-width: 1200px; margin: 0 auto;">
                <h3 style="color: white; margin-bottom: 20px; font-size: 1.5rem;">Jump to Tour:</h3>
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 15px;">
                    <a href="#tour-monaco-majesty" style="background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; transition: all 0.3s; display: inline-block; backdrop-filter: blur(10px);" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">Monaco Majesty (4h)</a>
                    <a href="#tour-monaco-coastline" style="background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; transition: all 0.3s; display: inline-block; backdrop-filter: blur(10px);" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">Monaco Coastline (6h)</a>
                    <a href="#tour-monaco-night" style="background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; transition: all 0.3s; display: inline-block; backdrop-filter: blur(10px);" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">Monaco by Night (3h)</a>
                    <a href="#tour-grand-riviera" style="background: rgba(255,255,255,0.2); color: white; padding: 12px 24px; border-radius: 25px; text-decoration: none; transition: all 0.3s; display: inline-block; backdrop-filter: blur(10px);" onmouseover="this.style.background='rgba(255,255,255,0.3)'" onmouseout="this.style.background='rgba(255,255,255,0.2)'">Grand Riviera (8h)</a>
                </div>
            </div>
        </div>
`;

        // Add quick links before tours section
        html = html.replace('<div class="container" id="tours">', quickLinksHTML + '\n    <div class="container" id="tours">');
        console.log('✓ Added quick navigation section');
        changeCount++;
    }

    // Add IDs to tour cards for anchor links
    const tourIDUpdates = [
        { search: '<!-- Tour 1: Monaco Majesty -->', replace: '<!-- Tour 1: Monaco Majesty -->\n            <div id="tour-monaco-majesty"></div>' },
        { search: '<!-- Tour 2: Monaco Coastline -->', replace: '<!-- Tour 2: Monaco Coastline -->\n            <div id="tour-monaco-coastline"></div>' },
        { search: '<!-- Tour 3: Monaco by Night -->', replace: '<!-- Tour 3: Monaco by Night -->\n            <div id="tour-monaco-night"></div>' },
        { search: '<!-- Tour 4: Grand Riviera Tour -->', replace: '<!-- Tour 4: Grand Riviera Tour -->\n            <div id="tour-grand-riviera"></div>' }
    ];

    tourIDUpdates.forEach(update => {
        if (html.includes(update.search) && !html.includes(update.replace)) {
            html = html.replace(update.search, update.replace);
            changeCount++;
        }
    });

    if (changeCount > 0) {
        console.log(`✓ Added ${tourIDUpdates.length} anchor IDs for tour cards`);
    }

    // Save updated HTML
    fs.writeFileSync(filePath, html, 'utf8');

    console.log('\n' + '═'.repeat(60));
    console.log(`\n✅ Done! Made ${changeCount} improvements to index.html\n`);
    console.log('What was added:');
    console.log('• Cross-references between tour descriptions');
    console.log('• Quick navigation links to each tour');
    console.log('• Anchor IDs for smooth scrolling');
    console.log('• Better internal linking structure\n');
    console.log('SEO Benefits:');
    console.log('• More internal links for crawlers');
    console.log('• Better user navigation');
    console.log('• Increased time on page');
    console.log('• Lower bounce rate\n');
}

enhanceIndexPage();
