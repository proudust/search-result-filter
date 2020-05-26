import { getResult } from './duckDuckGo';

describe('duckDuckGo', () => {
  test('duckDuckGo.getResult', () => {
    document.body.innerHTML = `
      <div id="message"></div>
      <div id="links">
        <div class="result" data-hostname="www.nintendo.co.jp">
          <h2><a class="result__a" href="http://kirarafan.com/"></a></h2>
        </div>
        <div class="organic-module"></div>
        <div class="result" data-hostname="boom-app.wiki">
          <h2><a class="result__a" href="https://kirarafantasia.boom-app.wiki/"></a></h2>
        </div>
      </div>
    `;
    expect(getResult().map(r => r.href)).toEqual([
      'http://kirarafan.com/',
      'https://kirarafantasia.boom-app.wiki/',
    ]);
  });
});
