---
title: '@svelte-dev/pretty-code'
desc: '一个漂亮的 Svelte MDsveX 代码高亮显示插件'
---

> []`@svelte-dev/pretty-code`](https://github.com/willin/svelte-pretty-code) is a MDsveX highlight plugin powered by [rehype-pretty-code](https://github.com/atomiks/rehype-pretty-code) and [shikiji](https://github.com/antfu/shikiji). The syntax highlighter that provides beautiful code blocks for Markdown or MDsveX. It only works on `Block Codes` (not `Inline codes`).

## Editor-Grade Highlighting

> Enjoy the accuracy and granularity of VS Code's syntax highlighting engine and
> the popularity of its themes ecosystem — use any VS Code theme you want!

```tsx title="demo.tsx"
import { useFloating, offset } from '@floating-ui/react';

interface Props {
  open: boolean;
  onOpenChange(open: boolean): void;
}

export function App({ open, onOpenChange }: Props) {
  const { refs, floatingStyles } = useFloating({
    open,
    onOpenChange,
    placement: 'left',
    middleware: [offset(10)]
  });

  return (
    <Container>
      <div ref={refs.setReference} />
      {open && <div ref={refs.setFloating} style={floatingStyles} />}
    </Container>
  );
}
```

> The theme is [Moonlight II](https://github.com/atomiks/moonlight-vscode-theme)
> with a custom background color.

## Line Numbers and Line Highlighting

Draw attention to a particular line of code.

```js caption="Caption" {4} showLineNumbers
import { useFloating } from '@floating-ui/react';

function MyComponent() {
  const { refs, floatingStyles } = useFloating();

  return (
    <>
      <div ref={refs.setReference} />
      <div ref={refs.setFloating} style={floatingStyles} />
    </>
  );
}
```

## Word Highlighting

Draw attention to a particular word or series of characters.

```js /floatingStyles/
import { useFloating } from '@floating-ui/react';

function MyComponent() {
  const { refs, floatingStyles } = useFloating();

  return (
    <>
      <div ref={refs.setReference} />
      <div ref={refs.setFloating} style={floatingStyles} />
    </>
  );
}
```

## ANSI Highlighting

```bash
[0;36m  vite v5.0.0[0;32m dev server running at:[0m

  > Local: [0;36mhttp://localhost:[0;36;1m3000[0;36m/[0m
  > Network: [0;2muse `--host` to expose[0m

  [0;36mready in 125ms.[0m

[0;2m8:38:02 PM[0m [0;36;1m[vite][0m [0;32mhmr update [0;2m/src/App.jsx
```

Inline ANSI: `> Local: [0;36mhttp://localhost:[0;36;1m3000[0;36m/[0m{:ansi}`

## Installation

Install via your terminal:

```shell
npm install rehype-pretty-code shikiji@^0.8.0
```

This package is ESM-only and currently supports `shikiji{:.string}`
`^0.7.0 || ^0.8.0{:.string}`.

> **Note:** If you need `CJS` support you should use
> `rehype-pretty-code@0.10.1{:.string}`, which uses Shiki instead of Shikiji
> ([v0.10.1 docs here](https://github.com/atomiks/rehype-pretty-code/blob/00e5451e3aac7b86f748b01267e255bf345d1550/website/src/app/index.mdx)).
> To use the latest version in Next.js, ensure your config file is `ESM`:
> `next.config.mjs`. Here's a full example:
> [rehype-pretty-code/website/next.config.mjs](https://github.com/atomiks/rehype-pretty-code/blob/master/website/next.config.mjs)

## Usage

The following works both on the server and on the client.

> `unified@11{:.string}` is used as a dependency.

```js /rehypePrettyCode/
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import rehypePrettyCode from 'rehype-pretty-code';

async function main() {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      // See Options section below.
    })
    .use(rehypeStringify)
    .process('`const numbers = [1, 2, 3]{:js}`');

  console.log(String(file));
}

main();
```

### MDX

The following example shows how to use this package with Next.js.

```js title="next.config.mjs"
import fs from 'node:fs';
import nextMDX from '@next/mdx';
import rehypePrettyCode from 'rehype-pretty-code';

/** @type {import('rehype-pretty-code').Options} */
const options = {
  // See Options section below.
};

const withMDX = nextMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: [[rehypePrettyCode, options]]
  }
});

/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true };

export default withMDX(nextConfig);
```

> **Make sure you have disabled** the `mdxRs{:.meta.object-literal.key}` option
> for Next.js 13 / app dir, as it currently does not support Rehype plugins.

## Options

```ts
interface Options {
  grid?: boolean;
  theme?: Theme | Record<string, Theme>;
  keepBackground?: boolean;
  defaultLang?: string | { block?: string; inline?: string };
  tokensMap?: Record<string, string>;
  transformers?: ShikijiTransformer[];
  filterMetaString?(str: string): string;
  getHighlighter?(options: BundledHighlighterOptions): Promise<Highlighter>;
  onVisitLine?(element: LineElement): void;
  onVisitHighlightedLine?(element: LineElement): void;
  onVisitHighlightedChars?(element: CharsElement, id: string | undefined): void;
  onVisitTitle?(element: Element): void;
  onVisitCaption?(element: Element): void;
}
```

### `grid{:.meta.object-literal.key}`

A grid style is present by default which allows line highlighting to span the
entire width of a horizontally-scrollable code block.

You can disable this setting if necessary:

```js
const options = {
  grid: false
};
```

### `theme{:.meta.object-literal.key}`

The default theme is `github-dark-dimmed{:.string}`. Shikiji has a bunch of
[pre-packaged themes](https://github.com/antfu/shikiji/blob/main/docs/themes.md),
which can be specified as a plain string:

```js
const options = {
  theme: 'one-dark-pro'
};
```

You can use your own theme as well by passing the theme JSON:

```js
const options = {
  theme: JSON.parse(
    fs.readFileSync(new URL('./themes/moonlight-ii.json', import.meta.url), 'utf-8')
  )
};
```

### `keepBackground{:.meta.object-literal.key}`

To apply a custom background instead of inheriting the background from the
theme:

```js
const options = {
  keepBackground: false
};
```

### `defaultLang{:.meta.object-literal.key}`

When no code language is specified, inline code or code blocks will not be
themed (nor will the background), which may appear incongruous with others.

In this case, you can specify a default language:

```js
const options = {
  defaultLang: 'plaintext'
};
```

Or you can also specify default languages for inline code and code blocks
separately:

```js
const options = {
  defaultLang: {
    block: 'plaintext',
    inline: 'plaintext'
  }
};
```

### `transformers{:.meta.object-literal.key}`

[Transformers](https://github.com/antfu/shikiji#hast-transformers) are a
Shikiji-native way to manipulate the `hAST` tree of the code blocks and further
extend the behavior of this plugin. The
[`shikiji-transformers`](https://www.npmjs.com/package/shikiji-transformers)
package provides some useful transformers.

```js
import { transformerNotationDiff } from 'shikiji-transformers';

const options = {
  transformers: [transformerNotationDiff()]
};
```

### Meta Strings

Code blocks are configured via the meta string on the top codeblock fence.

> If your library also parses code blocks' meta strings, it may
> [cause conflicts](https://github.com/atomiks/rehype-pretty-code/issues/52)
> with `rehype-pretty-code`. This option allows you to filter out some part of
> the meta string before the library starts parsing it.
>
> ```js
> const options = {
>   filterMetaString: (string) => string.replace(/filename="[^"]*"/, '')
> };
> ```

#### Highlight Lines

Place a numeric range inside `{}`.

````md
\```js {1-3,4}

\```
````

The line `<span>{:html}` receives a `data-highlighted-line` attribute to style
via CSS.

#### Group Highlighted Lines By Id

Place an id after `#` after the `{}`. This allows you to color or style lines
differently based on their id.

````md
\```js {1,2}#a {3,4}#b

\```
````

The line `<span>{:html}` receives a `data-highlighted-line-id="<id>"` attribute
to style via CSS.

#### Highlight Chars

You can use either `/`:

````md
\```js /carrot/

\```
````

Or `"` as a delimiter:

````md
\```js "carrot"
\```
````

Different segments of chars can also be highlighted:

````md
\```js /carrot/ /apple/

\```
````

The chars `<span>{:html}` receives a `data-highlighted-chars` attribute to style
via CSS.

To highlight only the third to fifth instances of `carrot`, a numeric range can
be placed after the last `/`.

````md
\```js /carrot/3-5

\```
````

Highlight only the third to fifth instances of `carrot` and any instances of
`apple`.

````md
\```js /carrot/3-5 /apple/

\```
````

#### Group Highlighted Chars By Id

Place an id after `#` after the chars. This allows you to color chars
differently based on their id.

````md
\```js /age/#v /name/#v /setAge/#s /setName/#s /50/#i /'Taylor'/#i
const [age, setAge] = useState(50);
const [name, setName] = useState('Taylor');
\```
````

```js /age/#v /name/#v /setAge/#s /setName/#s /50/#i /'Taylor'/#i
const [age, setAge] = useState(50);
const [name, setName] = useState('Taylor');
```

The chars `<span>{:html}` receives a `data-chars-id="<id>"` attribute to style
via CSS.

#### Titles

Add a file title to your code block, with text inside double quotes (`""`):

````md
\```js title="..."

\```
````

#### Captions

Add a caption underneath your code block, with text inside double quotes (`""`):

````md
\```js caption="..."

\```
````

### Line Numbers

CSS counters can be used to add line numbers.

```css {2,6-7}
code {
  counter-reset: line;
}

code > [data-line]::before {
  counter-increment: line;
  content: counter(line);

  /* Other styling */
  display: inline-block;
  width: 1rem;
  margin-right: 2rem;
  text-align: right;
  color: gray;
}

code[data-line-numbers-max-digits='2'] > [data-line]::before {
  width: 2rem;
}

code[data-line-numbers-max-digits='3'] > [data-line]::before {
  width: 3rem;
}
```

If you want to conditionally show them, use `showLineNumbers`:

````md
\```js showLineNumbers

\```
````

`<code>{:html}` will have attributes `data-line-numbers` and
`data-line-numbers-max-digits="n"`.

If you want to start line numbers at a specific number, use
`showLineNumbers{number}`:

````md
\```js showLineNumbers{number}

\```
````

### Multiple Themes (Dark and Light Mode)

Pass your themes to `theme{:.meta.object-literal.key}`, where the keys represent
the color mode:

```js
const options = {
  theme: {
    dark: 'github-dark-dimmed',
    light: 'github-light'
  }
};
```

Now, use the following CSS to display the variable colors — if a space is found
in the theme name, then CSS variable keys based on the object are available
([more info](https://github.com/antfu/shikiji#lightdark-dual-themes)):

```scss
code[data-theme*=' '],
code[data-theme*=' '] span {
  color: var(--shiki-light);
  background-color: var(--shiki-light-bg);
}

@media (prefers-color-scheme: dark) {
  code[data-theme*=' '],
  code[data-theme*=' '] span {
    color: var(--shiki-dark);
    background-color: var(--shiki-dark-bg);
  }
}
```

The `<code>{:html}` and `<pre>{:html}` elements will have the data attribute
`data-theme="...themes"`, listing each theme value space-separated:

```html
<code data-theme="github-dark-dimmed github-light"></code>
```

### Visitor Hooks

To customize the HTML output, you can use visitor callback hooks to manipulate
the [hAST elements](https://github.com/syntax-tree/hast#element) directly:

```js
const options = {
  onVisitLine(element) {
    console.log('Visited line');
  },
  onVisitHighlightedLine(element) {
    console.log('Visited highlighted line');
  },
  onVisitHighlightedChars(element) {
    console.log('Visited highlighted chars');
  },
  onVisitTitle(element) {
    console.log('Visited title');
  },
  onVisitCaption(element) {
    console.log('Visited caption');
  }
};
```

### Custom Highlighter

To completely configure the highlighter, use the
`getHighlighter{:.entity.name.function}` option. This is helpful if you'd like
to configure other Shikiji options, such as `langs{:.meta.object-literal.key}`.

```js
import { getHighlighter } from 'shikiji';

const options = {
  getHighlighter: (options) =>
    getHighlighter({
      ...options,
      langs: ['plaintext', async () => JSON.parse(await readFile('my-grammar.json', 'utf-8'))]
    })
};
```
