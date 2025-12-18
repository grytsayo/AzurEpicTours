const fs = require('fs');
const path = require('path');

function updateHtmlFile(filePath) {
    console.log(`\nProcessing: ${path.basename(filePath)}`);

    let html = fs.readFileSync(filePath, 'utf8');
    let changeCount = 0;

    // Pattern 1: Update simple img tags to picture elements with WebP
    // Match: <img src="./images/..." or <img src="images/..." or <img src="riviera-background.jpg"
    const imgPattern = /<img\s+([^>]*?)src=["'](\.\/)?([^"']+\.(jpg|jpeg|JPG|JPEG))["']([^>]*?)>/gi;

    html = html.replace(imgPattern, (match, beforeSrc, dotSlash, srcPath, ext, afterSrc) => {
        // Skip if already wrapped in <picture>
        const contextBefore = html.substring(Math.max(0, html.indexOf(match) - 100), html.indexOf(match));
        if (contextBefore.includes('<picture>')) {
            return match;
        }

        // Create WebP path
        const webpPath = srcPath.replace(/\.(jpg|jpeg|JPG|JPEG)$/i, '.webp');
        const prefix = dotSlash || '';

        changeCount++;

        // Build the picture element
        const pictureElement = `<picture>
                    <source srcset="${prefix}${webpPath}" type="image/webp">
                    <img ${beforeSrc}src="${prefix}${srcPath}"${afterSrc}>
                </picture>`;

        return pictureElement;
    });

    // Pattern 2: Update CSS background images
    const cssBackgroundPattern = /background-image:\s*url\(['"]?(\.\/)?([^'")\s]+\.(jpg|jpeg|JPG|JPEG))['"]?\)/gi;

    html = html.replace(cssBackgroundPattern, (match, dotSlash, imagePath, ext) => {
        const webpPath = imagePath.replace(/\.(jpg|jpeg|JPG|JPEG)$/i, '.webp');
        const prefix = dotSlash || '';

        changeCount++;

        // Use image-set for CSS with WebP fallback
        return `background-image: image-set(
                        url('${prefix}${webpPath}') type('image/webp'),
                        url('${prefix}${imagePath}') type('image/jpeg')
                    )`;
    });

    if (changeCount > 0) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`  ✓ Updated ${changeCount} image reference(s)`);
    } else {
        console.log(`  → No changes needed`);
    }

    return changeCount;
}

function main() {
    console.log('🔄 Updating HTML files to use WebP images...\n');
    console.log('='.repeat(60));

    const htmlFiles = [
        'index.html',
        'grand-riviera-tour.html',
        'monaco-by-night.html',
        'monaco-coastline.html',
        'monaco-majesty.html',
        'privacy-policy.html'
    ];

    let totalChanges = 0;

    for (const file of htmlFiles) {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            totalChanges += updateHtmlFile(filePath);
        } else {
            console.log(`\nSkipping: ${file} (not found)`);
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`\n✅ Done! Updated ${totalChanges} image references across all HTML files.\n`);
    console.log('What changed:');
    console.log('• <img> tags → <picture> elements with WebP + JPG fallback');
    console.log('• CSS background-image → image-set() with WebP + JPG\n');
    console.log('Next steps:');
    console.log('1. Test your website in a browser');
    console.log('2. Check that images load correctly');
    console.log('3. Run PageSpeed Insights to verify improvements\n');
}

main();
