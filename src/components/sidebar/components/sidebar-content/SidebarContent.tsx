import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Collapse } from "@mui/material";
import { SidebarListItem } from "./SidebarContent.types";
import useSidebarContent from "./SidebarContent.hooks";
import { CustomLink } from "@/styled/CustomLink";
import { LogoutButton } from "../logout-button";

export default function SidebarContent() {
  const {
    accessibleSidebarItems,
    isChildrenOpen,
    menuActive,
    handleParentOnClick,
  } = useSidebarContent();

  const childMenu = (sidebarItem: SidebarListItem, index: number) => {
    let isActive = false;
    if (menuActive === sidebarItem.url) isActive = true;

    let href = sidebarItem.url;
    if (sidebarItem.params) {
      href = `${href}?${sidebarItem.params}`;
    }

    return (
      <CustomLink key={index} to={href}>
        <ListItem sx={{ padding: 0 }}>
          <ListItemButton
            className={
              isActive && sidebarItem?.child
                ? undefined
                : isActive
                  ? "active-sidebar"
                  : undefined
            }
          >
            <ListItemIcon>{sidebarItem.icon}</ListItemIcon>
            <ListItemText
              primary={sidebarItem.title}
              className={isActive ? "active-item-text" : undefined}
            />
          </ListItemButton>
        </ListItem>
      </CustomLink>
    );
  };

  return (
    <Box>
      <Toolbar>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Seblak Kang Azmi
        </Typography>
      </Toolbar>
      <List>
        {accessibleSidebarItems.map(
          (sidebarItem: SidebarListItem, index: number) => {
            if (sidebarItem.child === undefined) {
              return childMenu(sidebarItem, index);
            }

            let isParentActive = false;
            const menuA = sidebarItem.child.find((child) => {
              if (menuActive === child.url) return true;
              return false;
            });
            if (menuA) isParentActive = true;

            return (
              <Box key={index}>
                <ListItem onClick={() => handleParentOnClick(index)}>
                  <ListItemButton
                    className={
                      isParentActive && !isChildrenOpen[index]
                        ? "active-sidebar-parent"
                        : undefined
                    }
                    sx={{
                      backgroundColor:
                        isParentActive && !isChildrenOpen[index]
                          ? "background.sidebarActive"
                          : "transparent",
                    }}
                  >
                    <ListItemIcon
                      className={
                        isParentActive && !isChildrenOpen[index]
                          ? "active-item-icon-parent"
                          : undefined
                      }
                    >
                      {sidebarItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={sidebarItem.title}
                      className={
                        isParentActive && !isChildrenOpen[index]
                          ? "active-item-text-parent"
                          : undefined
                      }
                    />
                  </ListItemButton>
                </ListItem>

                <Collapse in={isChildrenOpen[index]} orientation="vertical">
                  {sidebarItem.child.map((childItem, childIndex) =>
                    childMenu(childItem, index * 100 + childIndex),
                  )}
                </Collapse>
              </Box>
            );
          },
        )}
      </List>

      <List>
        <ListItem>
          <LogoutButton />
        </ListItem>
      </List>
    </Box>
  );
}
