interface MenuSearchListItem {
  path: string;
  meta?: {
    icon?: string;
    title?: string;
  };
}

interface MenuSearchOption extends MenuSearchListItem {
  type: 'history' | 'collect';
}

interface MenuSearchDrag {
  oldIndex: number;
  newIndex: number;
}

interface SearchListProps {
  value: string;
  options: MenuSearchListItem[];
}

interface SearchHistoryProps {
  value: string;
  options: MenuSearchOption[];
}

export type { MenuSearchDrag, MenuSearchOption, SearchHistoryProps, SearchListProps };
