import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from 'vue';
import { withInstall } from '@/shared/vue/withInstall';

describe('withInstall', () => {
  it('adds install that registers the main component by name', () => {
    const Main = defineComponent({ name: 'DemoMain', setup: () => () => null });
    const installed = withInstall(Main);
    const component = vi.fn();
    const app = { component } as unknown as Parameters<NonNullable<typeof installed.install>>[0];

    installed.install?.(app);

    expect(component).toHaveBeenCalledWith('DemoMain', Main);
  });

  it('registers extra components and attaches them onto main', () => {
    const Main = defineComponent({ name: 'DemoMain', setup: () => () => null });
    const Extra = defineComponent({ name: 'DemoExtra', setup: () => () => null });
    const installed = withInstall(Main, { Extra });
    const component = vi.fn();
    const app = { component } as unknown as Parameters<NonNullable<typeof installed.install>>[0];

    installed.install?.(app);

    expect(component).toHaveBeenCalledWith('DemoMain', Main);
    expect(component).toHaveBeenCalledWith('DemoExtra', Extra);
    expect(installed.Extra).toBe(Extra);
  });

  it('skips registration when component has no name', () => {
    const Anonymous = defineComponent({ setup: () => () => null });
    const installed = withInstall(Anonymous);
    const component = vi.fn();
    const app = { component } as unknown as Parameters<NonNullable<typeof installed.install>>[0];

    installed.install?.(app);

    expect(component).not.toHaveBeenCalled();
  });
});
