import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: 'Rodebiau',
  description: '一个同时承载个人主页、博客与知识库的 VitePress 数字花园。',
  cleanUrls: true,
  lastUpdated: true,
  head: [
    ['meta', { name: 'theme-color', content: '#1b4332' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: 'Rodebiau' }],
    ['meta', { property: 'og:description', content: '个人主页、博客与知识库三位一体的数字空间。' }],
    ['meta', { property: 'og:locale', content: 'zh_CN' }]
  ],
  themeConfig: {
    logo: '/logo.svg',
    siteTitle: 'Rodebiau',
    search: {
      provider: 'local'
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '博客', link: '/blog/' },
      { text: '知识库', link: '/notes/' },
      { text: '项目', link: '/projects' },
      { text: '关于', link: '/about' }
    ],
    sidebar: {
      '/blog/': [
        {
          text: '博客导览',
          items: [
            { text: '博客首页', link: '/blog/' },
            { text: '写作说明', link: '/blog/writing' }
          ]
        },
        {
          text: '近期文章',
          items: [
            { text: '用 VitePress 搭自己的数字花园', link: '/blog/digital-garden-with-vitepress' },
            { text: '个人知识库的目录应该怎么设计', link: '/blog/knowledge-base-information-architecture' }
          ]
        }
      ],
      '/notes/': [
        {
          text: '知识库导览',
          items: [
            { text: '知识库首页', link: '/notes/' },
            { text: '知识地图', link: '/notes/map' }
          ]
        },
        {
          text: '写作与内容',
          items: [
            { text: '我的写作工作流', link: '/notes/writing/workflow' }
          ]
        },
        {
          text: '工具与工程',
          items: [
            { text: 'VitePress 站点维护清单', link: '/notes/tools/vitepress-maintenance' }
          ]
        },
        {
          text: '思考方法',
          items: [
            { text: '知识管理的最小系统', link: '/notes/thinking/knowledge-management-minimum-system' }
          ]
        }
      ]
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/' }
    ],
    footer: {
      message: 'Built with VitePress for writing, thinking, and shipping ideas.',
      copyright: 'Copyright © 2026 Rodebiau'
    },
    docFooter: {
      prev: '上一篇',
      next: '下一篇'
    },
    outline: {
      label: '本页内容'
    },
    lastUpdated: {
      text: '最后更新于'
    }
  }
})
