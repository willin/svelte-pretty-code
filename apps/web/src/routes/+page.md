---
title: '@svelte-dev/pretty-code'
desc: '一个漂亮的 Svelte MDsveX 代码高亮显示插件'
---

> [`@svelte-dev/pretty-code`](https://github.com/willin/svelte-pretty-code) 是一个由 [rehype-pretty-code](https://github.com/atomiks/rehype-pretty-code) 和 [shikiji](https://github.com/antfu/shikiji) 提供支持的 MDsveX 高亮插件。这个语法高亮器为 Markdown 或 MDsveX 提供了漂亮的代码块。它只适用于 `块代码`（不适用于 `内联代码`）。

## 编辑器级高亮

> 享受 VS Code 语法高亮引擎的准确性和粒度，
> 以及其主题生态系统的流行 —— 使用任何你想要的 VS Code 主题！

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

## 行号和行高亮

将注意力引向特定的代码行。

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

## 单词高亮

将注意力引向特定的单词或字符序列。

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

## ANSI 高亮

```bash
[0;36m  vite v5.0.0[0;32m dev server running at:[0m

  > Local: [0;36mhttp://localhost:[0;36;1m3000[0;36m/[0m
  > Network: [0;2muse `--host` to expose[0m

  [0;36mready in 125ms.[0m

[0;2m8:38:02 PM[0m [0;36;1m[vite][0m [0;32mhmr update [0;2m/src/App.jsx
```

## 安装

通过终端进行安装：

```shell
npm add @svelte-dev/pretty-code
```

此包仅支持 ESM，并且当前支持 `shikiji` `^0.7.0 || ^0.8.0`。

## 使用

以下在服务器和客户端上都可以工作。

> `unified@11` 被用作依赖项。

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

## 选项

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

默认情况下存在一个网格样式，允许行高亮跨越水平滚动的代码块的整个宽度。

如果需要，你可以禁用此设置：

```js
const options = {
  grid: false
};
```

### `theme`

默认主题是 `github-dark-dimmed`。Shikiji 有一堆
[预打包的主题](https://github.com/antfu/shikiji/blob/main/docs/themes.md)，
可以指定为一个简单的字符串：

```js
const options = {
  theme: 'one-dark-pro'
};
```

你也可以通过传递主题 JSON 来使用你自己的主题：

```js
const options = {
  theme: JSON.parse(
    fs.readFileSync(new URL('./themes/moonlight-ii.json', import.meta.url), 'utf-8')
  )
};
```

### `keepBackground`

要应用自定义背景，而不是从主题继承背景：

```js
const options = {
  keepBackground: false
};
```

### `defaultLang`

你可以指定一个默认语言：

```js
const options = {
  defaultLang: 'plaintext'
};
```

### `transformers`

[Transformers](https://github.com/antfu/shikiji#hast-transformers) 是一种
Shikiji-native 的方式来操作代码块的 `hAST` 树，并进一步扩展此插件的行为。[`shikiji-transformers`](https://www.npmjs.com/package/shikiji-transformers)
包提供了一些有用的 transformers。

```js
import { transformerNotationDiff } from 'shikiji-transformers';

const options = {
  transformers: [transformerNotationDiff()]
};
```

### Meta Strings

通过顶部代码块围栏上的元字符串配置代码块。

> 如果你的库也解析代码块的元字符串，它可能会
> [引起冲突](https://github.com/atomiks/rehype-pretty-code/issues/52)
> 与 `rehype-pretty-code`。此选项允许你在库开始解析之前过滤掉元字符串的一部分。
>
> ```js
> const options = {
>   filterMetaString: (string) => string.replace(/filename="[^"]*"/, '')
> };
> ```

#### 高亮行

在 `{}` 内放置一个数字范围。

````md
\```js {1-3,4}

\```
````

行 `<span>` 接收一个 `data-highlighted-line` 属性以通过 CSS 进行样式化。

#### 通过 Id 分组高亮行

在 `{}` 后面放置一个 `#` 后面的 id。这允许你根据他们的 id 以不同的颜色或样式对行进行着色。

````md
\```js {1,2}#a {3,4}#b

\```
````

行 `<span>` 接收一个 `data-highlighted-line-id="<id>"` 属性
以通过 CSS 进行样式化。

#### 高亮字符

你可以使用 `/`：

````md
\```js /carrot/

\```
````

或者 `"` 作为分隔符：

````md
\```js "carrot"
\```
````

也可以高亮不同的字符段：

````md
\```js /carrot/ /apple/

\```
````

字符 `<span>` 接收一个 `data-highlighted-chars` 属性以通过 CSS 进行样式化。

要只高亮 `carrot` 的第三到第五个实例，可以在最后一个 `/` 后面放置一个数字范围。

````md
\```js /carrot/3-5

\```
````

只高亮 `carrot` 的第三到第五个实例和 `apple` 的任何实例。

````md
\```js /carrot/3-5 /apple/

\```
````

#### 通过 Id 分组高亮字符

在字符后面放置一个 `#` 后面的 id。这允许你根据他们的 id 以不同的颜色对字符进行着色。

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

字符 `<span>` 接收一个 `data-chars-id="<id>"` 属性以通过 CSS 进行样式化。

#### 标题

在你的代码块中添加一个文件标题，文本在双引号 (`""`) 内：

````md
\```js title="..."

\```
````

#### 标题

在你的代码块下方添加一个标题，文本在双引号 (`""`) 内：

````md
\```js caption="..."

\```
````

### 行号

可以使用 CSS 计数器添加行号。

```css {2,6-7}
code {
  counter-reset: line;
}

code > [data-line]::before {
  counter-increment: line;
  content: counter(line);

  /* 其他样式 */
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

如果你想条件显示它们，使用 `showLineNumbers`：

````md
\```js showLineNumbers

\```
````

`<code>` 将具有属性 `data-line-numbers` 和
`data-line-numbers-max-digits="n"`。

如果你想从特定的数字开始行号，使用
`showLineNumbers{number}`：

````md
\```js showLineNumbers{number}

\```
````

### 多主题（深色和浅色模式）

将你的主题传递给 `theme`，其中键代表
颜色模式：

```js
const options = {
  theme: {
    dark: 'github-dark-dimmed',
    light: 'github-light'
  }
};
```

现在，使用以下 CSS 来显示变量颜色 —— 如果在主题名称中找到空格，那么基于对象的 CSS 变量键将可用
([更多信息](https://github.com/antfu/shikiji#lightdark-dual-themes))：

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

`<code>` 和 `<pre>` 元素将具有数据属性
`data-theme="...themes"`，列出每个主题值以空格分隔：

```html
<code data-theme="github-dark-dimmed github-light"></code>
```

### 访问者钩子

要自定义 HTML 输出，你可以使用访问者回调钩子直接操作
[hAST 元素](https://github.com/syntax-tree/hast#element)：

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

### 自定义高亮器

要完全配置高亮器，使用
`getHighlighter` 选项。如果你想配置其他 Shikiji 选项，如 `langs`，这将很有帮助。

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
