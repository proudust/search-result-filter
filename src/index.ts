import * as duckDuckGo from './duckDuckGo';
import { BlockList } from './blockList';

const blocks = new BlockList('*://*.boom-app.wiki/*');

duckDuckGo.setup();

const observer = new MutationObserver(() => {
  const result = duckDuckGo.getResult();
  const count = result.reduce((count, { href, block }) => {
    if (blocks.test(href)) {
      block();
      count++;
    }
    return count;
  }, 0);

  if (count) duckDuckGo.updateMessage(count + ' サイトをブロックしました');
});
const target = duckDuckGo.getObserveTarget();
if (target) observer.observe(target, { childList: true });
