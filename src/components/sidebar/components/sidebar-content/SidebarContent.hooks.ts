import { useState, useEffect } from "react";
import { sidebarList } from "./SidebarContent.constants";
import { useLocation } from "react-router-dom";
import useAuthStore from "@/store/auth-store";
import { SidebarListItem } from "./SidebarContent.types";

export default function useSidebarContent() {
  const location = useLocation();
  const authStore = useAuthStore((state) => state);
  const { user, organization } = authStore;

  const [isChildrenOpen, setIsChildrenOpen] = useState<boolean[]>(
    sidebarList.map(() => false),
  );
  const [menuActive, setMenuActive] = useState<string>("");

  const hasAccess = (sidebarItem: SidebarListItem) => {
    if (!sidebarItem.userRoleAccess && !sidebarItem.organizationRoleAccess) {
      return true;
    }

    const hasUserRoleAccess =
      user?.role !== undefined &&
      sidebarItem.userRoleAccess?.includes(user.role);

    const hasOrganizationRoleAccess =
      organization?.role !== undefined &&
      sidebarItem.organizationRoleAccess?.includes(organization.role);

    return Boolean(hasUserRoleAccess || hasOrganizationRoleAccess);
  };

  const filterSidebarItems = (items: SidebarListItem[]): SidebarListItem[] => {
    return items.reduce<SidebarListItem[]>((result, item) => {
      if (!hasAccess(item)) {
        return result;
      }

      if (item.child) {
        const child = filterSidebarItems(item.child);

        // Parent/group tidak ditampilkan kalau semua child tidak punya akses
        if (child.length === 0) {
          return result;
        }

        result.push({
          ...item,
          child,
        });

        return result;
      }

      result.push(item);

      return result;
    }, []);
  };

  const accessibleSidebarItems = filterSidebarItems(sidebarList);

  const handleParentOnClick = (indexParent: number) => {
    setIsChildrenOpen(
      isChildrenOpen.map((element: boolean, index: number) => {
        if (index === indexParent) return !element;
        return element;
      }),
    );
  };

  useEffect(() => {
    setMenuActive(location.pathname);
  }, [location]);

  return {
    accessibleSidebarItems,
    isChildrenOpen,
    menuActive,
    handleParentOnClick,
  };
}
