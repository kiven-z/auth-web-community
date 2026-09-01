import { useUserStore } from '@/store/modules/auth/user';
import { useDark } from '@/shared/composables/theme/use-dark';
import { computed } from 'vue';

/** 水印单格宽高（px） */
const TILE_WIDTH = 240;
const TILE_HEIGHT = 160;
/** 旋转角度（度） */
const ROTATE_DEGREE = -26;
const FONT_SIZE = 16;

/**
 * 将会话文案绘制为可平铺的 canvas data URL。
 * @param lines 水印行（部门 / username）
 * @param color 字体颜色
 * @returns CSS background-image 可用的 data URL；无文案时返回空串
 */
export function buildWatermarkDataUrl(lines: string[], color: string): string {
  if (lines.length === 0 || typeof document === 'undefined') {
    return '';
  }

  const canvas = document.createElement('canvas');
  canvas.width = TILE_WIDTH;
  canvas.height = TILE_HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) {
    return '';
  }

  context.clearRect(0, 0, TILE_WIDTH, TILE_HEIGHT);
  context.fillStyle = color;
  context.font = `${FONT_SIZE}px sans-serif`;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.translate(TILE_WIDTH / 2, TILE_HEIGHT / 2);
  context.rotate((Math.PI / 180) * ROTATE_DEGREE);

  const lineHeight = FONT_SIZE + 6;
  const startY = -((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, index) => {
    context.fillText(line, 0, startY + index * lineHeight);
  });

  return `url(${canvas.toDataURL()})`;
}

/**
 * 全局会话水印：部门（可选）+ username，两行展示。
 * @returns 水印行文案、颜色与是否可见
 */
export function useSessionWatermark() {
  const userStore = useUserStore();
  const { isDark } = useDark();

  /** 第一行部门，第二行 username；无部门时仅 username */
  const watermarkLines = computed(() => {
    const username = userStore.username?.trim();
    if (!username) {
      return [] as string[];
    }
    const departmentName = userStore.primaryDeptName?.trim();
    return departmentName ? [departmentName, username] : [username];
  });

  const watermarkColor = computed(() => (isDark.value ? 'rgba(255, 255, 255, 0.16)' : 'rgba(0, 0, 0, 0.16)'));

  const watermarkVisible = computed(() => watermarkLines.value.length > 0);

  return {
    watermarkLines,
    watermarkColor,
    watermarkVisible,
  };
}
