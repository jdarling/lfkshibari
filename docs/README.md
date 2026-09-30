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

Push these files to a repository and enable Pages from the repository settings. The site has no build step.

### GitLab Pages

The same files can be served as static content. Depending on project configuration, move/copy them into the Pages public directory in CI.
