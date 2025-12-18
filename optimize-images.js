const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const QUALITY = 85;
const RESIZE_MAX_WIDTH = 1920; // Max width for optimization
const RESIZE_MAX_HEIGHT = 1080;

async function optimizeImage(inputPath, outputDir) {
    const filename = path.basename(inputPath, path.extname(inputPath));
    const webpPath = path.join(outputDir, `${filename}.webp`);

    try {
        const metadata = await sharp(inputPath).metadata();
        console.log(`Processing: ${path.basename(inputPath)} (${metadata.width}x${metadata.height}, ${(metadata.size / 1024 / 1024).toFixed(2)}MB)`);

        // Resize if image is too large
        let transformer = sharp(inputPath);
        if (metadata.width > RESIZE_MAX_WIDTH || metadata.height > RESIZE_MAX_HEIGHT) {
            transformer = transformer.resize(RESIZE_MAX_WIDTH, RESIZE_MAX_HEIGHT, {
                fit: 'inside',
                withoutEnlargement: true
            });
            console.log(`  → Resizing to max ${RESIZE_MAX_WIDTH}x${RESIZE_MAX_HEIGHT}`);
        }

        // Convert to WebP
        await transformer
            .webp({ quality: QUALITY })
            .toFile(webpPath);

        const originalSize = fs.statSync(inputPath).size;
        const newSize = fs.statSync(webpPath).size;
        const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

        console.log(`  ✓ Saved to ${path.basename(webpPath)}`);
        console.log(`  → Size: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB (${savings}% reduction)\n`);

        return {
            original: inputPath,
            webp: webpPath,
            originalSize,
            newSize,
            savings: parseFloat(savings)
        };
    } catch (error) {
        console.error(`  ✗ Error processing ${inputPath}:`, error.message);
        return null;
    }
}

async function findImages(dir) {
    const images = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            images.push(...await findImages(fullPath));
        } else if (/\.(jpg|jpeg)$/i.test(item)) {
            images.push(fullPath);
        }
    }

    return images;
}

async function main() {
    console.log('🚀 Starting image optimization...\n');

    // Find all JPG images
    const imagesDir = path.join(__dirname, 'images');
    const backgroundImage = path.join(__dirname, 'riviera-background.jpg');

    let allImages = await findImages(imagesDir);

    // Add background image if exists
    if (fs.existsSync(backgroundImage)) {
        allImages.push(backgroundImage);
    }

    console.log(`Found ${allImages.length} images to optimize\n`);
    console.log('='.repeat(60) + '\n');

    const results = [];
    let totalOriginal = 0;
    let totalNew = 0;

    for (const imagePath of allImages) {
        const outputDir = path.dirname(imagePath);
        const result = await optimizeImage(imagePath, outputDir);

        if (result) {
            results.push(result);
            totalOriginal += result.originalSize;
            totalNew += result.newSize;
        }
    }

    // Summary
    console.log('='.repeat(60));
    console.log('\n📊 OPTIMIZATION SUMMARY\n');
    console.log(`Total images processed: ${results.length}`);
    console.log(`Original total size: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Optimized total size: ${(totalNew / 1024 / 1024).toFixed(2)}MB`);
    console.log(`Total savings: ${((1 - totalNew / totalOriginal) * 100).toFixed(1)}% (${((totalOriginal - totalNew) / 1024 / 1024).toFixed(2)}MB)\n`);
    console.log('✅ Done! WebP images created alongside originals.\n');
    console.log('Next steps:');
    console.log('1. Run: node update-html-images.js');
    console.log('2. Test your website');
    console.log('3. Deploy the changes\n');
}

main().catch(console.error);
