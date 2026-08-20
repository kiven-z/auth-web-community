import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { copyToClipboard } from '@/shared/utils/clipboard';
import { message } from '@/services/feedback/message';

vi.mock('@/services/feedback/message', () => ({
  message: vi.fn(),
}));

function stubExecCommandCopy(success: boolean) {
  const execCommand = vi.fn().mockReturnValue(success);
  vi.stubGlobal('document', {
    createElement: (tag: string) => {
      if (tag !== 'textarea') {
        throw new Error(`unexpected tag: ${tag}`);
      }
      return {
        value: '',
        style: {},
        setAttribute: vi.fn(),
        select: vi.fn(),
        setSelectionRange: vi.fn(),
        remove: vi.fn(),
      };
    },
    body: {
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    },
    execCommand,
  });
  return execCommand;
}

describe('copyToClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns false for empty values without showing feedback', () => {
    const navigatorWriteText = vi.fn();
    vi.stubGlobal('navigator', { clipboard: { writeText: navigatorWriteText } });

    return Promise.all([
      expect(copyToClipboard(undefined)).resolves.toBe(false),
      expect(copyToClipboard(null)).resolves.toBe(false),
      expect(copyToClipboard('')).resolves.toBe(false),
      expect(copyToClipboard('   ')).resolves.toBe(false),
    ]).then(() => {
      expect(message).not.toHaveBeenCalled();
      expect(navigatorWriteText).not.toHaveBeenCalled();
    });
  });

  it('copies plain string via Clipboard API and shows success feedback', async () => {
    const clipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };
    vi.stubGlobal('navigator', { clipboard });

    const ok = await copyToClipboard('hello');
    expect(ok).toBe(true);
    expect(clipboard.writeText).toHaveBeenCalledWith('hello');
    expect(message).toHaveBeenCalledWith('复制成功', { type: 'success' });
  });

  it('serializes object values as JSON before copying', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    const ok = await copyToClipboard({ id: '1', name: 'demo' });
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('{"id":"1","name":"demo"}');
    expect(message).toHaveBeenCalledWith('复制成功', { type: 'success' });
  });

  it('copies number and boolean via Clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    await expect(copyToClipboard(42)).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('42');

    writeText.mockClear();
    await expect(copyToClipboard(true)).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith('true');
  });

  it('returns false for non-serializable non-scalars', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText } });

    await expect(copyToClipboard(Symbol('x'))).resolves.toBe(false);
    expect(writeText).not.toHaveBeenCalled();
  });

  it('falls back to execCommand when Clipboard API rejects', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('no-permission'));
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    const execCommand = stubExecCommandCopy(true);

    const ok = await copyToClipboard('hello');
    expect(ok).toBe(true);
    expect(writeText).toHaveBeenCalledWith('hello');
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(message).toHaveBeenCalledWith('复制成功', { type: 'success' });
  });

  it('falls back to execCommand when Clipboard API is unavailable', async () => {
    vi.stubGlobal('navigator', undefined);
    const execCommand = stubExecCommandCopy(true);

    const ok = await copyToClipboard('hello');
    expect(ok).toBe(true);
    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(message).toHaveBeenCalledWith('复制成功', { type: 'success' });
  });

  it('shows failure feedback when both clipboard strategies fail', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('no-permission'));
    vi.stubGlobal('navigator', { clipboard: { writeText } });
    stubExecCommandCopy(false);

    const ok = await copyToClipboard('hello');
    expect(ok).toBe(false);
    expect(message).toHaveBeenCalledWith('复制失败', { type: 'error' });
  });
});
