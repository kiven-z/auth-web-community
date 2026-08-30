import { MenuTypeEnums, type MenuTypeValue } from '@/features/system/_shared/constants/menu-type';
import type { TagSelectOption } from '@/shared/types/select-option';
import { computed, type ComputedRef } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 菜单类型选项（文案随 locale 更新）
 * @returns 菜单 / iframe / 外链三项
 */
export function useMenuTypeOptions(): ComputedRef<TagSelectOption<MenuTypeValue>[]> {
  const { t } = useI18n();

  return computed(() => [
    { value: MenuTypeEnums.MENU, label: t('sysMenu.menuTypeMenu'), tagType: 'primary' },
    { value: MenuTypeEnums.IFRAME, label: t('sysMenu.menuTypeIframe'), tagType: 'warning' },
    { value: MenuTypeEnums.EXTERNAL_LINK, label: t('sysMenu.menuTypeLink'), tagType: 'success' },
  ]);
}
