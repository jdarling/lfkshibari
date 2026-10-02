async function loadGuide() {
  const content = document.querySelector('#guide-content');
  const name = new URLSearchParams(location.search).get('guide');
  const showMessage = (title, message) => {
    const heading = document.createElement('h1');
    heading.textContent = title;
    const paragraph = document.createElement('p');
    paragraph.textContent = message;
    content.replaceChildren(heading, paragraph);
    document.title = `${title} | LFKShibari`;
  };
  try {
    // Only simple filenames are allowed; never fetch paths or extensions from the URL.
    if (!name || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(name)) {
      showMessage('A loose end.', 'This guide seems to have slipped its knot. Choose a guide from the Guides menu, and we’ll help you pick up the thread.');
      return;
    }
    const response = await fetch(`guides/${name}.md`);
    if (response.status === 404) {
      showMessage('A loose end.', 'This guide seems to have slipped its knot. Choose a guide from the Guides menu, and we’ll help you pick up the thread.');
      return;
    }
    if (!response.ok) throw new Error('Guide unavailable');
    const markdown = await response.text();
    // Some static hosts return their HTML fallback with a successful status.
    if (/^\s*<!doctype html|^\s*<html/i.test(markdown)) throw new Error('Unexpected response');
    content.innerHTML = DOMPurify.sanitize(marked.parse(markdown, { gfm: true }), {
      USE_PROFILES: { html: true }
    });
    // Keep readiness checkboxes usable, with their text as accessible labels.
    content.querySelectorAll('li > input[type="checkbox"]').forEach((checkbox) => {
      const item = checkbox.parentElement;
      item.classList.add('guide-task');
      const label = document.createElement('label');
      while (item.firstChild) label.append(item.firstChild);
      item.append(label);
      checkbox.disabled = false;
    });
    document.title = `${content.querySelector('h1')?.textContent || 'Guide'} | LFKShibari`;
  } catch (error) {
    showMessage('A snag in the rope.', 'We couldn’t load this guide right now. Try refreshing, or head home and try again in a moment.');
  } finally {
    content.setAttribute('aria-busy', 'false');
  }
}
loadGuide();
