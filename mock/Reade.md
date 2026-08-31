## 模拟接口

### 使用方式

```ts
export default defineFakeRoute([
  {
    url: '/api/xxx',
    method: 'post',
    response: ({ body }) => {
      if (body.username === 'Administrator') {
        return { 你的数据 };
      } else {
        return 你的数据;
      }
    },
  },
]);
```

### 示例

```ts
// 根据角色动态生成路由
import { defineFakeRoute } from 'vite-plugin-fake-server/client';

const admin = {
  code: 200,
  message: 'success',
  error: null,
  timestamp: 1777797032757,
  data: {
    accessToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4MWJlYWNlNi0wYjY5LTRhYWMtOTJhOC1mYzk0ZDkwNTVjNGQiLCJpc3MiOiJhdXRoLXNlcnZpY2UiLCJzdWIiOiIxIiwiaWF0IjoxNzc3Nzk3MDMyLCJwZXJtX3ZlcnNpb24iOjAsInRva2VuX3R5cGUiOiJFWFRFUk5BTF9BQ0NFU1MiLCJleHAiOjE3Nzc4MDA2MzJ9.Ri0Nwf2DJ5MUjaue0Aro6wCq3g05_ukiRGSZTueU044',
    refreshToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4MWJlYWNlNi0wYjY5LTRhYWMtOTJhOC1mYzk0ZDkwNTVjNGQiLCJpc3MiOiJhdXRoLXNlcnZpY2UiLCJzdWIiOiIxIiwiaWF0IjoxNzc3Nzk3MDMyLCJ0b2tlbl90eXBlIjoiRVhURVJOQUxfUkVGUkVTSCIsImV4cCI6MTc3ODQwMTgzMn0._YuwcjKULsFzI8DgEtR5niu7ZqgnH83nYtmyCtVR23g',
    readMeDay: 7,
    expires: '2026/05/03 17:30:32',
    id: '1',
    username: 'Administrator',
    nickname: 'Administrator',
    avatar: '/api/local-file\\avatar\\2026-03-10\\69b03d0c0ad919423ede2696',
    roles: ['ADMIN'],
    permissions: ['*', '*:*', '*:*:*'],
  },
  ext: null,
};

const system = {
  code: 200,
  message: 'success',
  error: null,
  timestamp: 1777797114733,
  data: {
    accessToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzZDNjNjdhYS1lYzBmLTQ1NmQtODQ4NC02Mzg0MjA2MmUxODEiLCJpc3MiOiJhdXRoLXNlcnZpY2UiLCJzdWIiOiI0IiwiaWF0IjoxNzc3Nzk3MTE0LCJwZXJtX3ZlcnNpb24iOjAsInRva2VuX3R5cGUiOiJFWFRFUk5BTF9BQ0NFU1MiLCJleHAiOjE3Nzc4MDA3MTR9.G6Vljejj5rnKivV8S0H3pgbPqVti_yeH9W4Ic4PFEEg',
    refreshToken:
      'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIzZDNjNjdhYS1lYzBmLTQ1NmQtODQ4NC02Mzg0MjA2MmUxODEiLCJpc3MiOiJhdXRoLXNlcnZpY2UiLCJzdWIiOiI0IiwiaWF0IjoxNzc3Nzk3MTE0LCJ0b2tlbl90eXBlIjoiRVhURVJOQUxfUkVGUkVTSCIsImV4cCI6MTc3ODQwMTkxNH0.ZhxA72-znpJV2NkRTaDgSNs6rvFT3I7bKBTy7Tuvfv8',
    readMeDay: 7,
    expires: '2026/05/03 17:31:54',
    id: '4',
    username: 'system',
    nickname: '系统管理员',
    avatar: null,
    roles: ['USER'],
    permissions: [
      'sys:audit:log:view',
      'sys:menu:add',
      'sys:menu:edit',
      'sys:menu:list',
      'sys:finance:report:export',
      'sys:finance:report:view',
      'sys:project:create',
      'sys:project:edit',
      'sys:project:list',
      'sys:role:assign',
      'sys:role:list',
      'sys:user:add',
      'sys:user:delete',
      'sys:user:edit',
      'sys:user:list',
    ],
  },
  ext: null,
};

export default defineFakeRoute([
  {
    url: '/api/auth/login/username',
    method: 'post',
    response: ({ body }) => {
      if (body.username === 'Administrator') {
        return admin;
      } else {
        return system;
      }
    },
  },
]);
```
