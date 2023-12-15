---
title: '@svelte-dev/pretty-code'
desc: 'Beautiful Svelte code blocks for Markdown or MDsveX.'
---

> [`@svelte-dev/pretty-code`](https://github.com/willin/svelte-pretty-code) is a MDsveX highlight plugin powered by [rehype-pretty-code](https://github.com/atomiks/rehype-pretty-code) and [shikiji](https://github.com/antfu/shikiji). The syntax highlighter that provides beautiful code blocks for Markdown or MDsveX. It only works on `Block Codes` (not `Inline codes`).

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

## Installation

Install via your terminal:

```shell
npm add @svelte-dev/pretty-code
```

This package is ESM-only and currently supports `shikiji` `^0.7.0 || ^0.8.0`.

## Usage

The following works both on the server and on the client.

> `unified@11` is used as a dependency.

```js /createHighlighter/
import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import { createHighlighter } from '@svelte-dev/pretty-code';

const config = defineConfig({
  extensions: ['.svelte.md', '.md', '.svx'],

  highlight: {
    highlighter: createHighlighter({
      // keepBackground: false,
      theme: {
        dark: 'solarized-dark',
        light: 'solarized-light'
      }
    })
  }
});

export default config;
```

## Options

```ts
interface Options {
  grid?: boolean;
  theme?: Theme | Record<string, Theme>;
  keepBackground?: boolean;
  defaultLang?: string;
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

### `grid`

A grid style is present by default which allows line highlighting to span the
entire width of a horizontally-scrollable code block.

You can disable this setting if necessary:

```js
const options = {
  grid: false
};
```

### `theme`

The default theme is `github-dark-dimmed`. Shikiji has a bunch of
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

### `keepBackground`

To apply a custom background instead of inheriting the background from the
theme:

```js
const options = {
  keepBackground: false
};
```

### `defaultLang`

In this case, you can specify a default language:

```js
const options = {
  defaultLang: 'plaintext'
};
```

### `transformers`

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

The line `<span>` receives a `data-highlighted-line` attribute to style
via CSS.

#### Group Highlighted Lines By Id

Place an id after `#` after the `{}`. This allows you to color or style lines
differently based on their id.

````md
\```js {1,2}#a {3,4}#b

\```
````

The line `<span>` receives a `data-highlighted-line-id="<id>"` attribute
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

The chars `<span>` receives a `data-highlighted-chars` attribute to style
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

The chars `<span>` receives a `data-chars-id="<id>"` attribute to style
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

`<code>` will have attributes `data-line-numbers` and
`data-line-numbers-max-digits="n"`.

If you want to start line numbers at a specific number, use
`showLineNumbers{number}`:

````md
\```js showLineNumbers{number}

\```
````

### Multiple Themes (Dark and Light Mode)

Pass your themes to `theme`, where the keys represent
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

The `<code>` and `<pre>` elements will have the data attribute
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
`getHighlighter` option. This is helpful if you'd like
to configure other Shikiji options, such as `langs`.

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
