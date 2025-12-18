const fs = require('fs');
const path = require('path');

// Real phone number
const REAL_PHONE = '+33624729983';
const REAL_PHONE_FORMATTED = '+33 6 24 72 99 83';
const REAL_PHONE_FORMATTED_ALT = '+33 (0)6 24 72 99 83';

// Fake phone numbers to replace
const FAKE_PATTERNS = [
    { pattern: /\+33-1-23-45-67-89/g, type: 'hyphenated' },
    { pattern: /\+33123456789/g, type: 'plain' },
    { pattern: /\+33 1 23 45 67 89/g, type: 'spaced' },
    { pattern: /33123456789/g, type: 'no-plus' }
];

function fixPhoneNumbers(filePath, fileName) {
    console.log(`\n📄 Processing: ${fileName}`);

    let html = fs.readFileSync(filePath, 'utf8');
    let changeCount = 0;
    const changes = [];

    FAKE_PATTERNS.forEach(({ pattern, type }) => {
        const matches = html.match(pattern);
        if (matches) {
            const count = matches.length;

            // Determine replacement based on context
            html = html.replace(pattern, (match) => {
                changeCount++;

                // Check if it's in a tel: link
                const beforeMatch = html.substring(Math.max(0, html.indexOf(match) - 20), html.indexOf(match));
                const afterMatch = html.substring(html.indexOf(match) + match.length, html.indexOf(match) + match.length + 10);

                if (beforeMatch.includes('tel:')) {
                    changes.push(`tel: link (${type})`);
                    return REAL_PHONE;
                } else if (beforeMatch.includes('wa.me/')) {
                    changes.push(`WhatsApp link (${type})`);
                    return REAL_PHONE;
                } else if (beforeMatch.includes('telephone":')) {
                    changes.push(`JSON telephone (${type})`);
                    return REAL_PHONE_FORMATTED;
                } else {
                    changes.push(`text (${type})`);
                    return REAL_PHONE_FORMATTED;
                }
            });

            console.log(`  ✓ Replaced ${count} occurrence(s) of ${type} format`);
        }
    });

    if (changeCount > 0) {
        fs.writeFileSync(filePath, html, 'utf8');
        console.log(`  ✅ Updated ${fileName} (${changeCount} changes)`);
        console.log(`  Changes: ${[...new Set(changes)].join(', ')}`);
        return true;
    } else {
        console.log(`  → No fake numbers found`);
        return false;
    }
}

function verifyPhoneNumbers(filePath, fileName) {
    const html = fs.readFileSync(filePath, 'utf8');

    // Find all phone-related patterns
    const telLinks = html.match(/tel:\+?\d+/g) || [];
    const waLinks = html.match(/wa\.me\/\+?\d+/g) || [];
    const phoneTexts = html.match(/\+33[\s\-\(]?\d[\s\-\.]?\d{2}[\s\-\.]?\d{2}[\s\-\.]?\d{2}[\s\-\.]?\d{2}/g) || [];

    return {
        telLinks,
        waLinks,
        phoneTexts
    };
}

function main() {
    console.log('📞 Fixing Phone Numbers for NAP Consistency...\n');
    console.log('═'.repeat(60));
    console.log(`Real phone number: ${REAL_PHONE_FORMATTED}`);
    console.log('═'.repeat(60));

    const files = [
        'index.html',
        'monaco-majesty.html',
        'monaco-coastline.html',
        'monaco-by-night.html',
        'grand-riviera-tour.html',
        'privacy-policy.html'
    ];

    let updatedCount = 0;
    const updatedFiles = [];

    // Fix phone numbers
    files.forEach(fileName => {
        const filePath = path.join(__dirname, fileName);
        if (fs.existsSync(filePath)) {
            if (fixPhoneNumbers(filePath, fileName)) {
                updatedCount++;
                updatedFiles.push(fileName);
            }
        } else {
            console.log(`\n⚠️  Skipping ${fileName} (not found)`);
        }
    });

    // Verify all numbers are correct now
    console.log('\n' + '═'.repeat(60));
    console.log('\n🔍 VERIFICATION - All Phone Numbers:\n');

    files.forEach(fileName => {
        const filePath = path.join(__dirname, fileName);
        if (fs.existsSync(filePath)) {
            const found = verifyPhoneNumbers(filePath, fileName);
            const allNumbers = [...found.telLinks, ...found.waLinks, ...found.phoneTexts];

            if (allNumbers.length > 0) {
                console.log(`\n${fileName}:`);
                const uniqueNumbers = [...new Set(allNumbers)];
                uniqueNumbers.forEach(num => {
                    const isFake = num.includes('123456789') || num.includes('1-23-45');
                    const status = isFake ? '❌ FAKE' : '✅';
                    console.log(`  ${status} ${num}`);
                });
            }
        }
    });

    console.log('\n' + '═'.repeat(60));
    console.log(`\n✅ Done! Updated ${updatedCount} files.\n`);

    if (updatedFiles.length > 0) {
        console.log('Files updated:');
        updatedFiles.forEach(file => console.log(`  • ${file}`));
    }

    console.log('\nNAP (Name, Address, Phone) Consistency Benefits:');
    console.log('• 📞 Consistent phone number across all pages');
    console.log('• 🔍 Better local SEO ranking');
    console.log('• ✅ No conflicting business information');
    console.log('• 📱 Correct contact details for customers');
    console.log('• 🎯 Google My Business alignment\n');

    console.log('Real phone number used:');
    console.log(`  ${REAL_PHONE_FORMATTED}`);
    console.log(`  ${REAL_PHONE_FORMATTED_ALT}\n`);
}

main();
