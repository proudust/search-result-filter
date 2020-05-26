export interface SearchResult {
  href: string;
  block(): void;
}

export function getObserveTarget(): Element | null {
  return document.getElementById('links');
}

export function setup(): void {
  const style = document.createElement('style');
  document.head.appendChild(style);
  const css = style.sheet as CSSStyleSheet | null;
  css?.insertRule('.srf-is-blocked { display: none }', 0);
}

export function getResult(): SearchResult[] {
  const links = document.getElementById('links');
  if (!links) return [];
  return Array.from(links.children).reduce<SearchResult[]>((array, child) => {
    const atag: Element | null = child.getElementsByClassName('result__a')[0];
    const href = atag?.attributes.getNamedItem('href')?.value;
    if (href) array.push({ href, block: () => child.classList.add('srf-is-blocked') });
    return array;
  }, []);
}

export function updateMessage(message: string): void {
  let srfmsg = document.getElementById('srf-message');
  if (!srfmsg) {
    const ddgmsg = document.getElementById('message');
    if (!ddgmsg) return;
    srfmsg = document.createElement('div');
    srfmsg.id = 'srf-message';
    ddgmsg.appendChild(srfmsg);
  }
  srfmsg.innerText = message;
}
