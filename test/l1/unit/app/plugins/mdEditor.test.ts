import { describe, expect, it, vi } from 'vitest';

const { configMock, mermaidInitialize, githubAlertsPlugin } = vi.hoisted(() => ({
  configMock: vi.fn(),
  mermaidInitialize: vi.fn(),
  githubAlertsPlugin: vi.fn(),
}));

vi.mock('md-editor-v3', () => ({
  config: configMock,
}));

vi.mock('mermaid', () => ({
  default: { initialize: mermaidInitialize },
}));

vi.mock('markdown-it-github-alerts', () => ({
  default: githubAlertsPlugin,
}));

vi.mock('markdown-it-github-alerts/styles/github-base.css', () => ({}));
vi.mock('markdown-it-github-alerts/styles/github-colors-light.css', () => ({}));
vi.mock('@/style/md/md-github-alerts.scss', () => ({}));

describe('setupMdEditor', () => {
  it('configures mermaid and md-editor once', async () => {
    const mermaid = (await import('mermaid')).default;
    const { setupMdEditor } = await import('@/app/plugins/mdEditor');

    setupMdEditor();
    setupMdEditor();

    expect(mermaidInitialize).toHaveBeenCalledTimes(1);
    expect(mermaidInitialize).toHaveBeenCalledWith({ startOnLoad: false, logLevel: 'error' });
    expect(configMock).toHaveBeenCalledTimes(1);

    const options = configMock.mock.calls[0][0];

    expect(options.editorExtensions.mermaid.instance).toBe(mermaid);
    expect(options.mermaidConfig({ theme: 'default' })).toEqual({
      theme: 'default',
      startOnLoad: false,
      logLevel: 'error',
    });

    const imagePlugin = { type: 'image', options: { foo: 1 } };
    const otherPlugin = { type: 'link', options: {} };
    const plugins = options.markdownItPlugins([imagePlugin, otherPlugin]);

    expect(plugins[0]).toEqual({
      type: 'image',
      options: { foo: 1, lazy: true, async: true },
    });
    expect(plugins[1]).toBe(otherPlugin);
    expect(plugins[2]).toEqual({
      type: 'githubAlerts',
      plugin: githubAlertsPlugin,
      options: {},
    });
  });
});
