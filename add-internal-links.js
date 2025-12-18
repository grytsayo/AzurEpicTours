const fs = require('fs');
const path = require('path');

// Tour configuration
const tours = {
    'monaco-majesty.html': {
        title: 'Monaco Majesty',
        titleRu: 'Величие Монако',
        titleFr: 'Majesté de Monaco',
        related: ['monaco-coastline.html', 'monaco-by-night.html']
    },
    'monaco-coastline.html': {
        title: 'Monaco Coastline',
        titleRu: 'Побережье Монако',
        titleFr: 'Côte de Monaco',
        related: ['monaco-majesty.html', 'grand-riviera-tour.html']
    },
    'monaco-by-night.html': {
        title: 'Monaco by Night',
        titleRu: 'Монако ночью',
        titleFr: 'Monaco de Nuit',
        related: ['monaco-majesty.html', 'grand-riviera-tour.html']
    },
    'grand-riviera-tour.html': {
        title: 'Grand Riviera Tour',
        titleRu: 'Гранд тур по Ривьере',
        titleFr: 'Grand Tour de la Riviera',
        related: ['monaco-coastline.html', 'monaco-by-night.html']
    }
};

const tourTitles = {
    'monaco-majesty.html': 'Monaco Majesty',
    'monaco-coastline.html': 'Monaco Coastline',
    'monaco-by-night.html': 'Monaco by Night',
    'grand-riviera-tour.html': 'Grand Riviera Tour'
};

// Breadcrumb styles
const breadcrumbStyles = `
        /* Breadcrumbs */
        .breadcrumbs {
            background: #f8f9fa;
            padding: 15px 0;
            border-bottom: 1px solid #e0e0e0;
        }

        .breadcrumbs-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .breadcrumbs-list {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-items: center;
            margin: 0;
            padding: 0;
            font-size: 14px;
        }

        .breadcrumbs-list li {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .breadcrumbs-list li:not(:last-child)::after {
            content: "›";
            color: #666;
            font-size: 18px;
        }

        .breadcrumbs-list a {
            color: #667eea;
            text-decoration: none;
            transition: color 0.3s;
        }

        .breadcrumbs-list a:hover {
            color: #764ba2;
            text-decoration: underline;
        }

        .breadcrumbs-list .current {
            color: #333;
            font-weight: 500;
        }

        /* Related Tours Section */
        .related-tours {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 40px 20px;
            margin-top: 40px;
            border-radius: 10px;
        }

        .related-tours h2 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
            font-size: 2rem;
        }

        .related-tours-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            max-width: 1200px;
            margin: 0 auto;
        }

        .related-tour-card {
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s, box-shadow 0.3s;
            text-decoration: none;
            color: inherit;
            display: block;
        }

        .related-tour-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }

        .related-tour-card img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }

        .related-tour-info {
            padding: 20px;
        }

        .related-tour-info h3 {
            margin: 0 0 10px 0;
            color: #667eea;
            font-size: 1.3rem;
        }

        .related-tour-info p {
            margin: 0;
            color: #666;
            font-size: 0.95rem;
            line-height: 1.5;
        }

        .related-tour-cta {
            display: inline-block;
            margin-top: 15px;
            padding: 10px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border-radius: 5px;
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.3s;
        }

        .related-tour-cta:hover {
            opacity: 0.9;
        }

        @media (max-width: 768px) {
            .breadcrumbs-list {
                font-size: 13px;
            }

            .related-tours h2 {
                font-size: 1.5rem;
            }

            .related-tours-grid {
                grid-template-columns: 1fr;
            }
        }
`;

// Breadcrumb HTML generator
function generateBreadcrumbHTML(tourFile) {
    const tour = tours[tourFile];
    return `
    <!-- Breadcrumbs -->
    <nav class="breadcrumbs" aria-label="Breadcrumb">
        <div class="breadcrumbs-container">
            <ol class="breadcrumbs-list" itemscope itemtype="https://schema.org/BreadcrumbList">
                <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <a href="./index.html" itemprop="item">
                        <span itemprop="name" data-i18n="breadcrumbHome">Home</span>
                    </a>
                    <meta itemprop="position" content="1" />
                </li>
                <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <a href="./index.html#tours" itemprop="item">
                        <span itemprop="name" data-i18n="breadcrumbTours">Tours</span>
                    </a>
                    <meta itemprop="position" content="2" />
                </li>
                <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
                    <span class="current" itemprop="name" data-i18n="tourTitle">${tour.title}</span>
                    <meta itemprop="position" content="3" />
                </li>
            </ol>
        </div>
    </nav>
`;
}

