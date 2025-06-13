export type Bookmark = {
  id: string;
  title: string;
  url: string;
  favicon?: string;
};

export type GridSettings = {
  columns: number;
  rows: number;
  gap: number;
};

export type Settings = {
  showIcons: boolean;
  showTitles: boolean;
  showUrls: boolean;
  showAddButton: boolean;
  showDeleteButton: boolean;
  showEditButton: boolean;
  showMoveButton: boolean;
  showBackgroundSettings: boolean;
  showGridSettings: boolean;
  showSettings: boolean;
  backgroundImage?: string;
}; 