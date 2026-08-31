import { SessionEndedError } from '@/core/http/apiError';
import { errorMessage } from '@/services/feedback/message';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { elMessageMock } = vi.hoisted(() => ({
  elMessageMock: vi.fn(),
}));

vi.mock('element-plus', () => ({
  ElMessage: elMessageMock,
}));

vi.mock('@/app/plugins/i18n', () => ({
  transformI18n: (key: string) => key,
}));

describe('errorMessage', () => {
  beforeEach(() => {
    elMessageMock.mockReset();
  });

  it('skips toast for SessionEndedError without explicit message', () => {
    const result = errorMessage(new SessionEndedError());
    expect(result).toBeUndefined();
    expect(elMessageMock).not.toHaveBeenCalled();
  });

  it('skips toast for cancel-marked errors', () => {
    const result = errorMessage({ isCancelRequest: true, message: 'canceled' });
    expect(result).toBeUndefined();
    expect(elMessageMock).not.toHaveBeenCalled();
  });

  it('shows toast for normal Error', () => {
    errorMessage(new Error('业务失败'), { appendTo: {} as HTMLElement });
    expect(elMessageMock).toHaveBeenCalledTimes(1);
    expect(elMessageMock.mock.calls[0]?.[0]).toMatchObject({
      message: '业务失败',
      type: 'error',
    });
  });

  it('shows explicit message even when error would skip', () => {
    errorMessage(new SessionEndedError(), { message: '强制提示', appendTo: {} as HTMLElement });
    expect(elMessageMock).toHaveBeenCalledTimes(1);
    expect(elMessageMock.mock.calls[0]?.[0]).toMatchObject({
      message: '强制提示',
      type: 'error',
    });
  });
});
