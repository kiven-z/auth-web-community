import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

/** 启动 node 进程时所在工作目录的绝对路径 */
const root: string = process.cwd();

/**
 * 根据可选的路径片段生成绝对路径
 * @param dir 路径片段，默认 build
 * @param metaUrl 模块完整 url；在 build 目录外调用时必传 import.meta.url
 */
const pathResolve = (dir = '.', metaUrl = import.meta.url) => {
  const currentFileDir = dirname(fileURLToPath(metaUrl));
  const buildDir = resolve(currentFileDir, 'build');
  const resolvedPath = resolve(currentFileDir, dir);
  if (resolvedPath.startsWith(buildDir)) {
    return fileURLToPath(metaUrl);
  }
  return resolvedPath;
};

/** 路径别名 */
const alias: Record<string, string> = {
  '@': pathResolve('../src'),
  '@build': pathResolve(),
};

/**
 * 将 Vite loadEnv 结果转为类型化配置（含默认值）
 * @param envConf 原始环境变量
 */
const wrapperEnv = (envConf: Recordable): ViteEnv => {
  const ret: ViteEnv = {
    VITE_PORT: 5173,
    VITE_PUBLIC_PATH: '',
    VITE_PROXY_TARGET: 'http://localhost:8080',
    VITE_CDN: false,
    VITE_HIDE_HOME: 'false',
    VITE_COMPRESSION: 'none',
  };

  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n');
    if (realName === 'true') {
      realName = true;
    } else if (realName === 'false') {
      realName = false;
    }

    if (envName === 'VITE_PORT') {
      realName = Number(realName);
    }
    ret[envName] = realName;
    if (typeof realName === 'string') {
      process.env[envName] = realName;
    } else if (typeof realName === 'object') {
      process.env[envName] = JSON.stringify(realName);
    }
  }
  return ret;
};

export { root, pathResolve, alias, wrapperEnv };
