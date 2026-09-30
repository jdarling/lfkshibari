# LFKShibari Static Site

A dependency-free static website suitable for GitHub Pages or GitLab Pages.

## Brand

- Background: `#000000`
- Primary green: `#2f743e` (taken directly from the supplied SVG logo)
- White: `#ffffff`
- Display font: Anton
- Body font: Inter

## Files

- `index.html`
- `styles.css`
- `script.js`
- `assets/lfkshibari-logo.svg` (transparent logo for dark backgrounds, used throughout the site)
- `assets/lfkshibari-logo-light.svg` (transparent logo for light backgrounds)

Logo assets are exported from the corresponding SVGs in `branding/logo/`, with text converted to paths so the lettering does not depend on installed fonts. The editable branding originals are preserved.

## Google Form

The vetting section links to the existing Google Form, which opens in a new tab.

## Deployment

### GitHub Pages

In the repository's Settings → Pages, select deployment from a branch and choose the `/docs` folder on that branch. GitHub Pages uses `docs/_config.yml`; the existing HTML, CSS, and JavaScript are published without a theme or layout.

The configuration uses `https://jdarling.github.io/lfkshibari/`. If a custom domain is added, update `url` to that domain and set `baseurl` to `""`.

### GitLab Pages

The same files can be served as static content. Depending on project configuration, move/copy them into the Pages public directory in CI.
