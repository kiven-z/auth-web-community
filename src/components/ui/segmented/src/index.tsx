import { useRenderIcon } from '@/components/ui/icon';
import { useDark } from '@/shared/composables/theme/use-dark';
import { useResizeObserver } from '@vueuse/core';
import isFunction from 'lodash/isFunction';
import isNumber from 'lodash/isNumber';
import { defineComponent, getCurrentInstance, h, nextTick, type PropType, ref, toRef, useId, watch } from 'vue';
import './index.css';
import type { OptionsType } from './type';

const props = {
  options: {
    type: Array<OptionsType>,
    default: () => [],
  },
  /** 默认选中，按照第一个索引为 `0` 的模式（`modelValue`只有传`number`类型时才为响应式） */
  modelValue: {
    type: undefined,
    require: false,
    default: '0',
  },
  /** 将宽度调整为父元素宽度	 */
  block: {
    type: Boolean,
    default: false,
  },
  /** 控件尺寸 */
  size: {
    type: String as PropType<'small' | 'default' | 'large'>,
  },
  /** 是否全局禁用，默认 `false` */
  disabled: {
    type: Boolean,
    default: false,
  },
  /** 当内容发生变化时，设置 `resize` 可使其自适应容器位置 */
  resize: {
    type: Boolean,
    default: false,
  },
};

function renderOptionLabel(option: OptionsType) {
  if (!option.label) {
    return null;
  }
  return isFunction(option.label) ? h(option.label) : <span>{option.label}</span>;
}

function renderOptionIcon(option: OptionsType) {
  if (!option.icon || isFunction(option.label)) {
    return null;
  }
  return (
    <span class="auth-segmented-item-icon" style={{ marginRight: option.label ? '6px' : 0 }}>
      {h(
        useRenderIcon(option.icon, {
          ...option?.iconAttrs,
        })
      )}
    </span>
  );
}

export default defineComponent({
  name: 'Segmented',
  props,
  emits: ['change', 'update:modelValue'],
  setup(props, { emit }) {
    const width = ref(0);
    const translateX = ref(0);
    const { isDark } = useDark();
    const initStatus = ref(false);
    const segmentedRootRef = ref<HTMLDivElement>();
    const instance = getCurrentInstance();
    if (!instance) {
      throw new Error('Segmented must be used inside setup()');
    }
    const curIndex = isNumber(props.modelValue) ? toRef(props, 'modelValue') : ref(0);
    const groupName = `auth-segmented-${useId()}`;

    function handleChange({ option, index }: { option: OptionsType; index: number }) {
      if (props.disabled || option.disabled) {
        return;
      }
      if (curIndex.value === index) {
        return;
      }
      if (isNumber(props.modelValue)) {
        emit('update:modelValue', index);
      } else {
        curIndex.value = index;
      }
      emit('change', { index, option });
    }

    function handleInit(index = curIndex.value) {
      nextTick(() => {
        const curLabelRef = instance?.proxy?.$refs[`labelRef${index}`] as ElRef;
        if (!curLabelRef) return;
        width.value = curLabelRef.clientWidth;
        translateX.value = curLabelRef.offsetLeft;
        initStatus.value = true;
      });
    }

    if (props.block || props.resize) {
      useResizeObserver(segmentedRootRef, () => {
        nextTick(() => {
          handleInit(curIndex.value);
        });
      });
    }

    watch(
      () => curIndex.value,
      (index) => {
        nextTick(() => {
          handleInit(index);
        });
      },
      {
        immediate: true,
      }
    );

    watch(
      () => props.size,
      () => {
        handleInit(curIndex.value);
      }
    );

    const rendLabel = () => {
      return props.options.map((option, index) => {
        const itemDisabled = props.disabled || option?.disabled;
        const selected = curIndex.value === index;
        return (
          <label
            ref={`labelRef${index}`}
            class={[
              'auth-segmented-item',
              itemDisabled && 'auth-segmented-item-disabled',
              selected && 'auth-segmented-item-active',
            ]}
          >
            <input
              type="radio"
              name={groupName}
              checked={selected}
              disabled={itemDisabled}
              onChange={() => handleChange({ option, index })}
            />
            <div
              class="auth-segmented-item-label"
              v-tippy={{
                content: option?.tip,
                zIndex: 41000,
              }}
            >
              {renderOptionIcon(option)}
              {renderOptionLabel(option)}
            </div>
          </label>
        );
      });
    };

    return () => (
      <div
        ref={segmentedRootRef}
        class={{
          'auth-segmented': true,
          'auth-segmented-block': props.block,
          'auth-segmented--large': props.size === 'large',
          'auth-segmented--small': props.size === 'small',
          'auth-segmented--dark': isDark.value,
          'auth-segmented--disabled': props.disabled,
        }}
      >
        <div class="auth-segmented-group">
          <div
            class="auth-segmented-item-selected"
            style={{
              width: `${width.value}px`,
              transform: `translateX(${translateX.value}px)`,
              display: initStatus.value ? 'block' : 'none',
            }}
          ></div>
          {rendLabel()}
        </div>
      </div>
    );
  },
});
