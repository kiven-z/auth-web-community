declare module 'vue' {
  export interface GlobalComponents {
    DataTable: (typeof import('@/components/table/DataTable'))['default'];
    ListTable: (typeof import('@/components/table/ListTable'))['default'];
  }
}
export {};
