export const MenuTypeEnums = {
  MENU: 0,
  IFRAME: 1,
  EXTERNAL_LINK: 2,
} as const;

export type MenuTypeValue = (typeof MenuTypeEnums)[keyof typeof MenuTypeEnums];
