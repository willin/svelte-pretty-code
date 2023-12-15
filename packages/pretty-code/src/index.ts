/* eslint-disable @typescript-eslint/ban-ts-comment */
import { unified } from 'unified';
import rehypePrettyCode, { type Options } from 'rehype-pretty-code';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';

/**
 * Escape curlies, backtick, \t, \r, \n to avoid breaking output of {@html `here`} in .svelte
 *
 * [reference](https://github.com/pngwn/MDsveX/blob/6c60fe68c335fce559db9690fbf5e69ef539d37d/packages/mdsvex/src/transformers/index.ts#L571)
 * @param {string} str
 * @returns {string}
 */
const escape_svelty = (str: string) =>
  str
    // @ts-expect-error
    .replace(/[{}`]/g, (c) => ({ '{': '&#123;', '}': '&#125;', '`': '&#96;' })[c])
    .replace(/\\([trn])/g, '&#92;$1');

const makeSource = (code: string, lang: string, meta: string) =>
  `\`\`\`${lang} ${meta}\n${code}\n\`\`\``;

export function createHighlighter(options: Options) {
  return async function highligher(raw: string, inputLang: string, metastring?: string) {
    const html = await unified()
      .use(remarkParse)
      .use(remarkRehype)
      .use(rehypePrettyCode, options)
      .use(rehypeStringify)
      .process(
        //
        makeSource(raw, inputLang, metastring || '')
      );
    return escape_svelty(String(html));
  };
}
