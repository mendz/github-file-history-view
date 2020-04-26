/**
 * https://stackoverflow.com/a/35385518
 * @param {String} HTML representing a single element
 * @return {Element}
 */
function htmlToElement(html) {
  const template = document.createElement('template');
  const trimmedHtml = html.trim(); // Never return a text node of whitespace as the result
  template.innerHTML = trimmedHtml;
  return template.content.firstChild;
}

function generateCommitFileLink(domain, filePath) {
  return `
<a
  href="${domain.replace('tree', 'blob')}/${filePath}"
  aria-label="See the file at this point in the history"
  class="btn btn-outline tooltipped tooltipped-sw BtnGroup-item"
  rel="nofollow"
  style="padding: 1.5px 5px;"
>
  <svg
    fill="none"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width="2"
    stroke="currentColor"
    viewBox="0 0 24 24"
    width="24"
    height="24"
  >
    <path
      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
    ></path>
  </svg>
</a>
`;
}

function run() {
  const breadcrumbs = [
    ...document.querySelectorAll('.breadcrumb > span.js-path-segment'),
  ]
    .map(child => child.textContent)
    .join('/');

  if (!breadcrumbs.length) {
    return;
  }

  const file = document.querySelector('.breadcrumb strong').textContent;

  const filePath = `${breadcrumbs}/${file}`;
  const browseRepositoryLinks = document.querySelectorAll(
    '.Box-row .d-none > a'
  );

  browseRepositoryLinks.forEach(link => {
    const domain = link.href.replace('tree', 'blob');
    const commitFileLink = generateCommitFileLink(domain, filePath);
    const cloneLink = link.cloneNode(true);

    const linkToCommitFile = htmlToElement(commitFileLink);
    const container = document.createElement('div');
    container.classList.add('commit-links-group');
    container.classList.add('BtnGroup');
    cloneLink.classList.add('BtnGroup-item');
    container.appendChild(cloneLink);
    container.appendChild(linkToCommitFile);
    link.replaceWith(container);
  });
}

run();
