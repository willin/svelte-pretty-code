import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import remarkGfm from 'remark-gfm';
import remarkGithub from 'remark-github';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { createHighlighter } from '@svelte-dev/pretty-code';

const config = defineConfig({
  extensions: ['.svelte.md', '.md', '.svx'],
  layout: {
    _: './src/lib/components/mdsvex.svelte'
  },
  highlight: {
    highlighter: createHighlighter({
      // keepBackground: false,
      theme: {
        dark: 'solarized-dark',
        light: 'solarized-light'
      },
      onVisitLine(node) {
        // Prevent lines from collapsing in `display: grid` mode, and allow empty
        // lines to be copy/pasted
        if (node.children.length === 0) {
          node.children = [{ type: 'text', value: ' ' }];
        }
      },
      onVisitHighlightedLine(node) {
        if (node.properties.className) {
          node.properties.className.push('line--highlighted');
        } else {
          node.properties.className = ['line--highlighted'];
        }
      },
      onVisitHighlightedWord(node) {
        node.properties.className = ['word--highlighted'];
      }
    })
  },
  rehypePlugins: [
    rehypeSlug,
    [
      rehypeAutolinkHeadings,
      {
        behavior: 'wrap',
        properties: {
          className: ['anchor']
        }
      }
    ]
  ],
  remarkPlugins: [
    remarkGfm,
    [
      remarkGithub,
      {
        repository: 'willin/svelte-turbo'
      }
    ]
  ],
  smartypants: {
    dashes: 'oldschool'
  }
});

export default config;
