const matchPatternRegExp = /^(\*|https?):\/\/(\*|\*\.[^/]+|[^/]+)(\/.*)$/;

class BlockMatchPattern {
  public static tryParce(pattern: string): BlockMatchPattern | undefined {
    const match = matchPatternRegExp.exec(pattern);
    if (match) return new BlockMatchPattern(match);
  }

  private readonly schemeMatch: 'any' | 'exact';
  private readonly scheme?: string;
  private readonly hostMatch: 'any' | 'partial' | 'exact';
  private readonly host?: string;
  private readonly pathMatch: 'any' | 'regexp';
  private readonly path?: RegExp;

  public constructor(pattern: string);
  public constructor(match: RegExpExecArray);
  public constructor(arg1: string | RegExpExecArray) {
    const match = typeof arg1 === 'string' ? matchPatternRegExp.exec(arg1) : arg1;
    if (!match) throw new Error('pattern is not match pattern.');
    const [, scheme, host, path] = match;

    if (scheme === '*') this.schemeMatch = 'any';
    else {
      this.schemeMatch = 'exact';
      this.scheme = scheme;
    }

    if (host === '*') this.hostMatch = 'any';
    else if (host.startsWith('*.')) {
      this.hostMatch = 'partial';
      this.host = host.slice(2);
    } else {
      this.hostMatch = 'exact';
      this.host = host;
    }

    if (path === '/*') this.pathMatch = 'any';
    else {
      this.pathMatch = 'regexp';
      this.path = new RegExp(path.replace(/\./g, '\\.'));
    }
  }

  public test(string: string): boolean {
    const { hostname: host, protocol, pathname, searchParams } = new URL(string);

    if (this.hostMatch === 'partial' && host !== this.host && !host.endsWith(`.${this.host}`)) {
      return false;
    } else if (this.hostMatch === 'exact' && host !== this.host) return false;

    const scheme = protocol.slice(0, -1);
    if (this.schemeMatch === 'any' && scheme !== 'http' && scheme !== 'https') return false;
    else if (this.schemeMatch === 'exact' && scheme !== this.scheme) return false;

    if (this.pathMatch === 'regexp' && !this.path?.test(pathname + searchParams)) return false;

    return true;
  }
}

function regExpTryParse(pattern: string): RegExp | undefined {
  try {
    return new RegExp(pattern);
  } catch {
    return undefined;
  }
}

export class BlockList {
  private readonly list: { test(string: string): boolean }[];

  public constructor(config: string) {
    this.list = config
      .split('\n')
      .filter(c => !!c)
      .map(c => BlockMatchPattern.tryParce(c) ?? regExpTryParse(c))
      .filter(<T>(b: T | undefined): b is T => !!b);
  }

  public test(string: string): boolean {
    return this.list.some(b => b.test(string));
  }
}
