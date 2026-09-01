import login from './routes/login';
import personal from './routes/personal';
import systemShell from './routes/system-shell';
import userWorkstation from './routes/user-workstation';

/**
 * 不参与菜单树处理的边角静态路由（登录、个人空间、全屏异常页等）。
 * 与 modules/ 平级，由 router/routes 单独引入，勿放入 modules 以免被 glob 收进 constantRoutes。
 */
export default [...login, ...personal, ...userWorkstation, ...systemShell] satisfies Array<RouteConfigsTable>;
