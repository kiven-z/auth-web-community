import { config } from 'md-editor-v3';
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts';
import mermaid from 'mermaid';

import 'markdown-it-github-alerts/styles/github-base.css';
import 'markdown-it-github-alerts/styles/github-colors-light.css';
import '@/style/md/md-github-alerts.scss';

/**
 * 全局配置 md-editor-v3：本地扩展、Mermaid 主题、GitHub Alerts、预览图懒加载
 * @description 须在应用挂载前调用一次，勿在组件内重复 config。
 * 注入 mermaid instance 后库不会在首挂载走 CDN 加载分支，须自行 initialize，
 * 否则首屏 flowchart 可能停在源码占位态。
 */
export function setupMdEditor(): void {
  mermaid.initialize({
    startOnLoad: false,
    logLevel: 'error',
  });

  config({
    editorExtensions: {
      mermaid: {
        instance: mermaid,
      },
    },
    mermaidConfig(base) {
      return {
        ...base,
        startOnLoad: false,
        logLevel: 'error',
      };
    },
    markdownItPlugins(plugins) {
      const withImageLazy = plugins.map((item) => {
        if (item.type === 'image') {
          return {
            ...item,
            options: {
              ...item.options,
              lazy: true,
              async: true,
            },
          };
        }
        return item;
      });
      return [
        ...withImageLazy,
        {
          type: 'githubAlerts',
          plugin: MarkdownItGitHubAlerts,
          options: {},
        },
      ];
    },
  });
}
