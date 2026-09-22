import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CampaignIcon from "@mui/icons-material/Campaign";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import CastConnectedIcon from "@mui/icons-material/CastConnected";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import FolderIcon from "@mui/icons-material/Folder";
import ListIcon from "@mui/icons-material/List";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import GroupIcon from "@mui/icons-material/Group";
import PaidIcon from "@mui/icons-material/Paid";
import PaymentsIcon from "@mui/icons-material/Payments";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { paths } from "@/constants/path";
import { SidebarListItem } from "./SidebarContent.types";
import { userRole } from "@/constants/user";
import { organizationRole } from "@/constants/organization";
import StoreIcon from "@mui/icons-material/Store";
import DashboardIcon from "@mui/icons-material/Dashboard";

export const sidebarList: SidebarListItem[] = [
  // {
  //   title: "Balance",
  //   url: paths.base,
  //   icon: <AccountBalanceWallet />,
  //   child: [
  //     {
  //       title: "Current Balance",
  //       url: paths.balance,
  //       params: "page=1&size=10&sortBy=-lastModifiedDate",
  //       icon: <ListIcon />,
  //     },
  //     {
  //       title: "Pending Balance",
  //       url: paths.pendingBalance,
  //       params: "page=1&size=10&sortBy=-lastModifiedDate",
  //       icon: <ListIcon />,
  //     },
  //   ],
  // },
  // {
  //   title: "Payment",
  //   url: paths.payment,
  //   params: "page=1&size=10&sortBy=-lastModifiedDate",
  //   icon: <PaymentsIcon />,
  // },
  // {
  //   title: "Withdraw",
  //   url: paths.base,
  //   icon: <LocalAtmIcon />,
  //   child: [
  //     {
  //       title: "Config & List",
  //       url: paths.withdraw,
  //       params: "page=1&size=10&sortBy=-lastModifiedDate",
  //       icon: <ListIcon />,
  //     },
  //     {
  //       title: "Bank Master",
  //       url: paths.bankMaster,
  //       params: "page=1&size=10",
  //       icon: <ListIcon />,
  //     },
  //   ],
  // },
  // {
  //   title: "Auto Settlement",
  //   url: paths.autoSettlement,
  //   icon: <FlashOnIcon />,
  // },
  // {
  //   title: "Media Library",
  //   url: paths.mediaLibrary,
  //   params: "page=1&size=10&sortBy=-lastModifiedDate",
  //   icon: <FolderIcon />,
  // },
  {
    title: "Dashboard",
    url: paths.analytics,
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
    title: "Sales",
    url: paths.analytics,
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
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
    organizationRoleAccess: [organizationRole.ADMIN, organizationRole.OWNER],
  },
  { groupName: "Systems" },
  {
    title: "Semua User",
    url: paths.allUsers,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <GroupIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
    organizationRoleAccess: [organizationRole.ADMIN, organizationRole.OWNER],
  },
  {
    title: "UMKM",
    url: paths.umkm,
    params: "page=1&size=20&sortBy=-createdAt",
    icon: <StoreIcon />,
    userRoleAccess: [userRole.ADMIN, userRole.SUPER_ADMIN],
    organizationRoleAccess: [organizationRole.ADMIN, organizationRole.OWNER],
  },
];
