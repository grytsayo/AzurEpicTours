const fs = require('fs');
const path = require('path');

// Files to process
const files = [
    'index.html',
    'monaco-majesty.html',
    'monaco-coastline.html',
    'monaco-by-night.html',
    'grand-riviera-tour.html',
    'privacy-policy.html'
];

files.forEach(filename => {
    const filepath = path.join(__dirname, filename);

    if (!fs.existsSync(filepath)) {
        console.log(`Skipping ${filename} - file not found`);
        return;
    }

    let html = fs.readFileSync(filepath, 'utf8');

    // Remove the inline <style> block but keep the link to external CSS
    const styleRegex = /<style>[\s\S]*?<\/style>/g;
    const hasExternalLink = html.includes('href="styles.css"');

    // Add external CSS link if not present
    if (!hasExternalLink) {
        html = html.replace('</head>', '    <link rel="stylesheet" href="styles.css">\n</head>');
    }

    // Remove inline styles
    html = html.replace(styleRegex, '');

    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`✓ Processed ${filename}`);
});

console.log('\n✓ All files processed successfully!');
