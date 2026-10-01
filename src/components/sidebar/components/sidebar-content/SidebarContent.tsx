import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { Avatar, Collapse } from "@mui/material";
import { SidebarListItem } from "./SidebarContent.types";
import useSidebarContent from "./SidebarContent.hooks";
import { CustomLink } from "@/styled/CustomLink";
import LogoutButton from "../logout-button";
import { storageBaseUrl } from "@/constants/api";
import { OrganizationName, TopSidebar } from "./SidebarContent.styles";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

export default function SidebarContent() {
  const {
    accessibleSidebarItems,
    isChildrenOpen,
    menuActive,
    organization,
    handleParentOnClick,
  } = useSidebarContent();

  const childMenu = (sidebarItem: SidebarListItem, hasParent?: boolean) => {
    let isActive = false;
    if (menuActive === sidebarItem.url) isActive = true;

    let href = sidebarItem.url ?? "";
    if (sidebarItem.params) {
      href = `${href}?${sidebarItem.params}`;
    }

    return (
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
            sx={{ ...(hasParent && { paddingLeft: "52px" }) }}
          >
            {sidebarItem.icon && (
              <ListItemIcon>{sidebarItem.icon}</ListItemIcon>
            )}
            <ListItemText
              primary={sidebarItem.title}
              className={isActive ? "active-item-text" : undefined}
            />
          </ListItemButton>
        </ListItem>
      </CustomLink>
    );
  };

  const renderGroupname = (groupName: string) => {
    return (
      <ListItem sx={{ marginTop: "16px" }}>
        <Typography sx={{ fontWeight: 700 }}>{groupName}</Typography>
      </ListItem>
    );
  };

  return (
    <Box>
      <TopSidebar>
        <Avatar
          alt="umkm"
          src={`${storageBaseUrl}${organization?.logoUrl}`}
          sx={{ width: 32, height: 32 }}
        />
        <OrganizationName>{organization?.name ?? ""}</OrganizationName>
      </TopSidebar>
      <List>
        {accessibleSidebarItems.map(
          (sidebarItem: SidebarListItem, index: number) => {
            if (sidebarItem.groupName) {
              return renderGroupname(sidebarItem.groupName);
            }

            if (sidebarItem.child === undefined) {
              return <Box key={index}>{childMenu(sidebarItem)}</Box>;
            }

            let isParentActive = false;
            const menuA = sidebarItem.child.find((child) => {
              if (menuActive === child.url) return true;
              return false;
            });
            if (menuA) isParentActive = true;

            return (
              <Box key={index}>
                <ListItem
                  sx={{ padding: 0, cursor: "pointer" }}
                  onClick={() => handleParentOnClick(index)}
                >
                  <ListItemButton
                    className={
                      isParentActive && !isChildrenOpen[index]
                        ? "active-sidebar"
                        : undefined
                    }
                  >
                    <ListItemIcon>{sidebarItem.icon}</ListItemIcon>
                    <ListItemText
                      primary={sidebarItem.title}
                      className={
                        isParentActive && !isChildrenOpen[index]
                          ? "active-item-text"
                          : undefined
                      }
                    />
                    {isChildrenOpen[index] ? (
                      <ArrowDropUpIcon />
                    ) : (
                      <ArrowDropDownIcon
                        sx={{
                          color: isParentActive
                            ? "text.sidebarActive"
                            : "text.sidebar",
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>

                <Collapse in={isChildrenOpen[index]} orientation="vertical">
                  {sidebarItem.child.map((childItem, childIndex) => (
                    <Box key={index * 100 + childIndex}>
                      {childMenu(childItem, true)}
                    </Box>
                  ))}
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
