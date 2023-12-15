import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import remarkGfm from 'remark-gfm';
import remarkGithub from 'remark-github';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { createHighlighter } from '@svelte-dev/pretty-code';

const config = defineConfig({
  extensions: ['.svelte.md', '.md', '.svx'],
  highlight: {
    highlighter: createHighlighter({
      // theme: 'css-variables'
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
