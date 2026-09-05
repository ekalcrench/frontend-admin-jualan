export interface SidebarListItem {
  title: string;
  url: string;
  icon: React.ReactNode;
  params?: string;
  child?: SidebarListItem[];
}
