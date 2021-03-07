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

/**
 *
 * @param {string} domain
 * @param {string} filePath
 * @param {string} linkClassList
 * @param {string} svgClassList
 */
function generateCommitFileLink(domain, filePath, linkClassList, svgClassList) {
  return `
<a
  href="${domain}${filePath}"
  aria-label="See the file at this point in the history"
  class="ml-custom-file-button BtnGroup-item ${linkClassList}"
  rel="nofollow"
>
  <svg class="${svgClassList}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16">
    <path fill-rule="evenodd" d="M4 1.75C4 .784 4.784 0 5.75 0h5.586c.464 0 .909.184 1.237.513l2.914 2.914c.329.328.513.773.513 1.237v8.586A1.75 1.75 0 0114.25 15h-9a.75.75 0 010-1.5h9a.25.25 0 00.25-.25V6h-2.75A1.75 1.75 0 0110 4.25V1.5H5.75a.25.25 0 00-.25.25v2.5a.75.75 0 01-1.5 0v-2.5zm7.5-.188V4.25c0 .138.112.25.25.25h2.688a.252.252 0 00-.011-.013l-2.914-2.914a.272.272 0 00-.013-.011zM5.72 6.72a.75.75 0 000 1.06l1.47 1.47-1.47 1.47a.75.75 0 101.06 1.06l2-2a.75.75 0 000-1.06l-2-2a.75.75 0 00-1.06 0zM3.28 7.78a.75.75 0 00-1.06-1.06l-2 2a.75.75 0 000 1.06l2 2a.75.75 0 001.06-1.06L1.81 9.25l1.47-1.47z"></path>
  </svg>
</a>
`;
}

function run() {
  const url = document.URL;
  // "https://github.com/*/*/commits/*"
  const urlMatched = /https:\/\/github.com\/.*\/.*\/commits\/.*\/.*/.test(url);
  const isCustomButtonsExists =
    document.querySelectorAll('a.ml-custom-file-button')?.length > 0;

  if (!urlMatched || isCustomButtonsExists) {
    return;
  }

  const breadcrumbs = [
    ...document.querySelectorAll('.breadcrumb > span:not(.js-repo-root)'),
  ]
    .map((child) => child.textContent)
    .join('');
  const file = document.querySelector('.breadcrumb strong')?.textContent;

  const shouldRun = breadcrumbs.length > 0 && file?.length > 0;

  if (!shouldRun) {
    return;
  }

  const filePath = `${breadcrumbs}${file}`;
  const browseRepositoryLinks = document.querySelectorAll(
    '.Box-row .d-none > a'
  );

  browseRepositoryLinks.forEach((link) => {
    const domain = link.href.replace('tree', 'blob');
    const linkClasses = [...(link.classList ?? [])].join(' ');
    const svg = link.querySelector('svg');
    const svgClassList = [...(svg.classList ?? [])].join(' ');
    const commitFileLink = generateCommitFileLink(
      domain,
      filePath,
      linkClasses,
      svgClassList
    );
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

// in case the document is already rendered
if (document.readyState !== 'loading') {
  run();
} else if (document.addEventListener) {
  // modern browsers
  document.addEventListener('DOMContentLoaded', run);
}

// fire the function `run` every time that the URL changes under "https://github.com/*"
chrome.runtime.onMessage.addListener((data) => {
  if (data.message === 'urlChanged') {
    run();
  }
});
