# Image Optimization Guide for AzurEpicTours

## Current Status

Your images are currently in JPG format and range from 164KB to 3MB in size. Here's how to optimize them:

## Step 1: Convert Images to WebP Format

WebP format provides 25-35% better compression than JPG while maintaining quality.

### Option A: Using Online Tools (Easiest)
1. Visit https://squoosh.app/ or https://cloudconvert.com/jpg-to-webp
2. Upload each image from `/images/` folder
3. Set quality to 80-85%
4. Download the WebP versions

### Option B: Using Command Line (Recommended for batch)

#### On Windows:
```bash
# Install cwebp from Google WebP tools
# Download from: https://developers.google.com/speed/webp/download

# Convert all JPG images
for %i in (images\*.jpg images\*.JPG) do cwebp -q 85 "%i" -o "%~ni.webp"
```

#### On Mac/Linux:
```bash
# Install webp
# Mac: brew install webp
# Ubuntu: sudo apt-get install webp

# Convert all JPG images
for img in images/*.{jpg,JPG}; do
    cwebp -q 85 "$img" -o "${img%.*}.webp"
done
```

## Step 2: Update HTML to Use WebP with Fallback

After creating WebP versions, update your image tags to use the `<picture>` element:

### Current format:
```html
<img src="./images/MC_magesty_01.jpg" alt="..." loading="lazy">
```

### Updated format with WebP:
```html
<picture>
    <source srcset="./images/MC_magesty_01.webp" type="image/webp">
    <img src="./images/MC_magesty_01.jpg" alt="Panoramic view of Monaco harbor" loading="lazy">
</picture>
```

## Step 3: Compress Background Image

The `riviera-background.jpg` (2.3MB) should also be converted:

```bash
cwebp -q 80 riviera-background.jpg -o riviera-background.webp
```

Then update CSS:
```css
.hero-section {
    background-image:
        image-set(
            url('./riviera-background.webp') type('image/webp'),
            url('./riviera-background.jpg') type('image/jpeg')
        );
}
```

## Expected Results

- **File size reduction**: 25-35% smaller files
- **Faster page load**: 2-3 seconds improvement
- **Better SEO**: Google PageSpeed score improvement
- **Maintained quality**: Visual quality remains excellent

## Images to Convert

Current images in `/images/` directory:
- MC_coast_01.jpg (164KB)
- MC_coast_02.jpg (2.3MB) ⚠️ Large
- MC_coast_03.JPG (2.2MB) ⚠️ Large
- MC_coast_04.JPG (3.0MB) ⚠️ Large
- MC_magesty_01.jpg (2.7MB) ⚠️ Large
- MC_magesty_02.JPG (2.7MB) ⚠️ Large
- MC_magesty_03.jpg (2.8MB) ⚠️ Large
- MC_majesty_04.jpg (2.8MB) ⚠️ Large
- MC_night_01.jpg (2.7MB) ⚠️ Large
- MC_night_02.jpg (1.8MB) ⚠️ Large
- MC_night_03.jpg (1.3MB) ⚠️ Large
- MC_night_04.jpg (1.9MB) ⚠️ Large
- grandtour_01.jpg (860KB)
- grandtour_02.JPG (2.9MB) ⚠️ Large
- grandtour_03.jpg (2.5MB) ⚠️ Large
- grandtour_04.jpg (2.0MB) ⚠️ Large

Total: ~34MB → Expected after optimization: ~20-23MB

## Additional Optimizations Already Applied

✅ Lazy loading (`loading="lazy"` attribute) - images load only when visible
✅ Descriptive alt tags for SEO and accessibility
✅ SEO meta tags in HTML head
✅ sitemap.xml created
✅ robots.txt created

## Next Steps

1. Convert all images to WebP using one of the methods above
2. Place WebP files in the same `/images/` directory
3. Optionally update HTML to use `<picture>` elements (recommended but not required - browsers will use WebP if available)
4. Test the website to ensure images load correctly
5. Monitor Google PageSpeed Insights for improvements

## CSS/JS Minification

For single-page HTML with inline CSS/JS, manual minification isn't practical for development.

**Recommended approach:**
- Use a build tool when going to production:
  - Option 1: https://www.minifier.org/ (paste your HTML)
  - Option 2: Use VSCode extension "Minify"
  - Option 3: Use online tool: https://htmlcompressor.com/compressor/

**Benefits of minification:**
- Removes whitespace and comments
- Reduces file size by ~20-30%
- Faster initial page load

For now, the lazy loading and WebP conversion will provide the biggest performance improvements.
