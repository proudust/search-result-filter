import * as path from 'path';
import { BannerPlugin } from 'webpack';
import type { Configuration } from 'webpack';

/** {@link http://extensions.fenrir-inc.com/dev.html#sme_sec-meta} */
const metadata = `/*!
// ==UserScript==
// @name            Search Result Filter
// @name:ja         検索結果フィルタ (Search Result Filter)
// @author          Proudust
// @description     Exclude certain sites from the DuckDuckGo search results.
// @description     Source code: https://github.com/proudust/search-result-filter
// @description:ja  DuckDuckGo の検索結果から特定のサイトを除外します。
// @description:ja  ソースコード: https://github.com/proudust/search-result-filter
// @include         https://duckduckgo.com/*
// @version         0.1.0
// @history         0.1.0   Initial version.
// @history:ja      0.1.0   最初のバージョン
// ==/UserScript==
*/`;

const config: Configuration = {
  entry: './src/index.ts',
  mode: 'production',
  module: { rules: [{ test: /\.tsx?$/, use: 'ts-loader' }] },
  resolve: { extensions: ['.ts', '.js'] },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'search-result-filter.slex.js',
  },
  plugins: [new BannerPlugin({ raw: true, entryOnly: true, banner: metadata })],
};

export default config;
