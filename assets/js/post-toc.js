document.addEventListener('DOMContentLoaded', () => {
  const toc = document.querySelector('[data-post-toc]');
  const content = document.querySelector('.post-content');
  const postPage = document.querySelector('.post-page');
  const toggle = document.querySelector('[data-post-sidebar-toggle]');
  if (!toc || !content || !postPage) return;

  let headings = [...content.querySelectorAll('h1, h2, h3, h4')];
  if (!headings.length) return;

  const slugify = (text) =>
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

  const nodes = [];
  const stack = [];

  headings.forEach((heading, index) => {
    if (!heading.id) {
      heading.id = `${slugify(heading.textContent) || 'section'}-${index + 1}`;
    }

    const node = {
      heading,
      level: Number(heading.tagName.slice(1)),
      children: [],
    };

    while (stack.length && stack[stack.length - 1].level >= node.level) {
      stack.pop();
    }

    if (stack.length) {
      stack[stack.length - 1].children.push(node);
    } else {
      nodes.push(node);
    }

    stack.push(node);
  });

  const renderNode = (node, container, depth) => {
    if (node.children.length) {
      const details = document.createElement('details');
      details.className = 'post-toc-group';
      details.dataset.depth = String(depth);
      details.open = true;

      const summary = document.createElement('summary');
      const summaryLink = document.createElement('a');
      summaryLink.href = `#${node.heading.id}`;
      summaryLink.textContent = node.heading.textContent;
      summaryLink.addEventListener('click', (event) => {
        event.stopPropagation();
      });
      summary.appendChild(summaryLink);
      details.appendChild(summary);

      const subnav = document.createElement('div');
      subnav.className = 'post-toc-subnav';
      details.appendChild(subnav);

      node.children.forEach((child) => renderNode(child, subnav, depth + 1));
      container.appendChild(details);
      return;
    }

    const link = document.createElement('a');
    link.href = `#${node.heading.id}`;
    link.textContent = node.heading.textContent;
    link.className = 'is-subsection';
    link.dataset.depth = String(depth);
    container.appendChild(link);
  };

  nodes.forEach((node) => renderNode(node, toc, 0));

  if (toggle) {
    toggle.addEventListener('click', () => {
      const collapsed = postPage.classList.toggle('sidebar-hidden');
      toggle.textContent = collapsed ? 'Show Outline' : 'Hide Outline';
      toggle.setAttribute('aria-expanded', String(!collapsed));
    });
  }
});
