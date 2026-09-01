import { config } from 'md-editor-v3';
import MarkdownItGitHubAlerts from 'markdown-it-github-alerts';
import mermaid from 'mermaid';

import 'markdown-it-github-alerts/styles/github-base.css';
import 'markdown-it-github-alerts/styles/github-colors-light.css';
import '@/style/md/md-github-alerts.scss';

let configured = false;

/**
 * 配置 md-editor-v3：本地 Mermaid、GitHub Alerts、预览图懒加载。
 * 须在首次挂载 MdEditor / MdPreview 前调用；重复调用无效。
 * 注入 mermaid instance 后库不会走 CDN 加载分支，须自行 initialize，否则 flowchart 会停在源码占位态。
 */
export function setupMdEditor(): void {
  if (configured) {
    return;
  }
  configured = true;

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
