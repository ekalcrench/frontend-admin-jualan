import { useState, useEffect } from "react";
import { sidebarList } from "./SidebarContent.constants";
import { useLocation } from "react-router-dom";

export default function useSidebarContent() {
  const location = useLocation();

  const [isChildrenOpen, setIsChildrenOpen] = useState<boolean[]>(
    sidebarList.map(() => false),
  );
  const [menuActive, setMenuActive] = useState<string>("");

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
    isChildrenOpen,
    menuActive,
    handleParentOnClick,
  };
}
