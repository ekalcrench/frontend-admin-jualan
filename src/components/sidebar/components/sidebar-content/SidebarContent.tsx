import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Button, Collapse } from "@mui/material";
import { Link } from "react-router-dom";
import { sidebarList } from "./SidebarContent.constants";
import { SidebarListItem } from "./SidebarContent.types";
import useSidebarContent from "./SidebarContent.hooks";
import { CustomLink } from "@/styled/CustomLink";
import { LogoutButton } from "../logout-button";

export default function SidebarContent() {
  const { isChildrenOpen, menuActive, handleParentOnClick } =
    useSidebarContent();

  return (
    <Box>
      <Toolbar>
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          Seblak Kang Azmi
        </Typography>
      </Toolbar>
      <List>
        {sidebarList.map((sidebarItem: SidebarListItem, index: number) => {
          if (sidebarItem.child === undefined) {
            let isActive = false;

            if (menuActive === sidebarItem.url) isActive = true;

            let href = sidebarItem.url;
            if (sidebarItem.params) {
              href = `${href}?${sidebarItem.params}`;
            }

            return (
              <Box key={index}>
                <CustomLink to={href}>
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
              </Box>
            );
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
                {sidebarItem.child.map((childItem, childIndex) => {
                  let isActive = false;

                  if (menuActive === childItem.url) isActive = true;

                  let href = childItem.url;
                  if (childItem.params) {
                    href = `${href}?${childItem.params}`;
                  }
                  return (
                    <Link to={href} key={childIndex}>
                      <ListItem key={childIndex}>
                        <ListItemButton
                          className={
                            isActive
                              ? "active-sidebar child-sidebar"
                              : "child-sidebar"
                          }
                          sx={{
                            backgroundColor: isActive
                              ? "background.sidebarActive"
                              : "transparent",
                            pointerEvents: isActive ? "none" : undefined,
                          }}
                        >
                          <ListItemIcon
                            className={
                              isActive ? "active-item-icon" : undefined
                            }
                          >
                            {childItem.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={childItem.title}
                            className={
                              isActive ? "active-item-text" : undefined
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  );
                })}
              </Collapse>
            </Box>
          );
        })}
      </List>

      <List>
        <ListItem>
          <LogoutButton />
        </ListItem>
      </List>
    </Box>
  );
}
