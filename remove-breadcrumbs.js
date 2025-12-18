const fs = require('fs');
const path = require('path');

// Tour pages that have breadcrumbs
const files = [
    'monaco-majesty.html',
    'monaco-coastline.html',
    'monaco-by-night.html',
    'grand-riviera-tour.html'
];

files.forEach(filename => {
    const filepath = path.join(__dirname, filename);

    if (!fs.existsSync(filepath)) {
        console.log(`Skipping ${filename} - file not found`);
        return;
    }

    let html = fs.readFileSync(filepath, 'utf8');

    // Remove breadcrumbs section including the comment
    const breadcrumbRegex = /\s*<!-- Breadcrumbs -->\s*<nav class="breadcrumbs"[\s\S]*?<\/nav>\s*/g;

    html = html.replace(breadcrumbRegex, '\n');

    fs.writeFileSync(filepath, html, 'utf8');
    console.log(`✓ Removed breadcrumbs from ${filename}`);
});

console.log('\n✓ All breadcrumbs removed successfully!');
