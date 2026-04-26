declare module 'markdown-it-katex' {
  import type MarkdownIt from 'markdown-it'

  interface MarkdownItKatexOptions {
    throwOnError?: boolean
    errorColor?: string
    macros?: Record<string, string>
  }

  const markdownItKatex: MarkdownIt.PluginWithOptions<MarkdownItKatexOptions>
  export default markdownItKatex
}