// Related tours HTML generator
function generateRelatedToursHTML(tourFile) {
    const tour = tours[tourFile];
    const relatedTours = tour.related;

    const relatedCards = relatedTours.map(relatedFile => {
        const relatedTour = tours[relatedFile];
        const tourName = relatedFile.replace('.html', '');

        // Determine preview image path
        let imagePath = '';
        if (relatedFile === 'monaco-majesty.html') {
            imagePath = './images/monaco-majesty/MC_magesty_01.jpg';
        } else if (relatedFile === 'monaco-coastline.html') {
            imagePath = './images/monaco-coastline/MC_coast_01.jpg';
        } else if (relatedFile === 'monaco-by-night.html') {
            imagePath = './images/monaco-by-night/MC_night_01.jpg';
        } else if (relatedFile === 'grand-riviera-tour.html') {
            imagePath = './images/grand-riviera/grandtour_01.jpg';
        }

        const imagePathWebP = imagePath.replace(/\.(jpg|JPG)$/, '.webp');

        return `
                <a href="./${relatedFile}" class="related-tour-card">
                    <picture>
                        <source srcset="${imagePathWebP}" type="image/webp">
                        <img src="${imagePath}" alt="${relatedTour.title}" loading="lazy">
                    </picture>
                    <div class="related-tour-info">
                        <h3>${relatedTour.title}</h3>
                        <p data-i18n="relatedTourDesc_${tourName}">Discover another amazing tour</p>
                        <span class="related-tour-cta" data-i18n="learnMore">Learn More →</span>
                    </div>
                </a>`;
    }).join('\n');

    return `
        <!-- Related Tours -->
        <div class="related-tours">
            <h2 data-i18n="relatedToursTitle">🌟 You May Also Like</h2>
            <div class="related-tours-grid">
${relatedCards}
            </div>
        </div>
`;
}

function updateTourPage(tourFile) {
    const filePath = path.join(__dirname, tourFile);

    if (!fs.existsSync(filePath)) {
        console.log(`⚠️  Skipping ${tourFile} (not found)`);
        return false;
    }

    console.log(`\n📄 Processing: ${tourFile}`);

    let html = fs.readFileSync(filePath, 'utf8');

    // Check if already has breadcrumbs
    if (html.includes('class="breadcrumbs"')) {
        console.log('  ℹ️  Breadcrumbs already exist, skipping...');
    } else {
        // Add breadcrumb styles before closing </style> tag
        const styleEndIndex = html.lastIndexOf('</style>');
        if (styleEndIndex !== -1) {
            html = html.substring(0, styleEndIndex) + breadcrumbStyles + '\n    ' + html.substring(styleEndIndex);
            console.log('  ✓ Added breadcrumb styles');
        }

        // Add breadcrumb HTML after </header>
        const breadcrumbHTML = generateBreadcrumbHTML(tourFile);
        html = html.replace('</header>', '</header>\n' + breadcrumbHTML);
        console.log('  ✓ Added breadcrumb navigation');
    }

    // Check if already has related tours
    if (html.includes('class="related-tours"')) {
        console.log('  ℹ️  Related tours already exist, skipping...');
    } else {
        // Add related tours before footer or before last closing div.container
        const relatedToursHTML = generateRelatedToursHTML(tourFile);

        // Try to add before footer
        if (html.includes('<footer')) {
            html = html.replace('<footer', relatedToursHTML + '\n    <footer');
            console.log('  ✓ Added related tours section before footer');
        } else {
            // Add before last </div> that closes container
            const lastContainerEnd = html.lastIndexOf('</div>\n\n    <!-- Cookie');
            if (lastContainerEnd !== -1) {
                html = html.substring(0, lastContainerEnd) + relatedToursHTML + '\n    ' + html.substring(lastContainerEnd);
                console.log('  ✓ Added related tours section');
            }
        }
    }

    // Save updated HTML
    fs.writeFileSync(filePath, html, 'utf8');
    console.log(`  ✅ Updated ${tourFile}`);

    return true;
}

function main() {
    console.log('🔗 Adding Internal Links and Breadcrumbs...\n');
    console.log('═'.repeat(60));

    let updatedCount = 0;

    Object.keys(tours).forEach(tourFile => {
        if (updateTourPage(tourFile)) {
            updatedCount++;
        }
    });

    console.log('\n' + '═'.repeat(60));
    console.log(`\n✅ Done! Updated ${updatedCount} tour pages.\n`);
    console.log('What was added:');
    console.log('• Breadcrumb navigation (Home > Tours > Current Tour)');
    console.log('• Related tours section at the bottom');
    console.log('• Internal links between tour pages');
    console.log('• Schema.org markup for breadcrumbs\n');
    console.log('SEO Benefits:');
    console.log('• Better internal linking structure');
    console.log('• Improved site navigation');
    console.log('• Enhanced user engagement');
    console.log('• Google-friendly breadcrumb markup\n');
}

main();
