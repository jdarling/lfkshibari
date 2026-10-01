// Render the Markdown used by our guides with DOM nodes, keeping raw HTML inert.
function appendInline(parent, text) {
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`/g;
  let end = 0;
  for (const match of text.matchAll(pattern)) {
    parent.append(text.slice(end, match.index));
    const element = document.createElement(match[1] ? 'strong' : match[2] ? 'em' : 'code');
    element.textContent = match[1] || match[2] || match[3];
    parent.append(element);
    end = match.index + match[0].length;
  }
  parent.append(text.slice(end));
}

function renderGuide(markdown) {
  const fragment = document.createDocumentFragment();
  let paragraph = null;
  let quote = null;
  let lists = [];
  for (const line of markdown.replace(/\r\n?/g, '\n').split('\n')) {
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    const item = line.match(/^(\s*)[-*+]\s+(.+)$/);
    const quoted = line.match(/^>\s?(.*)$/);
    if (!line.trim()) {
      paragraph = null;
      quote = null;
      continue;
    }
    if (item) {
      paragraph = null;
      quote = null;
      const indent = item[1].length;
      while (lists.length && lists.at(-1).indent > indent) lists.pop();
      if (!lists.length || lists.at(-1).indent < indent) {
        const ul = document.createElement('ul');
        const parent = lists.length ? lists.at(-1).lastItem : fragment;
        parent.append(ul);
        lists.push({ indent, element: ul, lastItem: null });
      }
      const li = document.createElement('li');
      const task = item[2].match(/^\[([ xX])\]\s+(.+)$/);
      if (task) {
        li.className = 'guide-task';
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task[1].toLowerCase() === 'x';
        label.append(checkbox, ' ');
        appendInline(label, task[2]);
        li.append(label);
      } else {
        appendInline(li, item[2]);
      }
      lists.at(-1).element.append(li);
      lists.at(-1).lastItem = li;
      continue;
    }
    lists = [];
    if (heading || /^\s*---+\s*$/.test(line)) {
      paragraph = null;
      quote = null;
      const element = document.createElement(heading ? `h${heading[1].length}` : 'hr');
      if (heading) appendInline(element, heading[2]);
      fragment.append(element);
    } else if (quoted) {
      paragraph = null;
      if (!quote) {
        quote = document.createElement('blockquote');
        fragment.append(quote);
      } else quote.append(' ');
      appendInline(quote, quoted[1]);
    } else {
      quote = null;
      if (!paragraph) {
        paragraph = document.createElement('p');
        fragment.append(paragraph);
      } else paragraph.append(' ');
      appendInline(paragraph, line.trim());
    }
  }
  return fragment;
}

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
    content.replaceChildren(renderGuide(markdown));
    document.title = `${content.querySelector('h1')?.textContent || 'Guide'} | LFKShibari`;
  } catch (error) {
    showMessage('A snag in the rope.', 'We couldn’t load this guide right now. Try refreshing, or head home and try again in a moment.');
  } finally {
    content.setAttribute('aria-busy', 'false');
  }
}
loadGuide();
