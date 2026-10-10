import AnalyticsIcon from "@mui/icons-material/Analytics";
import GroupIcon from "@mui/icons-material/Group";
import PaidIcon from "@mui/icons-material/Paid";
import { paths } from "@/constants/path";
import { SidebarListItem } from "./SidebarContent.types";
import { userRole } from "@/constants/user";
import { organizationRole } from "@/constants/organization";
import StoreIcon from "@mui/icons-material/Store";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export const sidebarList: SidebarListItem[] = [
  {
    title: "Dashboard",
    url: paths.dashboard,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <DashboardIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
    organizationRoleAccess: [organizationRole.ADMIN, organizationRole.OWNER],
  },
  {
    title: "Analytics",
    url: paths.analytics,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <AnalyticsIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
    organizationRoleAccess: [organizationRole.ADMIN, organizationRole.OWNER],
  },
  {
    groupName: "Transactions",
  },
  {
    title: "Purchases",
    url: paths.purchases,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <ShoppingCartIcon />,
    organizationRoleAccess: [
      organizationRole.ADMIN,
      organizationRole.OWNER,
      organizationRole.MEMBER,
    ],
  },
  {
    title: "Sales",
    url: paths.sales,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <PaidIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
    organizationRoleAccess: [organizationRole.ADMIN, organizationRole.OWNER],
  },
  {
    groupName: "Organizations",
  },
  {
    title: "User",
    url: paths.users,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <GroupIcon />,
    organizationRoleAccess: [
      organizationRole.ADMIN,
      organizationRole.OWNER,
      organizationRole.MEMBER,
    ],
  },
  {
    title: "Inventory",
    url: paths.base,
    icon: <InventoryOutlinedIcon />,
    child: [
      {
        title: "Items",
        url: paths.inventoryItems,
        params: "page=1&size=20&sortBy=-createdAt",
        organizationRoleAccess: [
          organizationRole.ADMIN,
          organizationRole.OWNER,
          organizationRole.MEMBER,
        ],
      },
      {
        title: "Transactions",
        url: paths.inventoryTransactions,
        params: "page=1&size=20&sortBy=-createdAt",
        organizationRoleAccess: [
          organizationRole.ADMIN,
          organizationRole.OWNER,
          organizationRole.MEMBER,
        ],
      },
    ],
    organizationRoleAccess: [
      organizationRole.ADMIN,
      organizationRole.OWNER,
      organizationRole.MEMBER,
    ],
  },
  {
    groupName: "Systems",
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
  },
  {
    title: "Semua User",
    url: paths.allUsers,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <GroupIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
  },
  {
    title: "UMKM",
    url: paths.umkm,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <StoreIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
  },
];
