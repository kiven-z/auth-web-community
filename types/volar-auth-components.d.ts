declare module 'vue' {
  export interface GlobalComponents {
    DataTable: (typeof import('@/components/table/data-table'))['default'];
    ListTable: (typeof import('@/components/table/list-table'))['default'];
  }
}
export {};
