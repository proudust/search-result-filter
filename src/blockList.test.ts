import { BlockList } from './blockList';

describe('MatchPattern', () => {
  test('host: partial', () => {
    const blocks = new BlockList('*://*.example.com//*');
    expect(blocks.test('http://example.com/')).toBeTruthy();
    expect(blocks.test('http://sub.example.com/')).toBeTruthy();
    expect(blocks.test('http://exampleexample.com/')).toBeFalsy();
  });

  test('host: exact', () => {
    const blocks = new BlockList('*://example.com//*');
    expect(blocks.test('http://example.com/')).toBeTruthy();
    expect(blocks.test('http://sub.example.com/')).toBeFalsy();
  });
});
