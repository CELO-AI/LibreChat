const fs = require('fs');
const path = require('path');
const yaml = require('./api/node_modules/js-yaml');

const BRANDING_FILE = 'branding.yaml';
const CLIENT_DIR = 'client';
const API_DIR = 'api';

async function applyBranding() {
    console.log('🎨 Applying branding from ' + BRANDING_FILE + '...');

    if (!fs.existsSync(BRANDING_FILE)) {
        console.error('❌ Branding file not found: ' + BRANDING_FILE);
        process.exit(1);
    }

    const branding = yaml.load(fs.readFileSync(BRANDING_FILE, 'utf8'));

    // 1. Update .env (Backend Config)
    updateEnv(branding);

    // 2. Update client/index.html (Title & Manifest Link)
    updateIndexHtml(branding);

    // 3. Update client/public/manifest.json (App Name)
    updateManifest(branding);

    // 4. Generate client/src/branding.css (Colors)
    generateBrandingCss(branding);

    // 5. Inject branding.css into client/src/main.jsx
    injectBrandingCssImport();

    console.log('✅ Branding applied successfully!');
    console.log('👉 Please rebuild the client: npm run frontend');
}

function updateEnv(branding) {
    const envPath = '.env';
    let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, 'utf8') : '';

    const newEnvVars = {
        APP_TITLE: branding.env?.APP_TITLE || branding.app.name,
        CUSTOM_FOOTER: branding.env?.CUSTOM_FOOTER
    };

    for (const [key, value] of Object.entries(newEnvVars)) {
        if (!value) continue;
        const regex = new RegExp(`^${key}=.*`, 'm');
        if (regex.test(envContent)) {
            envContent = envContent.replace(regex, `${key}="${value}"`);
        } else {
            envContent += `\n${key}="${value}"`;
        }
    }

    fs.writeFileSync(envPath, envContent);
    console.log('Updated .env');
}

function updateIndexHtml(branding) {
    const indexPath = path.join(CLIENT_DIR, 'index.html');
    if (!fs.existsSync(indexPath)) return;

    let html = fs.readFileSync(indexPath, 'utf8');

    // Update Title
    if (branding.app.title) {
        html = html.replace(/<title>.*<\/title>/, `<title>${branding.app.title}</title>`);
    }

    // Update Meta Description (Optional)
    if (branding.app.description) {
        html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${branding.app.description}" />`);
    }

    // Inject Manifest Link if missing
    if (!html.includes('rel="manifest"')) {
        html = html.replace('</head>', '    <link rel="manifest" href="/manifest.json" />\n  </head>');
        console.log('Injected manifest link into index.html');
    }

    fs.writeFileSync(indexPath, html);
    console.log('Updated index.html');
}

function updateManifest(branding) {
    const manifestPath = path.join(CLIENT_DIR, 'public', 'manifest.json');

    let manifest = {};
    if (fs.existsSync(manifestPath)) {
        manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    } else {
        console.log('Creating new manifest.json');
        manifest = {
            "name": "LibreChat",
            "short_name": "LibreChat",
            "icons": [
                {
                    "src": "assets/favicon-32x32.png",
                    "sizes": "32x32",
                    "type": "image/png"
                },
                {
                    "src": "assets/apple-touch-icon-180x180.png",
                    "sizes": "180x180",
                    "type": "image/png"
                }
            ],
            "theme_color": "#171717",
            "background_color": "#171717",
            "display": "standalone"
        };
    }

    manifest.name = branding.app.name;
    manifest.short_name = branding.app.name;

    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Updated manifest.json');
}

function generateBrandingCss(branding) {
    if (!branding.theme || !branding.theme.colors) return;

    let cssContent = '/* Auto-generated branding styles */\n';

    if (branding.theme.colors.light) {
        cssContent += ':root {\n';
        for (const [key, value] of Object.entries(branding.theme.colors.light)) {
            cssContent += `  ${key}: ${value} !important;\n`;
        }
        cssContent += '}\n';
    }

    if (branding.theme.colors.dark) {
        cssContent += '.dark {\n';
        for (const [key, value] of Object.entries(branding.theme.colors.dark)) {
            cssContent += `  ${key}: ${value} !important;\n`;
        }
        cssContent += '}\n';
    }

    const cssPath = path.join(CLIENT_DIR, 'src', 'branding.css');
    fs.writeFileSync(cssPath, cssContent);
    console.log('Generated branding.css');
}

function injectBrandingCssImport() {
    const mainPath = path.join(CLIENT_DIR, 'src', 'main.jsx');
    if (!fs.existsSync(mainPath)) return;

    let mainContent = fs.readFileSync(mainPath, 'utf8');
    if (!mainContent.includes("import './branding.css'")) {
        // Insert after style.css
        if (mainContent.includes("import './style.css'")) {
            mainContent = mainContent.replace("import './style.css'", "import './style.css';\nimport './branding.css'");
        } else {
            // Prepend
            mainContent = "import './branding.css';\n" + mainContent;
        }
        fs.writeFileSync(mainPath, mainContent);
        console.log('Injected branding.css into main.jsx');
    }
}

applyBranding();
