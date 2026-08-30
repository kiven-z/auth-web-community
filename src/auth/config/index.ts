import axios from 'axios';
import type { App } from 'vue';

let config: object = {};
const { VITE_PUBLIC_PATH } = import.meta.env;

const setConfig = (cfg?: unknown) => {
  config = Object.assign(config, cfg);
};

/**
 * 获取配置项的值
 * @param key 配置项的键
 * @returns 配置项的值
 */
const getConfig = (key?: string): PlatformConfigs => {
  if (typeof key === 'string') {
    const arr = key.split('.');
    if (arr.length) {
      let data: any = config;
      arr.forEach((v) => {
        // 可选链表达式 + 直接比较 undefined，避免 typeof
        if (data?.[v] === undefined) {
          data = null;
        } else {
          data = data[v];
        }
      });
      return data;
    }
  }
  return config;
};

/**
 * 获取项目动态全局配置
 * @param app Vue 应用实例
 */
export const getPlatformConfig = async (app: App): Promise<undefined> => {
  app.config.globalProperties.$config = getConfig();
  return axios({
    method: 'get',
    url: `${VITE_PUBLIC_PATH}platform-config.json`,
  })
    .then(({ data: config }) => {
      let $config = app.config.globalProperties.$config;
      // 自动注入系统配置
      if (app && $config && typeof config === 'object') {
        $config = Object.assign($config, config);
        app.config.globalProperties.$config = $config;
        // 设置全局配置
        setConfig($config);
      }
      return $config;
    })
    .catch(() => {
      throw new Error('请在public文件夹下添加platform-config.json配置文件');
    });
};

/** 本地响应式存储的命名空间 */
const responsiveStorageNameSpace = () => getConfig().ResponsiveStorageNameSpace;

export { getConfig, responsiveStorageNameSpace };
