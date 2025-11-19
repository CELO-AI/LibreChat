# 🎨 Rebranding Guide

This guide explains how to quickly rebrand your LibreChat fork for any company using the automated branding system.

## Quick Start

1. **Edit `branding.yaml`** with your company's details
2. **Run the script:** `node apply_branding.js`
3. **Rebuild the frontend:** `npm run frontend`
4. **Restart the application**

That's it! Your rebrand is complete.

---

## Configuration File: `branding.yaml`

The `branding.yaml` file controls all branding aspects. Here's what each section does:

### App Information
```yaml
app:
  name: "CELO"                    # Company/product name
  url: "https://celo.ai"          # Company website
  description: "Enterprise AI"    # Short description
  title: "CELO - Enterprise AI"   # Browser tab title
```

### Theme Colors
Customize your brand colors for both light and dark modes:

```yaml
theme:
  colors:
    light:
      "--brand-purple": "#ff6600"  # Primary brand color (orange)
      "--text-primary": "#000000"
      "--surface-primary": "#ffffff"
    dark:
      "--brand-purple": "#ff6600"
      "--text-primary": "#ffffff"
      "--surface-primary": "#1a1a1a"
```

**Available CSS Variables:**
- `--brand-purple`: Primary brand color (used for accents, buttons)
- `--text-primary`: Main text color
- `--text-secondary`: Secondary text color
- `--surface-primary`: Main background color
- `--surface-secondary`: Secondary background color
- `--surface-submit`: Submit button color
- `--border-light`, `--border-medium`, `--border-heavy`: Border colors

See `client/src/style.css` for the full list of available CSS variables.

### Environment Variables
These are automatically written to `.env`:

```yaml
env:
  APP_TITLE: "CELO"
  CUSTOM_FOOTER: "[CELO v1.0](https://celo.ai) - Enterprise Edition"
```

### Assets (Future)
```yaml
assets:
  logo: "./assets/logo.png"
  favicon: "./assets/favicon.ico"
```
*Note: Asset replacement is not yet automated. Manually replace files in `client/public/assets/`*

---

## What the Script Does

When you run `node apply_branding.js`, it automatically:

1. ✅ **Updates `.env`** with `APP_TITLE` and `CUSTOM_FOOTER`
2. ✅ **Updates `client/index.html`** with your app title and description
3. ✅ **Creates/updates `client/public/manifest.json`** with your app name
4. ✅ **Generates `client/src/branding.css`** with your custom colors
5. ✅ **Injects the CSS import** into `client/src/main.jsx`

---

## Example: Rebranding for "Acme Corp"

1. Edit `branding.yaml`:
```yaml
app:
  name: "Acme Chat"
  url: "https://acme.com"
  description: "Acme AI Assistant"
  title: "Acme Chat - AI Assistant"
theme:
  colors:
    light:
      "--brand-purple": "#e74c3c"  # Acme Red
    dark:
      "--brand-purple": "#e74c3c"
env:
  APP_TITLE: "Acme Chat"
  CUSTOM_FOOTER: "[Acme Chat](https://acme.com) - Powered by AI"
```

2. Run the script:
```bash
node apply_branding.js
```

3. Rebuild:
```bash
npm run frontend
```

4. Restart your application and see the changes!

---

## Manual Asset Replacement

For logos and favicons, manually replace these files in `client/public/assets/`:
- `favicon-32x32.png`
- `favicon-16x16.png`
- `apple-touch-icon-180x180.png`

Then rebuild the frontend.

---

## Maintaining Your Fork

This branding system is designed to be **fork-friendly**:

- ✅ All branding is in **one config file** (`branding.yaml`)
- ✅ Generated files (`branding.css`) are **gitignored** (add to `.gitignore`)
- ✅ Core LibreChat files are **not modified** (easy to merge upstream updates)

### Recommended `.gitignore` additions:
```
branding.yaml
client/src/branding.css
```

This way, each deployment can have its own `branding.yaml` without conflicts.

---

## Troubleshooting

**Script fails with "Cannot find module 'js-yaml'"**
- Run `npm install` in the root directory first

**Colors not updating**
- Clear your browser cache
- Check `client/src/branding.css` was generated
- Ensure you rebuilt with `npm run frontend`

**Title not changing**
- Check `.env` has `APP_TITLE` set
- Restart the backend: `npm run backend`

---

## Advanced: Adding More CSS Variables

To customize more aspects of the UI:

1. Find the CSS variable name in `client/src/style.css`
2. Add it to `branding.yaml` under `theme.colors.light` or `theme.colors.dark`
3. Run `node apply_branding.js`
4. Rebuild

Example:
```yaml
theme:
  colors:
    light:
      "--surface-submit": "#00aa00"        # Green submit button
      "--surface-submit-hover": "#008800"
```
