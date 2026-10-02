# Guide rendering dependencies

Locally hosted browser bundles from official npm packages, with upstream licenses retained.

- Marked 18.0.14: https://github.com/markedjs/marked
- DOMPurify 3.4.16: https://github.com/cure53/DOMPurify

Package tarballs were verified against the npm registry SHA-512 integrity values.
To update, download a pinned release from the official npm registry, verify its
integrity, and replace the browser bundle and licenses. Test guide formatting,
links, checkboxes, and HTML sanitization after updates. No build step is required.
